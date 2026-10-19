/** Coalesce text edits while letting structural edits and navigation save now. */
export class SaveScheduler<T> {
  private pending: T | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly save: (value: T) => void;
  private readonly delay: number;

  constructor(save: (value: T) => void, delay = 500) {
    this.save = save;
    this.delay = delay;
  }

  queue(value: T, immediate = false) {
    this.pending = value;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    if (immediate) this.flush();
    else this.timer = setTimeout(() => this.flush(), this.delay);
  }

  flush() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    const value = this.pending;
    this.pending = null;
    if (value !== null) this.save(value);
  }
}
