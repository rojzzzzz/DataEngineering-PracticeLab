"""Saved recipe builder; jobs and generated files remain temporary."""
from copy import deepcopy
import json
import sqlite3
from uuid import uuid4
import streamlit as st

from src import mock_jobs as jobs
from src.mock_models import (ENGINE_VERSION, FAKER_PROVIDERS, GENERATORS, TYPES, default_generator, dependents,
                             duplicate_table, example_recipe, export_recipe, import_recipe,
                             new_field, new_recipe, new_table, recipe_issues, typed_value, uid)


def close_mock_data(preserve_failed=True):
    if preserve_failed and st.session_state.get("mock_save_error") and st.session_state.get("mock_saved_id"):
        st.session_state.constructor_mock_recovery = {
            "path": st.session_state.mock_store_path, "error": st.session_state.mock_save_error,
            "doc": {"id": st.session_state.mock_saved_id, "revision": st.session_state.mock_store_revision,
                    "payload": deepcopy(_saved_payload())}}
    session = st.session_state.get("optional_ai")
    if session:
        request, _, _ = session.snapshot()
        if request and request.operation == "mock_customization":
            session.invalidate("cancelled")
    workspace = st.session_state.get("mock_workspace")
    if workspace:
        jobs.close(workspace)
    for key in list(st.session_state):
        if key.startswith("mock_"):
            del st.session_state[key]


def commit(recipe):
    if any(f["generator"]["kind"] in ("multiply", "date_after") for t in recipe["tables"] for f in t["fields"]):
        recipe["engine_version"] = ENGINE_VERSION
    if recipe != st.session_state.mock_recipe:
        session = st.session_state.get("optional_ai")
        if session:
            request, _, _ = session.snapshot()
            if request and request.operation == "mock_customization":
                session.invalidate()
        jobs.close(st.session_state.mock_workspace)
        st.session_state.mock_recipe = deepcopy(recipe)
        st.session_state.mock_revision += 1
        st.session_state.pop("mock_preview", None)
        st.session_state.pop("mock_terminal_job", None)
        adapter = st.session_state.get("mock_attempt_adapter")
        if adapter:
            adapter.save({"recipe": recipe, "recipe_revision": st.session_state.mock_revision,
                          "generation": st.session_state.get("mock_generation"), "ui_drafts": _draft_inputs()})
        _autosave()
    st.rerun()


def replace_recipe(recipe):
    # Call only after strict validation for uploaded recipes. Diagram copies
    # intentionally keep unresolved fields/mappings for the user to resolve.
    st.session_state.pop("mock_table", None)
    st.session_state.pop("mock_field", None)
    for key in list(st.session_state):
        if key.startswith(("mock_rule_", "mock_seed_")):
            del st.session_state[key]
    commit(recipe)


def _draft_inputs():
    inputs = {"mock_rule_drafts": deepcopy(st.session_state.get("mock_rule_drafts", {}))}
    seed = st.session_state.get("mock_seed_input", st.session_state.get("mock_seed_draft"))
    if seed is not None:
        inputs["mock_seed_draft"] = seed
    return inputs


def _saved_payload():
    return {"recipe": st.session_state.mock_recipe, "ui_drafts": _draft_inputs()}


def _autosave(name=None):
    if st.session_state.get("mock_attempt_adapter") or not st.session_state.get("mock_saved_id"):
        return
    from src import mock_store
    try:
        st.session_state.mock_store_revision = mock_store.save(st.session_state.mock_store_path,
            st.session_state.mock_saved_id, _saved_payload(), st.session_state.mock_store_revision, name)
        st.session_state.pop("mock_save_error", None)
    except (ValueError, OSError, sqlite3.Error) as exc:
        st.session_state.mock_save_error = str(exc)


def _mount_saved(doc):
    close_mock_data(preserve_failed=False)
    st.session_state.mock_workspace = str(uuid4())
    st.session_state.mock_revision = 0
    st.session_state.mock_saved_id = doc["id"]
    st.session_state.mock_store_revision = doc["revision"]
    st.session_state.mock_recipe = deepcopy(doc["payload"]["recipe"])
    for key, value in doc["payload"].get("ui_drafts", {}).items():
        if key == "mock_rule_drafts" or key.startswith("mock_seed_"):
            st.session_state[key] = value


def _saved_recipes(path):
    from src import mock_store
    mock_store.init_store(path)
    docs = mock_store.list_recipes(path)
    if not st.session_state.get("mock_saved_id"):
        recovery = st.session_state.get("constructor_mock_recovery")
        if recovery and recovery["path"] == str(path):
            _mount_saved(recovery["doc"])
            st.session_state.mock_save_error = recovery["error"]
            st.session_state.pop("constructor_mock_recovery", None)
        elif "mock_recipe" in st.session_state:
            doc = mock_store.create(path, payload=_saved_payload())
        else:
            doc = mock_store.load(path, docs[0]["id"]) if docs else mock_store.create(path)
        if not st.session_state.get("mock_saved_id"):
            _mount_saved(doc)
        docs = mock_store.list_recipes(path)
    st.session_state.mock_store_path = str(path)
    current = st.session_state.mock_saved_id
    names = {d["id"]: d["name"] for d in docs}
    if current not in names:
        names[current] = "Removed recipe · local draft"
    selected = st.selectbox("Saved recipe", list(names), index=list(names).index(current),
                            format_func=names.get, key="mock_saved_picker", disabled=bool(st.session_state.get("mock_save_error")))
    if selected != current and not st.session_state.get("mock_save_error"):
        _mount_saved(mock_store.load(path, selected))
        st.rerun()
    with st.expander("Manage saved recipe"):
        name = st.text_input("Recipe name", names[current], max_chars=100, key=f"mock_saved_name_{current}")
        left, middle, right = st.columns(3)
        if left.button("Rename recipe", disabled=bool(st.session_state.get("mock_save_error"))):
            _autosave(name)
            st.rerun()
        if middle.button("Duplicate recipe"):
            _mount_saved(mock_store.create(path, name[:93] + " (copy)", _saved_payload()))
            st.rerun()
        if right.button("New recipe", disabled=bool(st.session_state.get("mock_save_error"))):
            _mount_saved(mock_store.create(path))
            st.rerun()
        st.download_button("Export recipe JSON", export_recipe(st.session_state.mock_recipe),
                           file_name="mock-recipe.json", mime="application/json", key="mock_saved_export")
        st.caption("Recipe JSON contains applied settings. Save a copy to preserve unfinished rule inputs too.")
    if error := st.session_state.get("mock_save_error"):
        st.error("Recipe could not be saved: " + error)
        st.download_button("Download draft recovery JSON", json.dumps({"format": "constructor-mock-draft", "version": 1,
            **_saved_payload()}, ensure_ascii=False, indent=2), file_name="mock-draft-recovery.json", mime="application/json")
        st.caption("Recovery JSON includes applied settings and unfinished inputs for manual recovery. Use Save draft as a new recipe to keep editing in the app.")
        if st.button("Reload saved recipe", disabled=current not in {d["id"] for d in docs}):
            _mount_saved(mock_store.load(path, current))
            st.rerun()
        if st.button("Save draft as a new recipe"):
            _mount_saved(mock_store.create(path, name[:93] + " (copy)", _saved_payload()))
            st.rerun()
        if st.button("Retry saving recipe"):
            _autosave()
            st.rerun()
        st.stop()
    else:
        st.caption("Recipe saved automatically on this device. Generated files stay temporary; export JSON for a portable copy.")


