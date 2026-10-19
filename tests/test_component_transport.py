"""JSON editors must not incur Streamlit's dataframe detection/import cost."""
import json
import re
from types import SimpleNamespace
from urllib.parse import urljoin

import pytest
from streamlit.components.v2.bidi_component import serialization
from streamlit.proto.BidiComponent_pb2 import BidiComponent


@pytest.mark.parametrize("editor", ["erd", "sql", "python", "sql_tools", "pipeline"])
def test_json_editor_payload_bypasses_dataframe_detection(editor, tmp_path, monkeypatch):
    import importlib
    component = importlib.import_module(f"src.{editor}_component")
    captured = []
    def mount(**kwargs):
        captured.append(kwargs["data"])
        return SimpleNamespace(diagram=None, event=None)
    monkeypatch.setattr(component, "_component", lambda: mount)
    monkeypatch.setattr(component.st, "session_state", {})
    if editor == "erd":
        component.erd_editor(1, "logical_erd", None)
    elif editor == "sql":
        component.sql_editor(1, {"tables": [], "tasks": []}, "hash", {"drafts": {}}, False, "scratch")
    elif editor == "python":
        component.python_editor(1, "hash", "print('hello')", "", False, True, None)
    elif editor == "sql_tools":
        monkeypatch.setattr(component, "prewarm_sql_tools", lambda: None)
        component.render_sql_tools.__wrapped__(tmp_path / "test.db")
    else:
        component.render_pipeline.__wrapped__(tmp_path / "test.db")
    def unexpected_detection(_value):
        pytest.fail("Pure JSON editor data must not trigger dataframe imports")
    monkeypatch.setattr(serialization, "is_dataframe_like", unexpected_detection)
    proto = BidiComponent()
    serialization.serialize_mixed_data(captured[0], proto)
    decoded = json.loads(proto.json)
    assert len(decoded) == 1
    assert isinstance(decoded[0], dict)
    assert decoded == captured[0]


@pytest.mark.parametrize("editor", ["sql_tools", "pipeline"])
@pytest.mark.parametrize("prefix", ["", "practice", "/nested/practice/"])
def test_lazy_editor_assets_respect_server_url_prefix(editor, prefix, monkeypatch):
    import importlib
    component = importlib.import_module(f"src.{editor}_component")
    captured = {}
    component._component.clear()
    monkeypatch.setattr(component.st, "get_option", lambda name: prefix if name == "server.baseUrlPath" else None)
    def register(*args, **kwargs):
        captured.update(kwargs)
        return lambda **kwargs: None
    monkeypatch.setattr(component.st.components.v2, "component", register)
    try:
        component._component()
        match = re.search(r'new URL\((".*?"), window\.location\.origin\)', captured["js"])
        assert match, "The lazy loader must resolve its configured static URL"
        asset = json.loads(match.group(1))
        base = "/" + prefix.strip("/") if prefix.strip("/") else ""
        expected = base + "/app/static/" + ("pipeline/" if editor == "pipeline" else "sql-tools-editor.js")
        assert urljoin("http://localhost:8501/", asset).split("?", 1)[0] == "http://localhost:8501" + expected
        if editor == "pipeline":
            assert "window.EXCALIDRAW_ASSET_PATH = base.href" in captured["js"]
    finally:
        component._component.clear()
