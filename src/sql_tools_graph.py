"""Shared graph envelope and limits, independent of SQL parsing engines."""

MAX_PLAN = 2_000_000
MAX_NODES = 500


class Graph:
    def __init__(self):
        self.nodes = []
        self.edges = []
        self.diagnostics = []

    def node(self, label, kind, properties=None, sql=""):
        if len(self.nodes) >= MAX_NODES:
            raise ValueError("Visualization exceeds 500 nodes. Select a smaller query or plan.")
        key = f"n{len(self.nodes)}"
        self.nodes.append({"id": key, "label": label, "kind": kind,
                           "properties": properties or {}, "sql": sql})
        return key

    def edge(self, source, target, label="", back=False):
        self.edges.append({"id": f"e{len(self.edges)}", "source": source, "target": target,
                           "label": label, "back": back})

    def result(self):
        return {"nodes": self.nodes, "edges": self.edges, "diagnostics": self.diagnostics}