def begin(recipe, mode="generate", table_id=None):
    try:
        job = jobs.start(st.session_state.mock_workspace, st.session_state.mock_revision, recipe, mode, table_id)
        st.session_state.pop("mock_terminal_job", None)
        st.session_state.pop("mock_preview", None)
        st.session_state.mock_job_id = job.id
        st.rerun()
    except (ValueError, OSError) as exc:
        st.error(str(exc))


def _picker(recipe):
    tables = recipe["tables"]
    if not tables:
        st.info("This recipe has no tables yet. Add a table to begin.")
        if st.button("Add table"):
            recipe["tables"].append(new_table())
            commit(recipe)
        return None
    ids = [t["id"] for t in tables]
    if st.session_state.get("mock_table") not in ids:
        st.session_state.mock_table = ids[0]
    selected = st.selectbox("Table", ids, format_func={t["id"]: t["name"] for t in tables}.get, key="mock_table")
    return next(t for t in tables if t["id"] == selected)


def _imports(recipe, path):
    with st.expander("Examples, recipes & Diagram Maker"):
        examples = st.selectbox("Example dataset", ["Simple table", "Customers / orders", "Products / sales", "Application events"])
        st.caption("Loading an example, recipe, or diagram replaces the current recipe. Duplicate or export it first to keep the original.")
        if st.button("Load example"):
            replace_recipe(example_recipe(examples))
        st.download_button("Download recipe JSON", export_recipe(recipe), file_name="mock-recipe.json", mime="application/json")
        upload = st.file_uploader("Import recipe JSON", type=["json"], key="mock_import")
        if st.button("Replace with imported recipe", disabled=upload is None):
            try:
                replace_recipe(import_recipe(upload.getvalue()))
            except ValueError as exc:
                st.error(str(exc))
        from src import constructor_store as store
        store.init_constructor(path)
        eligible = store.list_diagrams(path, kinds=("logical_erd", "star_schema"))
        if eligible:
            selected = st.selectbox("Saved logical ERD or star schema", [d["document_id"] for d in eligible], format_func={d["document_id"]: d["name"] for d in eligible}.get)
            if st.button("Import a diagram copy"):
                from src.mock_diagrams import diagram_recipe
                try:
                    saved = store.load_diagram(path, selected)
                    replace_recipe(diagram_recipe(saved["diagram"]))
                except ValueError as exc:
                    st.error(f"Could not import diagram: {exc}")
        else:
            st.caption("Save a logical ERD or star schema in Diagram Maker to import it here. Conceptual ERDs need fields and types first.")
        adapter = st.session_state.get("mock_attempt_adapter")
        if adapter:
            from src.database import get_attempt
            from src.mock_diagrams import diagram_recipe
            workspace = get_attempt(path, adapter.attempt_id)["constructor_workspace"]
            diagrams = {key: a for key, a in workspace["artifacts"].items()
                        if a["tool"] == "diagram" and a["payload"]["kind"] in ("logical_erd", "star_schema")}
            if diagrams:
                selected = st.selectbox("Model from this attempt", list(diagrams))
                confirmed = st.checkbox("Replace this recipe with a copy of the selected model")
                st.caption("Unknown types, composite keys and unresolved relationships require explicit repair. The model remains independent.")
                if st.button("Copy model into recipe", disabled=not confirmed):
                    replace_recipe(diagram_recipe(diagrams[selected]["payload"]))


def _ai_customization(recipe, workspace):
    from src.ai import revision as ai_revision
    from src.ai_ui import ai_session, record_activity, render_prompt
    from src.mock_ai import customization_prompt, parse_recipe_draft

    session = ai_session()
    with st.expander("Customize with AI"):
        st.caption("Use Optional AI or download the prompt and paste a recipe from your own AI tool.")
        instructions = st.text_area("Describe your dataset", key="mock_ai_instructions", height=100,
            placeholder="Create a product catalog with Spanish product names, prices from 5 to 200, and SKUs like PRD-1234. Make 80% of products active.",
            on_change=record_activity)
        if not instructions.strip():
            request, _, _ = session.snapshot()
            if request and request.operation == "mock_customization":
                session.invalidate()
            st.caption("Describe columns, value formats, categories, distributions or related tables to prepare a prompt.")
            return
        document_id = "mock:" + workspace
        current_revision = ai_revision({"recipe": recipe, "instructions": instructions})
        st.caption("AI proposes editable column rules and value lists. Review the recipe before applying it, then preview or generate data locally.")
        request, response, state = render_prompt(customization_prompt(recipe, instructions),
            "mock_ai", "mock_customization", document_id, current_revision, "mock-customization-prompt.txt")
        proposed_text = None
        if (request and request.document_id == document_id and response and response.text
                and state == "completed" and response.applicable and request.document_revision == current_revision):
            proposed_text = response.text
        pasted = st.text_area("Paste proposed recipe JSON", key="mock_ai_pasted", height=160, on_change=record_activity)
        if st.button("Review pasted recipe", key="mock_ai_review", disabled=not pasted.strip()):
            record_activity()
            st.session_state["mock_ai_external_review"] = {"text": pasted, "revision": current_revision}
        external = st.session_state.get("mock_ai_external_review")
        if external and external["revision"] == current_revision and external["text"] == pasted:
            proposed_text = pasted
        if not proposed_text:
            return
        try:
            proposed = parse_recipe_draft(proposed_text)
        except ValueError as exc:
            st.error(f"AI recipe could not be applied: {exc}")
            return
        st.markdown("**Review proposed recipe**")
        st.dataframe([{"Table": t["name"], "Rows": t["rows"], "Columns": ", ".join(f["name"] for f in t["fields"])}
                      for t in proposed["tables"]], hide_index=True, use_container_width=True)
        st.json(proposed, expanded=False)
        st.caption("Applying replaces the current recipe and clears generated downloads. Download the current recipe first if you want to keep it.")
        if st.button("Apply AI recipe", key="mock_ai_apply"):
            record_activity()
            replace_recipe(proposed)


