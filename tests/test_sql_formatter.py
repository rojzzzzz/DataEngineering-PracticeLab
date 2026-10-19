"""Formatter regression tests: layout and SQL/template semantics."""
import pytest
import sqlglot
from jinja2 import Environment

from src.sql_formatter import format_sql
from src.sql_tools_worker import handle


def formatted(source, **options):
    return format_sql(source, **options)["sql"]


def assert_same_sql(before, after, dialect="postgres"):
    assert sqlglot.parse(before, read=dialect) == sqlglot.parse(after, read=dialect)


def test_short_clauses_stay_together_and_semicolon_stays_on_query():
    source = "select CustomerId, sum(Amount) as Total from Orders where Active = true order by Total desc;"
    output = formatted(source)
    assert output == (
        "SELECT CustomerId, sum(Amount) AS Total\n"
        "FROM Orders\nWHERE Active = TRUE\nORDER BY Total DESC;\n"
    )
    assert_same_sql(source, output)


@pytest.mark.parametrize("case", ["upper", "lower", "preserve"])
@pytest.mark.parametrize("indent", [2, 4])
def test_long_ctes_joins_cases_windows_and_multiple_queries(case, indent):
    source = """WITH LongOrders AS (SELECT CustomerId, Amount, CreatedAt, Status FROM Orders WHERE Status = 'Completed')
    SELECT CustomerId, sum(Amount) OVER (PARTITION BY CustomerId ORDER BY CreatedAt) AS RunningTotal,
    CASE WHEN Amount > 100 THEN 'High' ELSE 'Low' END AS Category
    FROM LongOrders LEFT JOIN Customers ON LongOrders.CustomerId=Customers.Id
    WHERE Amount > 0 AND CreatedAt > '2025-01-01'; SELECT 'Keep MiXeD' AS Label;"""
    output = formatted(source, keyword_case=case, tab_width=indent, line_length=80)
    assert_same_sql(source, output)
    assert "CustomerId" in output and "'Keep MiXeD'" in output
    assert formatted(output, keyword_case=case, tab_width=indent, line_length=80) == output
    assert all(len(line) <= 80 for line in output.splitlines())


@pytest.mark.parametrize("dialect,source", [
    ("postgres", 'select "MixedName", $1, $$a\n    b$$ from "Odd Table" where id=$2;'),
    ("mysql", "select `Order Details`, ? from `MyTable` limit 10;"),
    ("tsql", "select [Order Details], CustomerID from [MyTable] where Id=@id;"),
    ("bigquery", "select `Project.Dataset.Table`.Id, ARRAY_LENGTH([1,2,3]) from `Project.Dataset.Table`;"),
    ("snowflake", "select CustomerId, Amount::NUMBER from Orders qualify row_number() over (partition by CustomerId order by Amount desc)=1;"),
    ("spark", "select CustomerId, collect_list(Amount) from Orders group by CustomerId;"),
    ("sqlite", "select CustomerId, 'a\n    b' from Orders limit 1;"),
    ("duckdb", "select CustomerId, list_value(1,2) from Orders;"),
])
def test_dialects_preserve_names_parameters_and_multiline_literals(dialect, source):
    output = formatted(source)
    assert_same_sql(source, output, dialect)
    assert output == formatted(output)


JINJA_SAMPLES = [
    "{{ config(materialized='table') }}\nselect id, {{ var('column') }} as metric from {{ ref('orders') }}\n{% if is_incremental() %}\nwhere id > (select max(id) from {{ this }})\n{% endif %}",
    "select {% if yes %}id{% else %}amount{% endif %} from orders;",
    "select col{% if yes %}_one{% else %}_two{% endif %} from orders;",
    "select {% for col in columns %}{{ col }}{% if not loop.last %},{% endif %}{% endfor %} from orders;",
    "{% if yes %}\n{% for col in columns %}\nselect {{ col }} from orders;\n{% endfor %}\n{% else %}\nselect 1;\n{% endif %}",
    "select {{- ' id ' -}} from orders;",
    "{% set table %}orders{% endset %}\nselect id from {{ table }};",
    "{# Leave {{ this }} and {% if no %} intact #}\nselect '{{ var(\"column\") }}' as label from orders;",
    "{% raw %}select '{{ invalid {% hi }}' as label;{% endraw %}\nselect 1;",
    "select {{ {'key': 'id'}['key'] }} from orders;",
    "select col{% raw %}_one{% endraw %} from orders;",
    "{% set value %}Keep\n  This{% endset %}\nselect '{{ value }}' as label;",
    "{% macro field() %}id{% endmacro %}\nselect {{ field() }} from orders;",
]


@pytest.mark.parametrize("source", JINJA_SAMPLES)
@pytest.mark.parametrize("yes", [True, False])
def test_jinja_renders_equivalent_sql_and_formatting_is_stable(source, yes):
    # Rendering is done only in tests, with controlled data and helper functions.
    context = dict(yes=yes, columns=["id", "amount"], this="orders",
                   config=lambda **kwargs: "", var=lambda name: "amount",
                   ref=lambda name: name, is_incremental=lambda: yes)
    env = Environment()
    output = formatted(source)
    assert_same_sql(env.from_string(source).render(**context),
                    env.from_string(output).render(**context))
    assert formatted(output) == output


def test_jinja_contents_and_trim_markers_are_preserved_without_execution():
    source = "{{ config(\n  materialized='table',\n  tags=['One', 'Two']\n) }}\nselect {{- dangerous_function() -}} from {{ ref('MiXeD') }}"
    output = formatted(source)
    assert source.split("\nselect")[0] in output
    assert "{{- dangerous_function() -}}" in output
    assert "{{ ref('MiXeD') }}" in output


def test_nested_jinja_indentation():
    source = "{% if yes %}\n{% for col in columns %}\nselect {{ col }} from orders\n{% endfor %}\n{% endif %}"
    assert "\n  {% for" in formatted(source, tab_width=2)
    assert "\n    SELECT" in formatted(source, tab_width=2)
    assert "\n        SELECT" in formatted(source, tab_width=4)


def test_conditional_clauses_align_with_surrounding_query():
    source = "select id from orders\n{% if yes %}\nwhere id > 1\n{% endif %}\ngroup by id"
    output = formatted(source)
    assert "\n{% if yes %}\n  WHERE" in output
    assert "\n{% endif %}\nGROUP BY" in output


def test_comment_after_query_is_not_swallowed_by_semicolon():
    source = "select id from orders -- keep this\n; select 2;"
    output = formatted(source)
    assert "-- keep this" in output
    assert_same_sql(source, output)


@pytest.mark.parametrize("source", ["select 'unterminated", "select {{ ref('orders')", "{% if yes %}select 1", "{% endif %}select 1"])
def test_malformed_sql_and_jinja_return_an_error(source):
    with pytest.raises(Exception):
        formatted(source)


@pytest.mark.parametrize("options", [{"source": ""}, {"source": "x" * 200_001},
    {"keyword_case": "invalid"}, {"tab_width": True}, {"tab_width": 3}, {"line_length": 0}])
def test_limits_and_options_are_validated(options):
    with pytest.raises(ValueError):
        format_sql(**{"source": "select 1", **options})


def test_format_worker_uses_requested_options():
    result = handle(dict(action="format", sql="select id from Orders;", keywordCase="lower", tabWidth=4, lineLength=100))
    assert result["sql"] == "select id\nfrom Orders;\n"
    assert result["diagnostics"]
