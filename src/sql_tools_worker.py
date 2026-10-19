"""One JSON request, one response; never opens a database or runs supplied SQL."""
import json
import sys

def prepare():
    """Prewarm all engines before READY, keeping preparation off the next request."""
    from importlib import import_module
    for module in ("src.sql_tools", "src.sql_plan_parser", "src.sql_formatter"):
        import_module(module)


def handle(request):
    action = request.get("action")
    if action == "format":
        from src.sql_formatter import format_sql
        return format_sql(request.get("sql"), request.get("keywordCase", "upper"),
                          request.get("tabWidth", 2), request.get("lineLength", 88))
    if action == "convert":
        from src.sql_tools import convert_sql
        return convert_sql(request.get("sql"), request.get("dialect"), request.get("target"))
    if action == "visualize":
        from src.sql_tools import visualize_sql
        return visualize_sql(request.get("sql"), request.get("dialect"), request.get("statement", 0))
    if action == "explain":
        from src.sql_plan_parser import parse_plan
        return parse_plan(request.get("plan"), request.get("planFormat", "auto"))
    raise ValueError("Unsupported SQL tool action.")


if __name__ == "__main__":
    if "--ready" in sys.argv:
        prepare()
        sys.stdout.buffer.write(b"READY\n")
        sys.stdout.buffer.flush()
    try:
        payload = sys.stdin.buffer.read(3_000_001)
        if len(payload) > 3_000_000:
            raise ValueError("Request is too large.")
        result = {"ok": True, "result": handle(json.loads(payload))}
    except Exception as exc:
        result = {"ok": False, "error": str(exc)[:3000]}
    sys.stdout.buffer.write(json.dumps(result, ensure_ascii=False).encode("utf-8"))
