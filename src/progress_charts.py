"""Small Vega-Lite specifications for Progress, without importing Altair.

Keep the built-in charts' values, stacking, colors, tooltips, scale navigation
and line hover. Construct fresh specs per call; no user data is cached.
"""
from copy import deepcopy


def chart_spec(series, *, line=False):
    names = list(series)
    multiple = len(names) > 1
    value_field = "value" if multiple else names[0]
    integer_values = all(type(value) is int for points in series.values() for value in points.values())
    encoding = {
        "x": {"field": "index", "type": "nominal" if line else "ordinal", "title": "",
              "axis": {"grid": False}, "scale": {}},
        "y": {"field": value_field, "type": "quantitative", "title": "",
              "axis": {"grid": True, **({"tickMinStep": 1} if integer_values else {})}, "scale": {}},
        "color": ({"field": "series", "type": "nominal", "title": " ",
                   "legend": {"titlePadding": 5, "offset": 5, "orient": "bottom"},
                   "scale": {"domain": names, "range": ["#0B766E", "#52666F"]}}
                  if multiple else {"value": "#0B766E"}),
        "tooltip": [{"field": "index", "type": "nominal", "title": "index"},
                    {"field": value_field, "type": "quantitative"}],
    }
    if multiple:
        encoding["tooltip"].append({"field": "series", "type": "nominal", "title": "color"})
    values = [{"index": label, value_field: value, **({"series": name} if multiple else {})}
              for name, points in series.items() for label, value in points.items()]
    pan = {"name": "progress_pan", "select": {"type": "interval", "encodings": ["x", "y"]}, "bind": "scales"}
    spec = {"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "data": {"values": values}, "height": 0, "width": 0,
            "params": [pan], "autosize": {"type": "fit", "contains": "padding"}}
    if line:
        pan["views"] = ["progress_line"]
        spec["params"].insert(0, {"name": "progress_hover", "select": {
            "type": "point", "clear": "mouseleave", "fields": ["index"], "nearest": True, "on": "mousemove"},
            "views": ["progress_points"]})
        spec["config"] = {"legend": {"symbolType": "stroke"}}
        spec["layer"] = [
            {"name": "progress_line", "mark": {"type": "line"}, "encoding": deepcopy(encoding)},
            {"name": "progress_points", "mark": {"type": "point", "opacity": 0}, "encoding": deepcopy(encoding)},
            {"mark": {"type": "point", "filled": True, "size": 65}, "encoding": encoding,
             "transform": [{"filter": {"param": "progress_hover", "empty": False}}]},
        ]
    else:
        spec.update(mark={"type": "bar"}, encoding=encoding)
    return spec