def _move(items, identity, delta):
    index = next(i for i, item in enumerate(items) if item["id"] == identity)
    target = index + delta
    if 0 <= target < len(items):
        items[index], items[target] = items[target], items[index]


def _table_controls(recipe, table, revision):
    identity, size = st.columns([2, 1])
    name = identity.text_input("Table name", table["name"], max_chars=100, key=f"mock_name_{table['id']}_{revision}")
    rows = size.number_input("Rows in this table", min_value=1, max_value=1_000_000, value=table["rows"], step=100, key=f"mock_rows_{table['id']}_{revision}")
    if (name, rows) != (table["name"], table["rows"]):
        table.update(name=name, rows=rows)
        commit(recipe)
    with st.expander("Manage tables"):
        name = st.text_input("New table name", "new_table", key=f"mock_new_table_{revision}")
        if st.button("Add table", disabled=len(recipe["tables"]) >= 20):
            recipe["tables"].append(new_table(name))
            commit(recipe)
        if st.button("Duplicate table", disabled=len(recipe["tables"]) >= 20):
            duplicate_table(recipe, table["id"])
            commit(recipe)
        left, right = st.columns(2)
        index = recipe["tables"].index(table)
        if left.button("Move table earlier", disabled=index == 0):
            _move(recipe["tables"], table["id"], -1)
            commit(recipe)
        if right.button("Move table later", disabled=index == len(recipe["tables"]) - 1):
            _move(recipe["tables"], table["id"], 1)
            commit(recipe)
        refs = dependents(recipe, table["id"])
        pending = [p for p in recipe["pending_mappings"] if table["id"] in (p["source"], p["target"])]
        if refs or pending:
            st.warning("Referenced by: " + ", ".join(refs + [p["label"] for p in pending]) + ". Remove or remap these references before removing this table.")
        confirm = st.checkbox("Remove this table from the recipe", key=f"mock_remove_table_{revision}")
        if st.button("Remove table", disabled=bool(refs or pending) or len(recipe["tables"]) <= 1 or not confirm):
            recipe["tables"].remove(table)
            commit(recipe)


GENERATOR_LABELS = {"sequence": "Sequential ID", "number": "Random number", "boolean": "True / false",
                    "date": "Random date", "timestamp": "Random timestamp", "uuid": "Unique UUID",
                    "faker": "Realistic text", "constant": "Fixed value", "choice": "List of values",
                    "foreign_key": "Related table", "regex": "Custom RegEx",
                    "multiply": "Multiply columns", "date_after": "Date after another column"}


