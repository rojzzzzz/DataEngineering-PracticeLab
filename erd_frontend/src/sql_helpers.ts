export const quoteIdentifier = (name: string) =>
  `"${name.replaceAll('"', '""')}"`;

export function selectQuery(table: string, columns: string[]): string {
  const projection = columns.length
    ? columns.map(quoteIdentifier).join(",\n  ")
    : "*";
  return `SELECT\n  ${projection}\nFROM ${quoteIdentifier(table)}\nLIMIT 100;`;
}
