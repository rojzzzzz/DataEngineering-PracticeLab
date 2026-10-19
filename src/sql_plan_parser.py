"""PostgreSQL EXPLAIN adapters; preserve source metrics without inventing totals."""
import json
import math
import re
from src.sql_tools_graph import Graph, MAX_PLAN


def _text_detail(properties, text):
    """Normalize supported text metrics while retaining the original detail line."""
    key, _, value = text.partition(":")
    value = value.strip()
    if key in {"Filter", "Index Cond", "Recheck Cond", "Hash Cond", "Merge Cond", "Join Filter", "Sort Key", "Group Key"}:
        properties[key] = value
    if key in {"Rows Removed by Filter", "Rows Removed by Join Filter", "Heap Fetches", "Workers Planned", "Workers Launched"} and re.fullmatch(r"[\d.e+-]+", value):
        number = float(value)
        if math.isfinite(number):
            properties[key] = number
    if key == "Buffers":
        for group in re.finditer(r"\b(shared|local|temp)\s+([^,]+)", value):
            prefix = group[1].title()
            for metric in re.finditer(r"\b(hit|read|dirtied|written)=(\d+)\b", group[2]):
                properties[f"{prefix} {metric[1].title()} Blocks"] = int(metric[2])
    if key == "Sort Method":
        match = re.fullmatch(r"(.+?)\s+(Memory|Disk):\s*([\d.]+)kB", value)
        if match:
            properties.update({"Sort Method": match[1].strip(), "Sort Space Type": match[2], "Sort Space Used": float(match[3])})
        else:
            properties[key] = value
    if key == "Buckets":
        for pattern, name in ((r"Buckets:\s*(\d+)", "Hash Buckets"), (r"(?<!Original )Batches:\s*(\d+)", "Hash Batches"), (r"Memory Usage:\s*([\d.]+)kB", "Peak Memory Usage")):
            match = re.search(pattern, text)
            if match:
                properties[name] = float(match[1])


