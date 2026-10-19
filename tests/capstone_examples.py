"""Learner-authored acceptance designs, never supplied as application solutions."""
import json
from pathlib import Path
import time

from src import capstone_store as store, constructor_artifacts as artifacts, database as db
from src.constructor_models import fingerprint, stamp
from src.mock_models import new_recipe, new_table, new_field, validate_recipe
from src.mock_jobs import Job
from src.capstone_datasets import save_from_job
from src.capstone_sql import DatasetWorkspace
from src.sql_runner import SQLJob
from src.pipeline_models import empty_document

ROOT = Path(__file__).resolve().parents[1]


def bank():
    return json.loads((ROOT / "data/challenges.json").read_text(encoding="utf-8"))


def recipe():
    r = new_recipe()
    customers, subscriptions, products, orders, lines = [new_table(n) for n in ("customers", "subscriptions", "products", "orders", "order_lines")]
    for t, count in zip((customers, subscriptions, products, orders, lines), (20, 30, 10, 80, 240)):
        t["rows"] = count
        t["fields"] = [t["fields"][0]]
    products["fields"][0].update(type="uuid", generator={"kind": "uuid"})
    def fk(table, name, parent):
        f = new_field(name, parent["fields"][0]["type"])
        f.update(generator={"kind": "foreign_key"}, reference={"table_id": parent["id"], "field_id": parent["fields"][0]["id"], "relation": "many-to-one"})
        table["fields"].append(f)
    fk(subscriptions, "customer_id", customers)
    fk(subscriptions, "product_id", products)
    fk(orders, "subscription_id", subscriptions)
    fk(lines, "order_id", orders)
    fk(lines, "product_id", products)
    day = new_field("placed_at", "date")
    day["generator"] = {"kind": "date", "min": "2026-01-01", "max": "2026-03-31"}
    status = new_field("status")
    status["generator"] = {"kind": "choice", "values": ["fulfilled", "pending", "cancelled"], "weights": [7, 2, 1]}
    quantity, price = new_field("quantity", "integer"), new_field("unit_price", "decimal")
    quantity["generator"] = {"kind": "number", "min": 1, "max": 5}
    price["generator"] = {"kind": "number", "min": "8.00", "max": "24.99"}
    loaded = new_field("loaded_at", "timestamp")
    loaded["generator"] = {"kind": "timestamp", "min": "2026-04-01T00:00:00Z", "max": "2026-04-01T23:59:59Z"}
    orders["fields"] += [day, status, loaded]
    lines["fields"] += [quantity, price]
    r["tables"] = [customers, subscriptions, products, orders, lines]
    return validate_recipe(r)


def model(kind, r):
    entities, relationships = [], []
    for t in r["tables"]:
        entities.append({"id": t["id"], "name": t["name"], "position": {"x": len(entities)*260, "y": 0},
            "fields": [] if kind == "conceptual_erd" else [
                {"id": f["id"], "name": f["name"], "data_type": f["type"], "pk": f["primary_key"], "fk": bool(f["reference"])} for f in t["fields"]]})
        for f in t["fields"]:
            if ref := f["reference"]:
                relationships.append({"id": "rel_" + f["id"], "source": ref["table_id"], "target": t["id"],
                    "source_field": None if kind == "conceptual_erd" else ref["field_id"], "target_field": None if kind == "conceptual_erd" else f["id"],
                    "source_cardinality": "one", "target_cardinality": "many", "source_optional": False, "target_optional": False, "label": "contains"})
    return {"version": 1, "kind": kind, "entities": entities, "relationships": relationships}


def reasoning(run, sid):
    stage = next(s for s in run["definition"]["stages"] if s["id"] == sid)
    return "\n\n".join("## " + label + "\n" +
        "Test-authored design: line grain, USD, fulfilled orders in Jan–Mar 2026. "
        "Map line quantity × exact unit_price with order date and product. "
        "Subscriptions identify ordering context; line products are independent selections, not a subscription-product invariant. "
        "Reconcile independent source totals; validate missing parents and line fanout. "
        "Use incremental ingestion with stable IDs, idempotent replay, quarantines, least privilege and recovery checkpoints. "
        "Synthetic independence cannot establish cross-field business correctness."
        for label in stage["written_sections"])


def star_model():
    def entity(identity, name, role, fields, x):
        return {"id": identity, "name": name, "role": role, "annotation": "One row per fulfilled operational order line; revenue additive across date and product.",
            "position": {"x": x, "y": 0}, "fields": [{"id": identity + str(i), "name": name, "data_type": kind, "pk": pk, "fk": fk}
                for i, (name, kind, pk, fk) in enumerate(fields)]}
    date = entity("date", "dim_date", "dimension", [("date_key", "date", True, False)], 0)
    product = entity("product", "dim_product", "dimension", [("product_key", "uuid", True, False)], 600)
    fact = entity("fact", "fact_coffee_lines", "fact", [("line_id", "integer", True, False), ("date_key", "date", False, True),
        ("product_key", "uuid", False, True), ("quantity", "integer", False, False), ("unit_price", "decimal(12,2)", False, False), ("revenue", "decimal(24,2)", False, False)], 300)
    return {"version": 1, "kind": "star_schema", "entities": [date, fact, product], "relationships": [
        {"id": "datefact", "source": "date", "target": "fact", "source_cardinality": "one", "target_cardinality": "many", "source_optional": False, "target_optional": False, "label": "placed on"},
        {"id": "productfact", "source": "product", "target": "fact", "source_cardinality": "one", "target_cardinality": "many", "source_optional": False, "target_optional": False, "label": "sold as"}]}


def finish(path, run, sid):
    aid = store.get_run(path, run["run_id"])["stage_attempts"][sid]
    db.save_attempt_details(path, {**db.get_attempt(path, aid), "answer": reasoning(run, sid), "status": "Completed", "completed_at": stamp()})
    return aid


