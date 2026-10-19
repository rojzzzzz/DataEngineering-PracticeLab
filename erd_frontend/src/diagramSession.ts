import type { Diagram } from "./model";
import { SaveScheduler } from "./saveScheduler.ts";
import { addSqlTables, type SqlImport } from "./sqlDiagram.ts";

type LocalDraft = { base: string; diagram: Diagram };
type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type SqlImportResult = { id: string; error?: string; message?: string };
type SessionView = {
  diagram: Diagram;
  conflictingDraft: Diagram | null;
  canUndo: boolean;
  canRedo: boolean;
  isSaved: boolean;
};

// Resolve browser storage lazily: disabled storage must never block editing.
const browserDraftStorage: DraftStorage = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
  removeItem: (key) => sessionStorage.removeItem(key),
};

/** Own history, recovery and save provenance for one mounted diagram. */
export class DiagramSession {
  private snapshot: SessionView;
  private saved: string;
  private readonly key: string;
  private readonly storage: DraftStorage | null;
  private readonly saves: SaveScheduler<Diagram>;
  private readonly now: () => number;
  private readonly listeners = new Set<() => void>();
  private past: Diagram[] = [];
  private future: Diagram[] = [];
  private lastEdit = 0;
  private lastImport: string | null = null;
  private started = false;
  private recovered = false;
  private submitted: Diagram[] = [];

  constructor(options: {
    documentId: string;
    diagram: Diagram;
    savedDiagram?: Diagram;
    workspace?: boolean;
    save: (diagram: Diagram) => void;
    storage?: DraftStorage;
    now?: () => number;
  }) {
    this.key = `constructor-draft:${options.documentId}`;
    this.storage = options.workspace
      ? (options.storage ?? browserDraftStorage)
      : null;
    this.now = options.now ?? Date.now;
    this.saved = JSON.stringify(options.savedDiagram ?? options.diagram);
    const draft = this.readDraft();
    this.recovered = Boolean(
      draft &&
      draft.diagram.kind === options.diagram.kind &&
      draft.base === this.saved,
    );
    const diagram = this.recovered ? draft!.diagram : options.diagram;
    this.snapshot = {
      diagram,
      conflictingDraft:
        draft &&
        !this.recovered &&
        draft.diagram.kind === diagram.kind &&
        JSON.stringify(draft.diagram) !== this.saved
          ? draft.diagram
          : null,
      canUndo: false,
      canRedo: false,
      isSaved: JSON.stringify(diagram) === this.saved,
    };
    this.saves = new SaveScheduler((value) => {
      // Share immutable snapshots with history instead of retaining serialized
      // copies; bound unacknowledged sends when saving stays unavailable.
      this.submitted = [...this.submitted.slice(-49), value];
      options.save(value);
    });
  }

  get diagram(): Diagram {
    return this.snapshot.diagram;
  }

  getSnapshot = (): SessionView => this.snapshot;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /** Run after mount, so constructing a session never sends a save. */
  start() {
    if (this.started) return;
    this.started = true;
    if (this.recovered && !this.snapshot.isSaved)
      this.saves.queue(this.diagram, true);
    else if (!this.snapshot.conflictingDraft) this.forget();
  }

  acknowledge(diagram: Diagram) {
    const saved = JSON.stringify(diagram);
    if (saved === this.saved) return;
    const submittedIndex = this.submitted.findIndex(
      (value) => JSON.stringify(value) === saved,
    );
    this.saved = saved;
    if (JSON.stringify(this.diagram) === saved) this.forget();
    // Acknowledging an earlier submitted edit must rebase the newer draft.
    // Unrecognized saved versions retain the old ancestry for conflict review.
    else if (submittedIndex !== -1 && !this.snapshot.conflictingDraft)
      this.remember();
    if (submittedIndex !== -1)
      this.submitted = this.submitted.slice(submittedIndex + 1);
    this.publish();
  }

  commit(next: Diagram) {
    const previous = this.diagram;
    if (next === previous) return;
    const now = this.now();
    const structural =
      previous.strokes !== next.strokes ||
      previous.entities.length !== next.entities.length ||
      previous.relationships.length !== next.relationships.length ||
      previous.entities.some(
        (entity, index) =>
          entity.fields.length !== next.entities[index]?.fields.length ||
          entity.fields.some(
            (field, fieldIndex) =>
              field.id !== next.entities[index]?.fields[fieldIndex]?.id,
          ) ||
          entity.position !== next.entities[index]?.position,
      );
    if (now - this.lastEdit > 600 || structural || !this.past.length)
      this.past = [...this.past.slice(-49), previous];
    this.future = [];
    this.lastEdit = now;
    this.change(next);
    this.saves.queue(next, structural);
  }

  travel(direction: "past" | "future") {
    const stack = direction === "past" ? this.past : this.future;
    const next = stack.at(-1);
    if (!next) return;
    if (direction === "past") {
      this.past = stack.slice(0, -1);
      this.future = [...this.future, this.diagram];
    } else {
      this.past = [...this.past, this.diagram];
      this.future = stack.slice(0, -1);
    }
    this.lastEdit = 0;
    this.change(next);
    this.saves.queue(next, true);
  }

  importSql(
    command: SqlImport,
  ): (SqlImportResult & { firstEntityId?: string }) | null {
    if (this.lastImport === command.id) return null;
    this.lastImport = command.id;
    try {
      const before = this.diagram;
      const next = addSqlTables(before, command.tables);
      const count = next.entities.length - before.entities.length;
      this.commit(next);
      return {
        id: command.id,
        message: count
          ? `Added ${count} table${count === 1 ? "" : "s"} to the diagram.`
          : "All tables already exist; the diagram was unchanged.",
        firstEntityId: count
          ? next.entities[before.entities.length].id
          : undefined,
      };
    } catch (error) {
      return {
        id: command.id,
        error:
          error instanceof Error
            ? error.message
            : "Could not add the SQL tables.",
      };
    }
  }

  restoreDraft() {
    const draft = this.snapshot.conflictingDraft;
    if (!draft) return;
    this.past = [];
    this.future = [];
    this.lastEdit = 0;
    this.change(draft);
    this.saves.queue(draft, true);
  }

  discardDraft() {
    this.forget();
    this.snapshot = { ...this.snapshot, conflictingDraft: null };
    this.publish();
  }

  flush() {
    this.saves.flush();
  }

  private change(diagram: Diagram) {
    this.snapshot = { ...this.snapshot, diagram, conflictingDraft: null };
    this.remember();
    this.publish();
  }

  private publish() {
    this.snapshot = {
      ...this.snapshot,
      canUndo: this.past.length > 0,
      canRedo: this.future.length > 0,
      isSaved: JSON.stringify(this.diagram) === this.saved,
    };
    for (const listener of this.listeners) listener();
  }

  private remember() {
    try {
      this.storage?.setItem(
        this.key,
        JSON.stringify({ base: this.saved, diagram: this.diagram }),
      );
    } catch {
      /* Server saving remains available when browser storage is full. */
    }
  }

  private forget() {
    try {
      this.storage?.removeItem(this.key);
    } catch {
      /* Browser storage may be disabled. */
    }
  }

  private readDraft(): LocalDraft | null {
    try {
      const raw = this.storage?.getItem(this.key);
      if (!raw || raw.length > 2_000_000) return null;
      const value = JSON.parse(raw) as LocalDraft;
      return typeof value.base === "string" &&
        value.diagram?.version === 1 &&
        Array.isArray(value.diagram.entities) &&
        Array.isArray(value.diagram.relationships)
        ? value
        : null;
    } catch {
      return null;
    }
  }
}
