export type Field = {
  id: string;
  name: string;
  data_type: string;
  pk: boolean;
  fk: boolean;
};
export type Entity = {
  id: string;
  name: string;
  role: "entity" | "table" | "fact" | "dimension";
  annotation: string;
  position: { x: number; y: number };
  fields: Field[];
};
export type Relationship = {
  source_handle?: "right" | "bottom";
  target_handle?: "left" | "top";
  id: string;
  source: string;
  target: string;
  label: string;
  source_cardinality: "one" | "many";
  target_cardinality: "one" | "many";
  source_optional: boolean;
  target_optional: boolean;
};
export type Stroke = {
  id: string;
  position: { x: number; y: number };
  points: { x: number; y: number }[];
  color: string;
  width: number;
};

export type Diagram = {
  version: 1;
  kind: string;
  entities: Entity[];
  relationships: Relationship[];
  strokes?: Stroke[];
};

/** Pick a readable unused name, including after deletions and duplications. */
export function nextName(names: string[], base: string): string {
  const used = new Set(names.map((name) => name.trim().toLowerCase()));
  let index = 1;
  while (used.has(`${base}_${index}`.toLowerCase())) index++;
  return `${base}_${index}`;
}

/** Move a field one slot while preserving its identity and key settings. */
export function moveField(
  diagram: Diagram,
  entityId: string,
  fieldId: string,
  direction: -1 | 1,
): Diagram {
  const entity = diagram.entities.find((item) => item.id === entityId);
  const index = entity?.fields.findIndex((field) => field.id === fieldId) ?? -1;
  if (
    !entity ||
    index < 0 ||
    index + direction < 0 ||
    index + direction >= entity.fields.length
  )
    return diagram;
  const fields = [...entity.fields];
  [fields[index], fields[index + direction]] = [
    fields[index + direction],
    fields[index],
  ];
  return {
    ...diagram,
    entities: diagram.entities.map((item) =>
      item.id === entityId ? { ...item, fields } : item,
    ),
  };
}

/** Stable grid with row heights based on content, so tall tables never overlap. */
export function arrangeEntities(diagram: Diagram): Diagram {
  const columns = Math.max(1, Math.ceil(Math.sqrt(diagram.entities.length)));
  let y = 60;
  const entities: Entity[] = [];
  for (let i = 0; i < diagram.entities.length; i += columns) {
    const row = diagram.entities.slice(i, i + columns);
    row.forEach((entity, column) =>
      entities.push({
        ...entity,
        position: { x: 60 + column * 340, y },
      }),
    );
    y +=
      Math.max(
        ...row.map(
          (entity) =>
            140 + entity.fields.length * 30 + (entity.annotation ? 70 : 0),
        ),
      ) + 80;
  }
  return { ...diagram, entities };
}

/** Deleting an entity also removes its incident relationships. */
export function removeElements(
  diagram: Diagram,
  entityIds: string[],
  relationshipIds: string[] = [],
): Diagram {
  const entities = new Set(entityIds);
  const relationships = new Set(relationshipIds);
  return {
    ...diagram,
    ...(diagram.strokes
      ? {
          strokes: diagram.strokes.filter((stroke) => !entities.has(stroke.id)),
        }
      : {}),
    entities: diagram.entities.filter((entity) => !entities.has(entity.id)),
    relationships: diagram.relationships.filter(
      (relation) =>
        !relationships.has(relation.id) &&
        !entities.has(relation.source) &&
        !entities.has(relation.target),
    ),
  };
}