def parse_plan(source, format="auto"):
    if not isinstance(source, str) or not source.strip() or len(source.encode("utf-8")) > MAX_PLAN:
        raise ValueError("Paste an EXPLAIN plan up to 2 MB.")
    if format not in {"auto", "json", "text"}:
        raise ValueError("Choose automatic, JSON, or text plan format.")
    chosen = ("json" if source.lstrip().startswith(("[", "{")) else "text") if format == "auto" else format
    graph = Graph()
    summary = {}
    if chosen == "json":
        def reject_constant(value):
            raise ValueError(f"Invalid JSON number: {value}")
        def finite_float(value):
            number = float(value)
            if not math.isfinite(number):
                raise ValueError("Invalid JSON number: non-finite value")
            return number
        data = json.loads(source, parse_constant=reject_constant, parse_float=finite_float)
        plans = data if isinstance(data, list) else [data]
        if not plans or not all(isinstance(item, dict) and isinstance(item.get("Plan"), dict) for item in plans):
            raise ValueError("Expected PostgreSQL EXPLAIN JSON containing a Plan object. Export raw JSON without table borders.")

        def walk(node, parent=None):
            if not isinstance(node, dict) or not isinstance(node.get("Node Type"), str):
                raise ValueError("Invalid PostgreSQL plan node: missing Node Type.")
            properties = {key: value for key, value in node.items() if key != "Plans"}
            key = graph.node(node["Node Type"], "plan", properties)
            if parent is not None:
                graph.edge(parent, key, str(node.get("Parent Relationship", "input")))
            children = node.get("Plans", [])
            if not isinstance(children, list):
                raise ValueError("Plan children must be an array.")
            for child in children:
                walk(child, key)

        for index, plan in enumerate(plans):
            walk(plan["Plan"])
            summary[f"Plan {index + 1}"] = {key: value for key, value in plan.items() if key != "Plan"}
    else:
        stack = []
        current = None
        root_count = 0
        summary_indent = None
        worker_indent = None
        for raw in source.expandtabs(4).splitlines():
            text = raw.strip()
            if not text or text == "QUERY PLAN" or re.fullmatch(r"[-+ ]+|\(\d+ rows?\)", text):
                continue
            if "|" in raw or text.startswith('"'):
                raise ValueError("This text plan has table/CSV decoration. Paste plain EXPLAIN text or raw JSON.")
            indent = len(raw) - len(raw.lstrip())
            timing = re.fullmatch(r"(Planning|Execution) Time:\s*([\d.e+-]+) ms", text)
            if timing:
                if not math.isfinite(float(timing[2])):
                    raise ValueError("Plan metrics must be finite numbers.")
                summary.setdefault("Details", []).append(text)
                summary.setdefault("Plan 1", {})[f"{timing[1]} Time"] = float(timing[2])
                summary_indent = None
                continue
            if summary_indent is not None and indent > summary_indent:
                summary.setdefault("Details", []).append(text)
                continue
            summary_indent = None
            if re.match(r"^Planning:|^JIT:|^Settings:|^Query Identifier:", text):
                summary.setdefault("Details", []).append(text)
                summary_indent = indent
                continue
            arrow = text.startswith("->")
            content = text[2:].strip() if arrow else text
            group = bool(re.match(r"^(?:CTE \S+|InitPlan \d+|SubPlan \d+)(?:\s|$)", content))
            has_metrics = bool(re.search(r"\((?:cost=|actual time=|never executed)", content))
            known_node = bool(re.match(r"^(?:Seq Scan|Index(?: Only)? Scan|Bitmap|Hash|Merge|Nested Loop|Aggregate|GroupAggregate|HashAggregate|MixedAggregate|Sort|Incremental Sort|Limit|Result|Append|Merge Append|Gather|Unique|SetOp|WindowAgg|Materialize|Memoize|CTE Scan|Subquery Scan|Function Scan|Values Scan|Recursive Union|WorkTable Scan|LockRows|ModifyTable|Insert|Update|Delete|Foreign Scan|Custom Scan|ProjectSet|Group|Parallel)\b", content))
            is_node = group or arrow or ((has_metrics or (known_node and ":" not in content)) and not content.startswith("Worker "))
            if is_node:
                label = re.split(r"\s+\((?:cost=|actual time=|never executed)", content, maxsplit=1)[0]
                properties = {"Raw": content}
                worker_indent = None
                if "(never executed)" in content:
                    properties["Never Executed"] = True
                cost = re.search(r"cost=([\d.e+-]+)\.\.([\d.e+-]+) rows=([\d.e+-]+) width=(\d+)", content)
                if cost:
                    properties.update(zip(("Startup Cost", "Total Cost", "Plan Rows", "Plan Width"), map(float, cost.groups())))
                actual = re.search(r"actual time=([\d.e+-]+)\.\.([\d.e+-]+) rows=([\d.e+-]+) loops=(\d+)", content)
                if actual:
                    properties.update(zip(("Actual Startup Time", "Actual Total Time", "Actual Rows", "Actual Loops"), map(float, actual.groups())))
                # TIMING OFF still includes rows and loops.
                rows = re.search(r"actual rows=([\d.e+-]+) loops=(\d+)", content)
                if rows:
                    properties.update(zip(("Actual Rows", "Actual Loops"), map(float, rows.groups())))
                if any(isinstance(value, float) and not math.isfinite(value) for value in properties.values()):
                    raise ValueError("Plan metrics must be finite numbers.")
                while stack and stack[-1][0] >= indent:
                    stack.pop()
                if not stack:
                    root_count += 1
                    if arrow or root_count > 1:
                        raise ValueError("Ambiguous text-plan indentation. Export EXPLAIN (FORMAT JSON) instead.")
                current = graph.node(label, "plan-group" if group else "plan", properties)
                if stack:
                    graph.edge(stack[-1][1], current, "input")
                stack.append((indent, current))
            elif current is not None and (":" in content or indent > 0):
                properties = graph.nodes[int(current[1:])]["properties"]
                properties.setdefault("Details", []).append(text)
                if worker_indent is not None and indent <= worker_indent:
                    worker_indent = None
                if re.match(r"^Worker \d+:", text):
                    worker_indent = indent
                if worker_indent is None:
                    _text_detail(properties, text)
            else:
                raise ValueError("Unrecognized or incomplete PostgreSQL text plan. Export EXPLAIN (FORMAT JSON) instead.")
        if not graph.nodes:
            raise ValueError("No PostgreSQL plan nodes found. Paste EXPLAIN output, not an EXPLAIN SQL command.")
        graph.diagnostics.append("Text details are preserved verbatim; use JSON for fully structured properties.")
    result = graph.result()
    result.update(summary=summary, format=chosen)
    result["diagnostics"].append("Costs are planner units, not milliseconds. Actual metrics appear only when supplied; node times are not added together.")
    return result
