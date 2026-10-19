import copy
import json

import pytest

from src import pipeline_store as store
from src.pipeline_models import empty_document, import_document, validate_document


def shape(identity="node", **extra):
    return {"id": identity, "type": "rectangle", "x": 0, "y": 0, "width": 200, "height": 100,
            "customData": {"foreign": {"keep": True}, "pipeline": {"version": 1, "kind": "ingestion", "settings": {"scope": "incremental", "watermark": "updated_at"}}}, **extra}


def test_pipeline_crud_revision_and_isolation(tmp_path):
    path = tmp_path / "test.db"
    store.init_store(path)
    store.init_store(path)
    doc = empty_document("Orders")
    doc["elements"] = [shape()]
    identity = store.create_document(path, doc["name"], doc)
    assert store.load_document(path, identity)["document"] == doc
    doc["notes"] = "Design notes"
    assert store.save_document(path, identity, 0, doc, {}) == 1
    with pytest.raises(ValueError, match="another session"):
        store.save_document(path, identity, 0, empty_document(), {})
    assert store.load_document(path, identity)["document"]["notes"] == "Design notes"
    duplicate = store.create_document(path, "Copy", store.load_document(path, identity)["document"])
    store.delete_document(path, identity, 1)
    assert len(store.list_documents(path)) == 1
    assert store.load_document(path, duplicate)["document"]["name"] == "Copy"


def test_image_deltas_atomicity_and_undo_retention(tmp_path):
    path = tmp_path / "test.db"
    store.init_store(path)
    identity = store.create_document(path, "Images")
    doc = empty_document("Images")
    doc["elements"] = [shape(type="image", fileId="picture")]
    asset = {"id": "picture", "mimeType": "image/png", "dataURL": "data:image/png;base64,aGVsbG8=", "created": 1}
    store.save_document(path, identity, 0, doc, {"picture": asset})
    doc["elements"][0]["x"] = 200
    store.save_document(path, identity, 1, doc, {})
    assert store.load_document(path, identity)["document"]["files"]["picture"] == asset
    doc["elements"][0]["isDeleted"] = True
    store.save_document(path, identity, 2, doc, {})
    doc["elements"][0]["isDeleted"] = False
    store.save_document(path, identity, 3, doc, {})
    with pytest.raises(ValueError):
        store.save_document(path, identity, 4, doc, {"bad": {"id": "bad"}})
    assert store.load_document(path, identity)["revision"] == 4
    assert "bad" not in store.load_document(path, identity)["document"]["files"]


@pytest.mark.parametrize("mutation", [
    lambda d: d.update(version=2),
    lambda d: d.update(name=""),
    lambda d: d.update(elements=[shape(), shape()]),
    lambda d: d.update(elements=[shape(x=float("nan"))]),
    lambda d: d.update(elements=[shape(width=-10)]),
    lambda d: d.update(elements=[shape(type="arrow", points=[[0, "bad"]])]),
    lambda d: d.update(elements=[shape(type="text", text={})]),
    lambda d: d.update(elements=[shape(groupIds="invalid")]),
    lambda d: d.update(elements=[shape(startBinding={"elementId": "absent"})]),
    lambda d: d.update(elements=[shape(type="image", fileId="missing")]),
    lambda d: d.update(elements=[shape(customData={"pipeline": {"version": 2, "kind": "source"}})]),
    lambda d: d.update(elements=[shape(str(i)) for i in range(2001)]),
])
def test_invalid_projects_rejected(mutation):
    doc = empty_document()
    mutation(doc)
    with pytest.raises(ValueError):
        validate_document(doc)


def test_portable_formats_and_unknown_metadata():
    doc = empty_document("Portable")
    doc["elements"] = [shape()]
    assert import_document(json.dumps(doc).encode()) == doc
    raw = {"type": "excalidraw", "version": 2, "elements": doc["elements"], "appState": {"selectedElementIds": {"node": True}}, "files": {}}
    result = import_document(json.dumps(raw).encode(), "Portable.excalidraw")
    assert result == doc
    assert result["elements"][0]["customData"]["foreign"] == {"keep": True}


def test_validation_copy_preserves_metadata_and_owns_mutable_state():
    doc = empty_document("Copies")
    shared = {"labels": ["orders", {"revision": 1}]}
    doc["elements"] = [shape(customData={"first": shared, "second": shared,
        "extra": ("native tuple", {"labels": ["kept"]})})]
    doc["appState"] = {"zoom": {"value": 1}}
    validated = validate_document(doc)
    assert validated == copy.deepcopy(doc)
    metadata = validated["elements"][0]["customData"]
    assert metadata["first"] is metadata["second"]
    metadata["first"]["labels"][1]["revision"] = 2
    metadata["extra"][1]["labels"].append("new")
    validated["appState"]["zoom"]["value"] = 2
    assert shared["labels"][1]["revision"] == 1
    assert doc["elements"][0]["customData"]["extra"][1]["labels"] == ["kept"]
    assert doc["appState"]["zoom"]["value"] == 1


def test_save_rejects_missing_project_and_stale_revision_before_asset_work(tmp_path, monkeypatch):
    path = tmp_path / "test.db"
    store.init_store(path)
    doc = empty_document("Revisions")
    identity = store.create_document(path, doc["name"], doc)
    def unexpected_assets(*args):
        pytest.fail("Rejected revisions must not load image assets")
    monkeypatch.setattr(store, "_load_files", unexpected_assets)
    with pytest.raises(ValueError, match="another session"):
        store.save_document(path, identity, 10, doc, {})
    with pytest.raises(ValueError, match="no longer exists"):
        store.save_document(path, "missing", 0, doc, {})


def test_assets_and_projects_limited():
    doc = empty_document()
    doc["files"] = {"a": {"id": "a", "mimeType": "image/png", "dataURL": "data:image/png;base64," + "AAAA" * (5 * 1024 * 1024 // 3 + 1)}}
    with pytest.raises(ValueError, match="5 MiB"):
        validate_document(doc)
    with pytest.raises(ValueError, match="25 MiB"):
        import_document(b" " * (25 * 1024 * 1024 + 1))


def test_save_validates_without_mutating_caller_and_normalizes_settings(tmp_path):
    path = tmp_path / "test.db"
    store.init_store(path)
    doc = empty_document("Save input")
    doc["elements"] = [shape()]
    doc["appState"] = {"scrollX": 10, "selectedElementIds": {"node": True}}
    original = copy.deepcopy(doc)
    identity = store.create_document(path, doc["name"])
    store.save_document(path, identity, 0, doc, {})
    assert doc == original
    reopened = store.load_document(path, identity)["document"]
    assert reopened["appState"] == {"scrollX": 10}
    assert reopened["elements"] == doc["elements"]
    doc["elements"][0]["x"] = float("nan")
    with pytest.raises(ValueError, match="finite"):
        store.save_document(path, identity, 1, doc, {})
    assert store.load_document(path, identity)["revision"] == 1


def test_constructor_menu_includes_pipeline(tmp_path, monkeypatch):
    from test_constructor import constructor_app, widget
    app = constructor_app(tmp_path, monkeypatch, tool=None)
    assert widget(app.button, "Open Pipeline Designer")
    widget(app.button, "Open Pipeline Designer").click().run()
    assert not app.exception
