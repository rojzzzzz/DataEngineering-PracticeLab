import pytest

from src.diagram_sql import parse_create_tables
from src.diagrams import empty_diagram, validate_diagram


def test_quoted_names_types_comments_and_composite_keys():
    tables = parse_create_tables('''
        -- Commas inside defaults and types are not column separators.
        CREATE TABLE "sales"."order details" (
          "order id" BIGINT NOT NULL,
          line INTEGER,
          product_id BIGINT REFERENCES products(id),
          amount DECIMAL(12, 2) DEFAULT 0,
          note VARCHAR(80) DEFAULT 'CREATE TABLE IF EXISTS ignored (a INT); a,b',
          CONSTRAINT order_pk PRIMARY KEY ("order id", line),
          FOREIGN KEY ("order id", line) REFERENCES orders(id, line)
        );
        CREATE TABLE IF NOT EXISTS products (id BIGINT PRIMARY KEY);
    ''')
    assert [t["entity"]["name"] for t in tables] == ["sales.order details", "products"]
    fields = {f["name"]: f for f in tables[0]["entity"]["fields"]}
    assert len(fields) == 5
    assert fields["order id"]["pk"] and fields["line"]["pk"]
    assert fields["order id"]["fk"] and fields["line"]["fk"] and fields["product_id"]["fk"]
    assert fields["amount"]["data_type"] == "DECIMAL(12, 2)"
    assert not tables[0]["ifNotExists"] and tables[1]["ifNotExists"]
    diagram = empty_diagram("logical_erd")
    diagram["entities"] = [t["entity"] for t in tables]
    assert validate_diagram(diagram) == diagram


@pytest.mark.parametrize("sql", ["CREATE TABLE IF EXISTS t (id INT)",
                                   "create table if /* shorthand */ exists t (id int)"])
def test_if_exists_shorthand(sql):
    table = parse_create_tables(sql)[0]
    assert table["ifNotExists"] and table["entity"]["name"] == "t"


@pytest.mark.parametrize("dialect,sql,name", [
    ("mysql", "CREATE TABLE `Order` (`id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255)) ENGINE=InnoDB", "Order"),
    ("tsql", "CREATE TABLE [dbo].[Users] ([id] INT IDENTITY(1,1) PRIMARY KEY, [name] NVARCHAR(100))", "dbo.Users"),
    ("sqlite", "CREATE TABLE t (id INTEGER PRIMARY KEY, value TEXT)", "t"),
])
def test_dialects(dialect, sql, name):
    table = parse_create_tables(sql, dialect)[0]["entity"]
    assert table["name"] == name and table["fields"][0]["pk"]


@pytest.mark.parametrize("source", ["", "-- comment only", "SELECT 1", "DROP TABLE customers",
    "CREATE TABLE t AS SELECT 1 AS id", "CREATE TABLE t (id INT", "CREATE TABLE t (name TEXT DEFAULT 'unclosed)", "CREATE VIEW t AS SELECT 1",
    "CREATE TABLE a (id INT); DELETE FROM a", "CREATE TABLE a (id INT, id TEXT)",
    "CREATE TABLE a (id INT, PRIMARY KEY(missing))", "CREATE OR REPLACE TABLE a (id INT)",
    "CREATE TABLE a (" + ",".join(f"f{i} INT" for i in range(101)) + ")"])
def test_unsupported_or_invalid_sql_is_rejected_atomically(source):
    with pytest.raises(ValueError):
        parse_create_tables(source)
