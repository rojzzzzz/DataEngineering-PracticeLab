import type { Diagram, Entity } from "./model";

export type SqlTable = { entity: Entity; ifNotExists: boolean };
export type SqlImport = { id: string; tables: SqlTable[] };

/** Append atomically to the latest local draft, preserving edits and undo data. */
export function addSqlTables(diagram: Diagram, tables: SqlTable[]): Diagram {
  const names = new Set(
    diagram.entities.map((e) => e.name.trim().toLowerCase()),
  );
  const additions: Entity[] = [];
  const x = diagram.entities.length
    ? Math.max(...diagram.entities.map((e) => e.position.x)) + 380
    : 60;
  let y = 60;
  let rowHeight = 0;
  for (const { entity, ifNotExists } of tables) {
    const name = entity.name.trim().toLowerCase();
    if (names.has(name)) {
      if (ifNotExists) continue;
      throw new Error(
        `Table ${entity.name} already exists. Use IF NOT EXISTS to skip it.`,
      );
    }
    if (diagram.entities.length + additions.length >= 100)
      throw new Error("A diagram can contain at most 100 tables.");
    if (additions.length && additions.length % 3 === 0) {
      y += rowHeight + 80;
      rowHeight = 0;
    }
    const position = { x: x + (additions.length % 3) * 340, y };
    if (Math.abs(position.x) >= 100000 || Math.abs(position.y) >= 100000)
      throw new Error(
        "Move the existing tables closer to the canvas center before importing.",
      );
    additions.push({
      ...entity,
      position,
      role:
        diagram.kind === "conceptual_erd"
          ? "entity"
          : diagram.kind === "star_schema"
            ? "dimension"
            : "table",
    });
    rowHeight = Math.max(rowHeight, 140 + entity.fields.length * 30);
    names.add(name);
  }
  return additions.length
    ? { ...diagram, entities: [...diagram.entities, ...additions] }
    : diagram;
}