def _field_grid(recipe, table, revision):
    st.subheader("Columns")
    st.caption("Name each column, choose its data type, then choose what goes in it. Changes update the current recipe.")
    page_size = 20
    fields = table["fields"]
    search_key, page_key = f"mock_column_search_{table['id']}", f"mock_column_page_{table['id']}"
    if st.session_state.pop(f"mock_column_reveal_{table['id']}", None):
        st.session_state[search_key] = ""
        st.session_state[page_key] = (len(fields) - 1) // page_size + 1
    if len(fields) > page_size:
        def reset_page():
            st.session_state[page_key] = 1
        search = st.text_input("Find columns", key=search_key, on_change=reset_page, placeholder="Search column names").strip().casefold()
        visible = [field for field in fields if search in field["name"].casefold()]
        pages = max(1, (len(visible) + page_size - 1) // page_size)
        st.session_state[page_key] = min(pages, max(1, st.session_state.get(page_key, 1)))
        page = st.number_input("Column page", min_value=1, max_value=pages, step=1, key=page_key)
        start = (page - 1) * page_size
        fields = visible[start:start + page_size]
        st.caption(f"{len(visible)} matching columns · Page {page} of {pages}")
    for field in fields:
        identity = field["id"]
        with st.container(key=f"mock_column_{identity}"):
            name_col, type_col, generator_col, remove_col = st.columns([3, 2, 3, 1.5], vertical_alignment="bottom")
            name = name_col.text_input("Column name", field["name"], key=f"mock_col_name_{identity}_{revision}", max_chars=100)
            types = list(TYPES) + (["unknown"] if field["type"] not in TYPES else [])
            dtype = type_col.selectbox("Data type", types, index=types.index(field["type"]), key=f"mock_col_type_{identity}_{revision}")
            if dtype != field["type"]:
                field.update(type=dtype, generator=default_generator(dtype), reference=None,
                             primary_key=field["primary_key"] and dtype in ("integer", "uuid"))
                if field["primary_key"]:
                    field["generator"] = _generator_defaults(field, "sequence" if dtype == "integer" else "uuid")
                field["name"] = name
                commit(recipe)
            options = list(GENERATORS.get(dtype, ("constant",)))
            # Common text values are first-class choices, rather than a second hidden setting.
            if "faker" in options:
                options.remove("faker")
                options = [f"faker:{provider}" for provider in FAKER_PROVIDERS] + options
            current = field["generator"]["kind"]
            if current == "faker":
                current += ":" + field["generator"].get("provider", "name")
            if current not in options:
                options.append(current)
            selected = generator_col.selectbox("Data to generate", options, index=options.index(current),
                format_func=lambda v: v.split(":")[1].capitalize() if v.startswith("faker:") else GENERATOR_LABELS.get(v, v),
                key=f"mock_col_generator_{identity}_{revision}")
            refs = dependents(recipe, table["id"], identity)
            if remove_col.button("Remove", key=f"mock_col_remove_{identity}", disabled=bool(refs) or len(table["fields"]) <= 1,
                                 help="Used by another column or table" if refs else "Remove this column"):
                table["fields"].remove(field)
                commit(recipe)
            if name != field["name"] or selected != current:
                field["name"] = name
                if selected != current:
                    st.session_state.mock_field = identity
                    field["generator"] = ({"kind": "faker", "provider": selected.split(":")[1]} if selected.startswith("faker:")
                                          else _generator_defaults(field, selected))
                    field["reference"] = None
                    if selected not in ("sequence", "uuid"):
                        field["primary_key"] = False
                commit(recipe)
    if st.button("Add column", disabled=len(table["fields"]) >= 100):
        field = new_field(f"column_{len(table['fields']) + 1}")
        table["fields"].append(field)
        st.session_state.mock_field = field["id"]
        st.session_state[f"mock_column_reveal_{table['id']}"] = field["id"]
        commit(recipe)


def _generator_defaults(field, kind):
    defaults = default_generator(field["type"])
    if defaults["kind"] == kind:
        return defaults
    value = {"integer": 0, "decimal": "0.00", "boolean": False, "string": "value", "date": "2025-01-01", "timestamp": "2025-01-01T00:00:00Z", "uuid": "00000000-0000-4000-8000-000000000000"}.get(field["type"], "")
    return {"sequence": {"kind": kind, "start": 1, "step": 1}, "uuid": {"kind": kind}, "foreign_key": {"kind": kind},
            "regex": {"kind": kind, "pattern": "[A-Z]{3}-[0-9]{4}"},
            "multiply": {"kind": kind, "left_field_id": "", "right_field_id": ""},
            "date_after": {"kind": kind, "source_field_id": "", "min_days": 1, "max_days": 30},
            "constant": {"kind": kind, "value": value}, "choice": {"kind": kind, "values": [value], "weights": [1]}}[kind]


def _field_panel(recipe, table, revision):
    if not table["fields"]:
        return
    ids = [f["id"] for f in table["fields"]]
    if st.session_state.get("mock_field") not in ids:
        st.session_state.mock_field = ids[0]
    selected = st.selectbox("Column to configure", ids, format_func={f["id"]: f["name"] for f in table["fields"]}.get, key="mock_field")
    field = next(f for f in table["fields"] if f["id"] == selected)
    options = list(GENERATORS.get(field["type"], ("constant",)))
    if field["generator"]["kind"] not in options:
        options.append(field["generator"]["kind"])
    drafts = st.session_state.setdefault("mock_rule_drafts", {})
    prefix = f"mock_rule_{selected}_"
    def control(widget, label, *args, **kwargs):
        key = kwargs.pop("key", prefix + kind + "_" + label)
        kwargs["key"] = key
        expected = kwargs.get("value", args[0] if args else None)
        if "index" in kwargs and args:
            expected = args[0][kwargs["index"]]
        if key in drafts and key not in st.session_state:
            st.session_state[key] = drafts[key]
        if "index" in kwargs and args and key in st.session_state and st.session_state[key] not in args[0]:
            del st.session_state[key]
        result = widget(label, *args, **kwargs)
        if result != expected:
            drafts[key] = result
        else:
            drafts.pop(key, None)
        return result
    kind = "selection"
    kind = control(st.selectbox, "Value rule", options, format_func=lambda v: GENERATOR_LABELS.get(v, v),
                   index=options.index(field["generator"]["kind"]))
    gen = deepcopy(field["generator"] if kind == field["generator"]["kind"] else _generator_defaults(field, kind))
    if not recipe_issues(recipe):
        st.caption("Applied rule examples: " + _field_examples(export_recipe(recipe), table["id"], selected))
    with st.container():
        primary_key = control(st.checkbox, "Primary key", value=field["primary_key"])
        null_pct = control(st.number_input, "Missing values (%)", min_value=0., max_value=100., value=float(field["null_pct"]), step=1.)
        precision = control(st.number_input, "Decimal precision", min_value=1, max_value=38, value=min(38, max(1, field["precision"]))) if field["type"] == "decimal" else field["precision"]
        scale = control(st.number_input, "Decimal scale", min_value=0, max_value=38, value=min(38, max(0, field["scale"]))) if field["type"] == "decimal" else field["scale"]
        max_length = control(st.number_input, "Maximum text length", min_value=1, max_value=4000, value=min(4000, max(1, field["max_length"]))) if field["type"] == "string" else field["max_length"]
        ref = None
        if kind in ("number", "date", "timestamp"):
            low = control(st.text_input, "Minimum", str(gen.get("min", "")))
            high = control(st.text_input, "Maximum", str(gen.get("max", "")))
        elif kind == "sequence":
            start = control(st.text_input, "Start", str(gen.get("start", 1)))
            step = control(st.text_input, "Step", str(gen.get("step", 1)))
        elif kind == "boolean":
            gen["probability"] = control(st.slider, "Probability of true", min_value=0., max_value=1., value=float(gen.get("probability", .5)), step=.01)
        elif kind == "faker":
            gen["provider"] = control(st.selectbox, "Faker value", FAKER_PROVIDERS, index=FAKER_PROVIDERS.index(gen.get("provider", "name")))
        elif kind == "constant":
            constant = control(st.text_input, "Constant value", json.dumps(gen.get("value")) if field["type"] in ("boolean", "integer") else str(gen.get("value", "")))
        elif kind == "regex":
            gen["pattern"] = control(st.text_input, "RegEx pattern", gen.get("pattern", ""), max_chars=500,
                                           placeholder="[A-Z]{3}-[0-9]{4}")
            st.caption("Example: [A-Z]{3}-[0-9]{4} generates ABC-1234. Use patterns without / delimiters. Groups, alternatives and quantifiers are supported; lookarounds, backreferences and flags are not. Unbounded repeats add up to 10 characters or groups beyond their minimum.")
        elif kind == "choice":
            st.caption("Add a value and its relative weight in each row. For example: completed 70, pending 20, cancelled 10. Decimal values keep their exact text.")
            rows_key = prefix + kind + "_rows"
            base_key = prefix + kind + "_base"
            editor_key = prefix + kind + "_editor"
            original = [{"Value": json.dumps(v) if field["type"] in ("integer", "boolean") else str(v), "Weight": float(w)}
                        for v, w in zip(gen.get("values", []), gen.get("weights", []))]
            if editor_key not in st.session_state:
                st.session_state[base_key] = deepcopy(drafts.get(rows_key, original))
            choice_rows = st.data_editor(st.session_state.get(base_key, original), num_rows="dynamic", hide_index=True,
                key=editor_key, column_config={"Value": st.column_config.TextColumn("Value", required=True),
                "Weight": st.column_config.NumberColumn("Weight", min_value=0., required=True)}, use_container_width=True)
            if choice_rows != original:
                drafts[rows_key] = choice_rows
            else:
                drafts.pop(rows_key, None)
            try:
                typed_choices, choice_weights = [], []
                if not 1 <= len(choice_rows) <= 1000:
                    raise ValueError("Add between 1 and 1000 values.")
                for row in choice_rows:
                    raw = row["Value"]
                    value = json.loads(raw) if field["type"] in ("integer", "boolean") else raw
                    typed_value(field, value)
                    typed_choices.append(value)
                    choice_weights.append(float(row["Weight"]))
                import math
                total_weight = sum(choice_weights)
                if any(not math.isfinite(w) or w < 0 for w in choice_weights) or not math.isfinite(total_weight) or total_weight <= 0:
                    raise ValueError("Weights must be finite, nonnegative, and total more than zero.")
                st.caption("Expected shares: " + ", ".join(f"{v}: {w / total_weight:.1%}" for v, w in zip(typed_choices[:10], choice_weights[:10]))
                           + (" …" if len(typed_choices) > 10 else "") + ". Actual counts vary.")
                choice_error = None
            except (ValueError, TypeError, KeyError) as exc:
                choice_error = f"Check the choice values and weights: {exc}"
                st.error(choice_error)
        elif kind in ("multiply", "date_after"):
            allowed = (("integer",) if field["type"] == "integer" else ("integer", "decimal")) if kind == "multiply" else (field["type"],)
            candidates = [f for f in table["fields"] if f["id"] != selected and f["type"] in allowed]
            source_ids = [""] + [f["id"] for f in candidates]
            names = {"": "Choose a source column", **{f["id"]: f["name"] for f in candidates}}
            for key, label in (("left_field_id", "First source column"), ("right_field_id", "Second source column")) if kind == "multiply" else (("source_field_id", "Source date column"),):
                current = gen.get(key)
                gen[key] = control(st.selectbox, label, source_ids, index=source_ids.index(current) if current in source_ids else 0, format_func=names.get)
            if kind == "date_after":
                gen["min_days"] = control(st.number_input, "Minimum days after", min_value=0, max_value=36500, value=gen["min_days"])
                gen["max_days"] = control(st.number_input, "Maximum days after", min_value=0, max_value=36500, value=gen["max_days"])
            st.caption("Uses values from the same row. Missing source values produce a missing result. Decimal products round half up to the configured scale.")
        elif kind == "foreign_key":
            parents = [(t, f) for t in recipe["tables"] if t["id"] != table["id"] for f in t["fields"] if f["primary_key"] and f["type"] == field["type"]]
            if parents:
                parent_ids = [f["id"] for t, f in parents]
                current = field.get("reference") or {}
                parent_id = control(st.selectbox, "Parent primary key", parent_ids, index=parent_ids.index(current.get("field_id")) if current.get("field_id") in parent_ids else 0, format_func={f["id"]: f"{t['name']}.{f['name']}" for t, f in parents}.get)
                relationship = control(st.selectbox, "Relationship", ["many-to-one", "one-to-one"], index=1 if current.get("relation") == "one-to-one" else 0)
                parent, parent_field = next((t, f) for t, f in parents if f["id"] == parent_id)
                ref = {"table_id": parent["id"], "field_id": parent_field["id"], "relation": relationship}
            else:
                st.warning("Create a matching integer or UUID primary key in a different table first.")
        save = st.button("Save column rules", disabled=kind == "choice" and bool(choice_error))
        if save:
            try:
                if kind in ("number", "date", "timestamp"):
                    gen.update(min=int(low) if field["type"] == "integer" else low, max=int(high) if field["type"] == "integer" else high)
                elif kind == "sequence":
                    gen.update(start=int(start), step=int(step))
                elif kind == "constant":
                    gen["value"] = json.loads(constant) if field["type"] in ("integer", "boolean") else constant
                elif kind == "choice":
                    gen.update(values=typed_choices, weights=choice_weights)
                field.update(generator=gen, reference=ref, precision=precision, scale=scale, max_length=max_length, primary_key=primary_key, null_pct=null_pct)
                if ref:
                    field.pop("unresolved_fk", None)
                for key in list(drafts):
                    if key.startswith(prefix):
                        del drafts[key]
                st.session_state.mock_clear_rule_prefix = prefix
                commit(recipe)
            except (ValueError, TypeError) as exc:
                st.error(f"Settings could not be applied: {exc}")
    with st.expander("More column actions"):
        if field.get("unresolved_fk"):
            st.caption("This column was marked FK in the imported diagram. Confirm its parent mapping, or explicitly clear the flag if it is not a foreign key.")
            if st.button("Clear imported FK flag"):
                field.pop("unresolved_fk", None)
                if field["generator"]["kind"] == "foreign_key" and not field.get("reference"):
                    field["generator"] = default_generator(field["type"])
                commit(recipe)
        if st.button("Duplicate column", disabled=len(table["fields"]) >= 100):
            copied = deepcopy(field)
            copied.update(id=uid(), name=field["name"][:85] + " copy", primary_key=False)
            table["fields"].append(copied)
            commit(recipe)
        index = table["fields"].index(field)
        left, right = st.columns(2)
        if left.button("Move column earlier", disabled=index == 0):
            _move(table["fields"], selected, -1)
            commit(recipe)
        if right.button("Move column later", disabled=index == len(table["fields"]) - 1):
            _move(table["fields"], selected, 1)
            commit(recipe)
        refs = dependents(recipe, table["id"], selected)
        if refs:
            st.warning("Referenced by " + ", ".join(refs) + ". Update or remove these rules before removing this column.")
        confirm = st.checkbox("Remove this column from the recipe", key=f"mock_remove_field_{revision}_{selected}")
        if st.button("Remove column", disabled=bool(refs) or len(table["fields"]) <= 1 or not confirm):
            table["fields"].remove(field)
            commit(recipe)


def _mappings(recipe):
    for mapping in list(recipe["pending_mappings"]):
        with st.expander(f"Resolve diagram relationship: {mapping['label']}", expanded=True):
            left, right = mapping["source"], mapping["target"]
            tables = [t for t in recipe["tables"] if t["id"] in (left, right)]
            names = {t["id"]: t["name"] for t in tables}
            if mapping["source_cardinality"] == mapping["target_cardinality"] == "many":
                st.warning("Many-to-many relationships need an explicit junction table. Confirm a junction table containing references to both parent keys.")
                parents = [(t, [f for f in t["fields"] if f["primary_key"]]) for t in tables]
                supported = all(len(fields) == 1 and fields[0]["type"] in ("integer", "uuid") for t, fields in parents)
                if st.button("Create junction table", key=f"mock_junction_{mapping['id']}", disabled=not supported or len(recipe["tables"]) >= 20):
                    junction = new_table(f"{tables[0]['name'][:40]}_{tables[1]['name'][:40]}")
                    junction["fields"] = [junction["fields"][0]]
                    for parent, fields in parents:
                        fk = new_field(f"{parent['name'][:80]}_id", fields[0]["type"])
                        fk.update(generator={"kind": "foreign_key"}, reference={"table_id": parent["id"], "field_id": fields[0]["id"], "relation": "many-to-one"})
                        junction["fields"].append(fk)
                    recipe["tables"].append(junction)
                    recipe["pending_mappings"].remove(mapping)
                    commit(recipe)
                if not supported:
                    st.caption("Resolve both tables to one integer or UUID primary key first.")
                continue
            parent_id = st.selectbox("Parent table", [t["id"] for t in tables], format_func=names.get, key=f"mock_parent_{mapping['id']}")
            child = next(t for t in tables if t["id"] != parent_id)
            parent = next(t for t in tables if t["id"] == parent_id)
            pks = [f for f in parent["fields"] if f["primary_key"]]
            if len(pks) != 1 or pks[0]["type"] not in ("integer", "uuid"):
                st.warning("Resolve the parent to one integer or UUID primary key first.")
                continue
            eligible = [f for f in child["fields"] if not f["primary_key"] and f["type"] == pks[0]["type"]]
            if not eligible:
                st.warning(f"Add a {pks[0]['type']} foreign-key column to {child['name']} first.")
                continue
            child_id = st.selectbox("Foreign-key column", [f["id"] for f in eligible], format_func={f["id"]: f"{child['name']}.{f['name']}" for f in eligible}.get, key=f"mock_child_{mapping['id']}")
            relation = st.selectbox("Cardinality", ["many-to-one", "one-to-one"], index=1 if mapping["source_cardinality"] == mapping["target_cardinality"] == "one" else 0, key=f"mock_cardinality_{mapping['id']}")
            st.caption(f"Confirm that {names[parent_id]}.{pks[0]['name']} supplies keys for the selected child column. The original diagram will remain unchanged.")
            if st.button("Confirm column mapping", key=f"mock_confirm_{mapping['id']}"):
                field = next(f for f in eligible if f["id"] == child_id)
                field.update(generator={"kind": "foreign_key"}, reference={"table_id": parent_id, "field_id": pks[0]["id"], "relation": relation})
                field.pop("unresolved_fk", None)
                recipe["pending_mappings"].remove(mapping)
                commit(recipe)


@st.fragment(run_every=2)
def _poll(workspace, revision):
    job = jobs.get(workspace)
    if not job:
        return
    if not job.matches(workspace, revision):
        st.warning("This job expired or its recipe changed. Generate again.")
        return
    job.heartbeat()
    status = job.status()
    if status["status"] == "running":
        total = 50 if job.request["mode"] == "preview" else sum(t["rows"] for t in job.request["recipe"]["tables"])
        completed = status.get("completed_rows", 0)
        st.progress(min(completed / max(total, 1), 1), text=f"{status.get('stage', 'Starting')} · {completed:,} / {total:,} rows · {status.get('elapsed_seconds', 0):.1f}s")
        if st.button("Cancel generation", key="mock_cancel_job"):
            job.cancel()
            st.rerun()
    elif st.session_state.get("mock_terminal_job") != job.id:
        st.session_state.mock_terminal_job = job.id
        st.rerun()


def _result(workspace, revision, mode):
    job = jobs.get(workspace)
    if not job or not job.matches(workspace, revision):
        return
    if job.request["mode"] != mode:
        return
    status = job.status()
    if status["status"] in ("failed", "cancelled"):
        (st.error if status["status"] == "failed" else st.info)(status.get("error", "Generation failed. Try again."))
    elif status["status"] == "complete":
        try:
            if job.request["mode"] == "preview":
                preview = json.loads(job.artifact(status["preview"], workspace, revision).read_text(encoding="utf-8"))
                current_table = st.session_state.get("mock_table")
                if preview["table_id"] != current_table:
                    st.info("This preview belongs to a different table. Preview the selected table to see its first rows.")
                    return
                st.success(f"Preview ready · {len(preview['rows'])} rows · first rows of the full dataset.")
                st.dataframe(preview["rows"], hide_index=True, use_container_width=True)
                st.caption("Actual preview null counts: " + ", ".join(f"{name}: {count}" for name, count in preview["null_counts"].items()))
            else:
                adapter = st.session_state.get("mock_attempt_adapter")
                if adapter and st.session_state.get("mock_saved_generation") != job.id:
                    from src.constructor_artifacts import fingerprint
                    manifest = json.loads(job.artifact(status["manifest"], workspace, revision).read_text(encoding="utf-8"))
                    samples = json.loads(job.artifact(status["samples"], workspace, revision).read_text(encoding="utf-8"))
                    evidence = {"status": "complete", "recipe_hash": fingerprint(job.request["recipe"]),
                                "recipe_revision": revision, "manifest": manifest, "samples": samples, "job_id": job.id}
                    # The worker and adapter identities must both still describe the active recipe.
                    if (adapter.identity == workspace and fingerprint(st.session_state.mock_recipe) == evidence["recipe_hash"]
                            and adapter.save({"recipe": st.session_state.mock_recipe, "recipe_revision": revision, "generation": evidence})):
                        st.session_state.mock_generation = evidence
                        st.session_state.mock_saved_generation = job.id
                st.success(f"Validated {status['completed_rows']:,} rows in {status['elapsed_seconds']:.1f}s. Downloads are ready.")
                manifest = json.loads(job.artifact(status["manifest"], workspace, revision).read_text(encoding="utf-8"))
                _generation_summary(manifest)
                if len(status["files"]) == 1:
                    filename = status["files"][0]
                    fmt = job.request["recipe"]["output"]["format"]
                    mime = {"csv": "text/csv", "json": "application/json", "jsonl": "application/x-ndjson", "text": "text/plain", "parquet": "application/octet-stream"}[fmt]
                    with job.artifact(filename, workspace, revision).open("rb") as handle:
                        st.download_button(f"Download {filename}", handle, file_name=filename, mime=mime, key="mock_table_download", type="primary")
                with st.expander("Download bundle & generation details", expanded=len(status["files"]) > 1):
                    with job.artifact(status["artifact"], workspace, revision).open("rb") as handle:
                        st.download_button("Download dataset bundle", handle, file_name="mock-dataset.zip", mime="application/zip", key="mock_bundle_download")
                    with job.artifact(status["manifest"], workspace, revision).open("rb") as handle:
                        st.download_button("Download generation manifest", handle, file_name="manifest.json", mime="application/json", key="mock_manifest_download")
        except (OSError, ValueError) as exc:
            st.warning(f"Downloads are no longer available: {exc}")


def _generation_summary(manifest):
    st.markdown("**Dataset checks**")
    table_rows, field_rows = [], []
    for table in manifest["tables"]:
        checks = table.get("checks", {})
        pks, refs = checks.get("primary_keys", {}), checks.get("relationships", {})
        table_rows.append({"Table": table["name"], "Rows": table["rows"],
            "Missing cells": sum(table["null_counts"].values()),
            "Primary keys": f"{len(pks)} passed" if pks else "None configured",
            "Relationships": f"{len(refs)} passed" if refs else "None configured"})
        for field in table["fields"]:
            nulls = table["null_counts"][field["id"]]
            pk, ref = pks.get(field["id"]), refs.get(field["id"])
            field_rows.append({"Table": table["name"], "Column": field["name"], "Missing": nulls,
                "Actual missing %": round(nulls * 100 / table["rows"], 2), "Configured missing %": field["null_pct"],
                "Key check": f"{pk['unique_values']:,} unique; no nulls" if pk else
                (f"{ref['checked_values']:,} values have parents; {ref['relation']} passed" if ref else "—")})
    st.dataframe(table_rows, hide_index=True, use_container_width=True)
    with st.expander("Column checks & missing values"):
        st.dataframe(field_rows, hide_index=True, use_container_width=True)
        st.caption("Missing percentages are probabilities. Dependent columns can also be missing when a source is missing. Key checks cover the full generated dataset.")


def render_mock_data(path, adapter=None):
    clear_prefix = st.session_state.pop("mock_clear_rule_prefix", None)
    if clear_prefix:
        for key in list(st.session_state):
            if key.startswith(clear_prefix) and key != "mock_rule_drafts":
                del st.session_state[key]
    if adapter and st.session_state.get("mock_workspace") != adapter.identity:
        close_mock_data()
        st.session_state.mock_workspace = adapter.identity
        st.session_state.mock_recipe = adapter.payload["recipe"]
        st.session_state.mock_revision = adapter.payload.get("recipe_revision", 0)
        st.session_state.mock_generation = adapter.payload.get("generation")
        for key, value in adapter.payload.get("ui_drafts", {}).items():
            if key.startswith(("mock_rule_", "mock_seed_")):
                st.session_state[key] = value
    if adapter:
        st.session_state.mock_attempt_adapter = adapter
    else:
        _saved_recipes(path)
    if "mock_workspace" not in st.session_state:
        st.session_state.mock_workspace = str(uuid4())
        st.session_state.mock_revision = 0
        st.session_state.mock_recipe = new_recipe()
    workspace, revision = st.session_state.mock_workspace, st.session_state.mock_revision
    recipe = deepcopy(st.session_state.mock_recipe)
    table = _picker(recipe) if len(recipe["tables"]) != 1 else recipe["tables"][0]
    if table:
        if len(recipe["tables"]) == 1:
            st.session_state.mock_table = table["id"]
        _table_controls(recipe, table, revision)
        _field_grid(recipe, table, revision)
        with st.expander("Column rules · ranges, choices, RegEx, missing values & keys",
                         expanded=any(f["generator"]["kind"] == "regex" for f in table["fields"])):
            _field_panel(recipe, table, revision)
    _mappings(recipe)
    _ai_customization(recipe, workspace)
    st.divider()
    st.subheader("Generate & download")
    format_col, summary = st.columns([1, 2], vertical_alignment="bottom")
    formats = ["csv", "json", "jsonl", "parquet", "text"]
    fmt = format_col.selectbox("File format", formats, index=formats.index(recipe["output"]["format"]),
        format_func=lambda v: {"csv": "CSV", "json": "JSON", "jsonl": "JSON Lines", "parquet": "Parquet", "text": "Text (delimited)"}[v], key=f"mock_format_{revision}")
    if fmt != recipe["output"]["format"]:
        recipe["output"]["format"] = fmt
        commit(recipe)
    total = sum(t["rows"] for t in recipe["tables"])
    summary.caption(f"{total:,} rows · {len(recipe['tables'])} {'table' if len(recipe['tables']) == 1 else 'tables'} · " + ("Individual file or ZIP bundle" if len(recipe["tables"]) == 1 else "All tables in one ZIP bundle"))
    with st.expander("File options & repeatable results"):
        output = recipe["output"]
        if fmt in ("csv", "text"):
            output["header"] = st.checkbox("Include column names", value=output["header"], key=f"mock_header_{revision}")
            output["null_marker"] = st.text_input("Missing value marker", output["null_marker"], max_chars=40, key=f"mock_marker_{revision}")
        if fmt == "text":
            delimiter = st.text_input("Delimiter (use \\t for tab)", output["delimiter"].replace("\t", "\\t"), max_chars=2, key=f"mock_delimiter_{revision}")
            output["delimiter"] = "\t" if delimiter == "\\t" else delimiter
        if "mock_seed_input" not in st.session_state and "mock_seed_draft" in st.session_state:
            st.session_state.mock_seed_input = st.session_state.mock_seed_draft
        seed = st.text_input("Random seed", str(recipe["seed"]), key="mock_seed_input")
        st.session_state.mock_seed_draft = seed
        seed_error = None
        try:
            parsed_seed = int(seed)
            if not 0 <= parsed_seed < 2**63:
                raise ValueError()
            recipe["seed"] = parsed_seed
        except ValueError:
            seed_error = "Random seed must be a whole number between 0 and 9223372036854775807."
            st.error(seed_error)
        st.caption("The same recipe and generator versions reproduce the same data. Faker text uses English values; timestamps use UTC.")
        st.caption("Up to 1,000,000 total rows, 100 columns per table, 10,000,000 cells, and a 100 MiB download.")
    if recipe != st.session_state.mock_recipe:
        commit(recipe)
    issues = recipe_issues(recipe)
    if seed_error:
        issues.append(seed_error)
    drafts = st.session_state.get("mock_rule_drafts", {})
    # Removed columns cannot leave an orphan draft that blocks generation.
    field_ids = {f["id"] for t in recipe["tables"] for f in t["fields"]}
    drafts = {k: v for k, v in drafts.items() if any(k.startswith(f"mock_rule_{identity}_") for identity in field_ids)}
    st.session_state.mock_rule_drafts = drafts
    st.session_state.mock_unapplied_rules = bool(drafts)
    if drafts:
        pending_names = [f["name"] for t in recipe["tables"] for f in t["fields"]
                         if any(k.startswith(f"mock_rule_{f['id']}_") for k in drafts)]
        st.warning("Unapplied column rules: " + ", ".join(pending_names) + ". Open Column rules and save each edited column before generating.")
        if st.button("Discard unapplied column rules"):
            st.session_state.mock_rule_drafts = {}
            st.session_state.mock_clear_rule_prefix = "mock_rule_"
            _autosave()
            st.rerun()
    if issues:
        st.error("Fix these settings before generating data:")
        for issue in issues:
            st.warning(issue)
    job = jobs.get(workspace)
    running = job is not None and job.status()["status"] == "running"
    generate_col, preview_col = st.columns(2)
    if generate_col.button("Generate data", type="primary", disabled=bool(issues or drafts) or running, use_container_width=True):
        begin(recipe)
    if preview_col.button("Preview 50 rows", disabled=bool(issues or drafts) or running or table is None, use_container_width=True):
        begin(recipe, "preview", table["id"])
    _poll(workspace, revision)
    _result(workspace, revision, "generate")
    _result(workspace, revision, "preview")
    st.divider()
    _imports(recipe, path)
    if adapter:
        pending_payload = {"recipe": st.session_state.mock_recipe, "recipe_revision": st.session_state.mock_revision,
                           "generation": st.session_state.get("mock_generation"), "ui_drafts": _draft_inputs(),
                           "pending_rules": bool(seed_error or st.session_state.get("mock_unapplied_rules"))}
        if pending_payload != adapter.payload:
            adapter.save(pending_payload)
        if adapter.attempt.get("project_run_id"):
            from src.capstone_ui import render_dataset_transfer
            render_dataset_transfer(path, adapter, jobs.get(workspace))
            if notice := st.session_state.pop("capstone_notice", None):
                st.info(notice)
        st.caption("Recipe drafts and generation evidence save to this attempt. Download dataset archives to keep them.")
        if st.session_state.get("mock_generation"):
            from src.constructor_artifacts import fingerprint
            evidence = st.session_state.mock_generation
            st.caption("Generation evidence saved" if evidence["recipe_hash"] == fingerprint(recipe) else "Previous generation evidence is outdated. Generate again.")
            with st.expander("Saved manifest and bounded samples"):
                st.json(evidence)
        if st.button("Save and return to attempt"):
            if adapter.return_to_attempt(pending_payload):
                close_mock_data()
                st.rerun()
    else:
        _autosave()
        if st.session_state.get("mock_save_error"):
            st.error("Draft not saved. " + st.session_state.mock_save_error)
        st.caption("Saved recipes stay on this device. Download generated files before leaving or changing the recipe.")


@st.cache_data(max_entries=64, show_spinner=False)
def _field_examples(recipe_json, table_id, field_id):
    from src.mock_engine import iter_rows
    from src.mock_exports import text_value
    recipe = json.loads(recipe_json)
    table = next(t for t in recipe["tables"] if t["id"] == table_id)
    index = next(i for i, f in enumerate(table["fields"]) if f["id"] == field_id)
    try:
        values = [text_value(row[index]) for row in iter_rows(recipe, table, 3)]
        return " · ".join("missing" if v is None else repr(v[:80]) for v in values)
    except (ValueError, OverflowError):
        return "Use Preview 50 rows to inspect the applied rule."
