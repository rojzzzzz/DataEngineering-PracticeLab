"""Portable, versioned Pipeline Designer documents. No execution or credentials."""
import base64
import copy
import json
import math

MAX_ELEMENTS = 2000
MAX_IMAGE = 5 * 1024 * 1024
MAX_PROJECT = 25 * 1024 * 1024
KINDS = {"source", "ingestion", "storage", "transformation", "quality", "orchestration", "destination", "data-flow", "control-flow"}
ELEMENT_TYPES = {"rectangle", "diamond", "ellipse", "text", "arrow", "line", "freedraw", "image", "frame", "magicframe", "embeddable", "iframe"}
APP_KEYS = {"viewBackgroundColor", "gridSize", "gridStep", "gridModeEnabled", "scrollX", "scrollY", "zoom", "theme"}
_JSON_SCALARS = {str, int, float, bool, type(None)}


def _copy_json(value, memo=None):
    """Copy validated JSON without deepcopy's per-scalar dispatch overhead.

    Keep shared references and fallback types compatible with deepcopy. JSON
    encoding/size validation runs first, so cycles and unsupported values fail
    before this copy is used.
    """
    if type(value) in _JSON_SCALARS:
        return value
    if memo is None:
        memo = {}
    identity = id(value)
    if identity in memo:
        return memo[identity]
    if type(value) is dict:
        result = {}
        memo[identity] = result
        result.update((key if type(key) in _JSON_SCALARS else copy.deepcopy(key, memo),
                       _copy_json(item, memo)) for key, item in value.items())
        return result
    if type(value) is list:
        result = []
        memo[identity] = result
        result.extend(_copy_json(item, memo) for item in value)
        return result
    return copy.deepcopy(value, memo)


def name_value(name):
    if not isinstance(name, str) or not name.strip() or len(name.strip()) > 200:
        raise ValueError("Choose a project name between 1 and 200 characters.")
    return name.strip()


def empty_document(name="Untitled pipeline"):
    return {"format": "constructor-pipeline", "version": 1, "name": name_value(name),
            "elements": [], "appState": {}, "files": {}, "notes": ""}


def validate_document(value):
    return _validate_document(value, copy_result=True)


