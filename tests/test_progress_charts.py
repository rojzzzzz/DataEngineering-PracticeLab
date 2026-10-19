from copy import deepcopy

from src.progress_charts import chart_spec


def test_activity_values_hover_and_navigation_preserved():
    series = {"Attempts": {"2026-10-01": 0, "2026-10-02": 3}}
    original = deepcopy(series)
    spec = chart_spec(series, line=True)
    assert series == original
    assert spec["data"]["values"] == [
        {"index": "2026-10-01", "Attempts": 0}, {"index": "2026-10-02", "Attempts": 3}]
    assert [layer["mark"]["type"] for layer in spec["layer"]] == ["line", "point", "point"]
    assert spec["params"][0]["select"]["nearest"] is True
    assert spec["params"][1]["bind"] == "scales"
    assert spec["layer"][0]["encoding"]["y"]["axis"]["tickMinStep"] == 1
    assert spec["layer"][0]["encoding"]["tooltip"][1]["field"] == "Attempts"
    spec["layer"][0]["encoding"]["x"]["title"] = "changed"
    assert chart_spec(series, line=True)["layer"][0]["encoding"]["x"]["title"] == ""


def test_family_series_keep_all_values_stacking_colors_and_legend():
    spec = chart_spec({"Completed": {"SCN": 2, "SQL": 0}, "Available": {"SCN": 8, "SQL": 9}})
    assert spec["data"]["values"] == [
        {"index": "SCN", "value": 2, "series": "Completed"},
        {"index": "SQL", "value": 0, "series": "Completed"},
        {"index": "SCN", "value": 8, "series": "Available"},
        {"index": "SQL", "value": 9, "series": "Available"},
    ]
    color = spec["encoding"]["color"]
    assert color["scale"] == {"domain": ["Completed", "Available"], "range": ["#0B766E", "#52666F"]}
    assert color["legend"]["orient"] == "bottom"
    assert "xOffset" not in spec["encoding"]  # Existing bars stack, rather than grouping.
    assert spec["params"][0]["bind"] == "scales"


def test_topic_labels_and_fractional_scores_remain_data():
    spec = chart_spec({"Average score": {'A "quoted" topic': 73.5, "東京": 0.0}})
    assert spec["data"]["values"] == [
        {"index": 'A "quoted" topic', "Average score": 73.5},
        {"index": "東京", "Average score": 0.0},
    ]
    assert spec["encoding"]["y"]["field"] == "Average score"
    assert "tickMinStep" not in spec["encoding"]["y"]["axis"]