def save_model(path, run, sid, value):
    aid = store.start_stage(path, run["run_id"], sid)
    slot = db.get_attempt(path, aid)["constructor_workspace"]["tasks"]["slots"][0]
    artifacts.save_artifact(path, aid, slot["id"], value, 0)
    return finish(path, run, sid)


def generate_save(path, aid, r, *, replace=False):
    old = db.get_attempt(path, aid)["constructor_workspace"]["artifacts"]["recipe"]
    revision = old["payload"].get("recipe_revision", 0) + 1
    saved = artifacts.save_artifact(path, aid, "recipe", {"recipe": r, "recipe_revision": revision, "generation": None}, old["revision"])
    job = Job(f"attempt:{aid}:artifact:recipe", revision, r)
    try:
        deadline = time.monotonic() + 25
        while job.status()["status"] == "running" and time.monotonic() < deadline:
            time.sleep(.05)
        status = job.status()
        assert status["status"] == "complete", status
        manifest = json.loads(job.artifact(status["manifest"], job.workspace_id, revision).read_text(encoding="utf-8"))
        samples = json.loads(job.artifact(status["samples"], job.workspace_id, revision).read_text(encoding="utf-8"))
        artifacts.save_artifact(path, aid, "recipe", {"recipe": r, "recipe_revision": revision,
            "generation": {"status": "complete", "recipe_hash": fingerprint(r), "recipe_revision": revision, "manifest": manifest, "samples": samples, "job_id": job.id}}, saved["revision"])
        return save_from_job(path, aid, "recipe", job, confirm_replace=replace)
    finally:
        job.close()


MAPPING = """WITH mapped AS (
 SELECT l.id AS line_id,l.product_id,o.placed_at,l.quantity*l.unit_price AS revenue
 FROM order_lines l JOIN orders o ON o.id=l.order_id
 WHERE o.status='fulfilled' AND o.placed_at>=DATE '2026-01-01' AND o.placed_at<DATE '2026-04-01'
) """
QUERIES = {
    "monthly": MAPPING + "SELECT date_trunc('month',placed_at) AS month,sum(revenue) AS revenue FROM mapped GROUP BY 1 ORDER BY 1",
    "products": MAPPING + "SELECT product_id,sum(revenue) AS revenue,dense_rank() OVER (ORDER BY sum(revenue) DESC) AS rank FROM mapped GROUP BY 1 ORDER BY rank,product_id",
    "reconciliation": MAPPING + """, source_total AS (
 SELECT sum(l.quantity*l.unit_price) AS total FROM order_lines l
 WHERE l.order_id IN (SELECT id FROM orders WHERE status='fulfilled' AND placed_at>=DATE '2026-01-01' AND placed_at<DATE '2026-04-01'))
 SELECT s.total AS source_total,m.total AS analytical_total,s.total-m.total AS difference FROM source_total s CROSS JOIN (SELECT sum(revenue) AS total FROM mapped) m""",
    "diagnostics": """SELECT l.id,count(o.id) AS joined_orders,count(p.id) AS joined_products
 FROM order_lines l LEFT JOIN orders o ON l.order_id=o.id LEFT JOIN products p ON l.product_id=p.id
 GROUP BY l.id HAVING count(o.id)<>1 OR count(p.id)<>1""",
}


def build_to_queries(path):
    db.init_db(path)
    b, r = bank(), recipe()
    run = store.create_run(path, b["capstones"][0], b)
    save_model(path, run, "business", model("conceptual_erd", r))
    save_model(path, run, "operational", model("logical_erd", r))
    # Stage 4 can finish before Stage 3 even starts.
    save_model(path, run, "analytical", star_model())
    aid = store.start_stage(path, run["run_id"], "data")
    store.derive_recipe(path, aid, "operational-model")
    snapshot = generate_save(path, aid, r)
    finish(path, run, "data")
    qid = store.start_stage(path, run["run_id"], "queries")
    return run, qid, snapshot, r


def run_queries(path, aid, *, state=None):
    state = {} if state is None else state
    jobs = []
    def start_job(*args, **kwargs):
        job = SQLJob(*args, **kwargs)
        jobs.append(job)
        return job
    coordinator = DatasetWorkspace(state, path, aid, start_job=start_job)
    for index, task in enumerate(QUERIES):
        view = coordinator.apply({"id": stamp(), "attemptId": aid, "exerciseHash": coordinator.editor_hash, "action": "run",
            "active": task, "selection": "", "drafts": {**QUERIES, "scratch": ""}})
        assert not view.error, view.error
        result = jobs[-1].wait()
        assert result.get("ok"), result
        view = coordinator.refresh()
        assert view.rerun and not view.error, view.error
    return coordinator


def complete_project(path):
    run, qid, snapshot, r = build_to_queries(path)
    run_queries(path, qid)
    finish(path, run, "queries")
    oid = store.start_stage(path, run["run_id"], "operations")
    doc = empty_document("Coffee ingestion and recovery")
    doc["elements"] = [{"id": "ingest", "type": "rectangle", "x": 0, "y": 0, "width": 240, "height": 100,
        "customData": {"pipeline": {"version": 1, "kind": "ingestion", "settings": {"scope": "incremental", "watermark": "id"}}}}]
    artifacts.save_artifact(path, oid, "pipeline", doc, 0)
    finish(path, run, "operations")
    store.complete_run(path, run["run_id"])
    signature = store.view(path, run["run_id"])[3]
    store.evaluate_run(path, run["run_id"], run["rubric"], "Test review of whole project, not an execution grade.", expected_fingerprint=signature)
    return store.get_run(path, run["run_id"]), qid, snapshot, r