def _validate_document(value, *, copy_result):
    """Validate everything; persistence can serialize borrowed children directly.

    Public callers receive independent mutable state. The save transaction only
    consumes the result, so it needs a new envelope, not a second scene copy.
    Neither path mutates the input or skips size, asset, or reference checks.
    """
    if not isinstance(value, dict) or value.get("format") != "constructor-pipeline" or type(value.get("version")) is not int or value["version"] != 1:
        raise ValueError("Unsupported Pipeline Designer project format or version.")
    try:
        encoded = json.dumps(value, allow_nan=False, ensure_ascii=False).encode("utf-8")
    except (ValueError, TypeError) as exc:
        raise ValueError("Project must contain finite JSON values.") from exc
    if len(encoded) > MAX_PROJECT:
        raise ValueError("Project exceeds the 25 MiB limit.")
    result = _copy_json(value) if copy_result else dict(value)
    result["name"] = name_value(value.get("name"))
    elements, files, app = result.get("elements"), result.get("files"), result.get("appState")
    if not isinstance(elements, list) or len(elements) > MAX_ELEMENTS:
        raise ValueError("A project can contain at most 2,000 elements.")
    if not isinstance(files, dict) or not isinstance(app, dict) or not isinstance(result.get("notes", ""), str):
        raise ValueError("Invalid scene settings, notes, or image files.")
    ids = set()
    for el in elements:
        if not isinstance(el, dict) or not isinstance(el.get("id"), str) or not el["id"] or el["id"] in ids:
            raise ValueError("Elements require unique nonempty IDs.")
        ids.add(el["id"])
        if el.get("type") not in ELEMENT_TYPES:
            raise ValueError("Unsupported canvas element type.")
        for key in ("x", "y", "width", "height"):
            if type(el.get(key)) not in (int, float) or not math.isfinite(el[key]):
                raise ValueError("Element positions and dimensions must be finite numbers.")
        if el["width"] < 0 or el["height"] < 0:
            raise ValueError("Element dimensions cannot be negative.")
        if el["type"] in ("arrow", "line", "freedraw"):
            points = el.get("points")
            if not isinstance(points, list) or not points or any(
                not isinstance(point, list) or len(point) != 2 or any(
                    type(coordinate) not in (int, float) or not math.isfinite(coordinate)
                    for coordinate in point) for point in points
            ):
                raise ValueError("Lines and strokes require valid coordinate pairs.")
        if el["type"] == "text" and not isinstance(el.get("text"), str):
            raise ValueError("Text elements require text content.")
        if "groupIds" in el and (not isinstance(el["groupIds"], list) or any(not isinstance(group, str) for group in el["groupIds"])):
            raise ValueError("Invalid element groups.")
        custom = el.get("customData", {})
        if not isinstance(custom, dict):
            raise ValueError("Invalid element metadata.")
        meta = custom.get("pipeline")
        if meta is not None:
            if not isinstance(meta, dict) or type(meta.get("version")) is not int or meta["version"] != 1 or meta.get("kind") not in KINDS:
                raise ValueError("Unsupported pipeline element metadata.")
            if not isinstance(meta.get("settings", {}), dict) or any(not isinstance(v, str) for v in meta.get("settings", {}).values()):
                raise ValueError("Pipeline settings must be text values.")
    for el in elements:
        refs = [el.get("containerId"), el.get("frameId")]
        for key in ("startBinding", "endBinding"):
            binding = el.get(key)
            if binding is not None:
                if not isinstance(binding, dict) or not isinstance(binding.get("elementId"), str):
                    raise ValueError("Invalid arrow binding.")
                refs.append(binding["elementId"])
        bound = el.get("boundElements") or []
        if not isinstance(bound, list) or any(not isinstance(item, dict) or not isinstance(item.get("id"), str) for item in bound):
            raise ValueError("Invalid bound elements.")
        refs.extend(item["id"] for item in bound)
        if any(ref is not None and (not isinstance(ref, str) or ref not in ids) for ref in refs):
            raise ValueError("An element refers to a missing shape or label.")
        if el.get("type") == "image" and not el.get("isDeleted") and el.get("fileId") not in files:
            raise ValueError("An image is missing its file data.")
    for key, asset in files.items():
        if not isinstance(asset, dict) or asset.get("id") != key:
            raise ValueError("Invalid image identity.")
        mime, data = asset.get("mimeType"), asset.get("dataURL")
        if mime not in ("image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml") or not isinstance(data, str) or not data.startswith(f"data:{mime};base64,"):
            raise ValueError("Images must contain embedded image data.")
        try:
            decoded = base64.b64decode(data.split(",", 1)[1], validate=True)
        except (ValueError, TypeError) as exc:
            raise ValueError("Invalid image encoding.") from exc
        if not decoded or len(decoded) > MAX_IMAGE:
            raise ValueError("Each image must be nonempty and at most 5 MiB.")
    result["appState"] = {key: val for key, val in app.items() if key in APP_KEYS}
    for key in ("scrollX", "scrollY"):
        if key in app and (type(app[key]) not in (int, float) or not math.isfinite(app[key])):
            raise ValueError("Invalid canvas position.")
    zoom = app.get("zoom")
    if zoom is not None and (not isinstance(zoom, dict) or type(zoom.get("value")) not in (int, float) or not 0.01 <= zoom["value"] <= 100):
        raise ValueError("Invalid canvas zoom.")
    result["notes"] = result.get("notes", "")
    return result


def import_document(payload, filename="Imported pipeline"):
    if len(payload) > MAX_PROJECT:
        raise ValueError("Project exceeds the 25 MiB limit.")
    value = json.loads(payload)
    if isinstance(value, dict) and value.get("type") == "excalidraw":
        if value.get("version") != 2:
            raise ValueError("Unsupported Excalidraw document version.")
        value = {**empty_document(filename.rsplit(".", 1)[0][:200]),
                 "elements": value.get("elements"), "files": value.get("files", {}),
                 "appState": value.get("appState", {})}
    return validate_document(value)
