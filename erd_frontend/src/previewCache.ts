// Account for UTF-16 storage even on engines that compress ASCII strings.
export class PreviewCache {
  private entries = new Map<string, string>();
  private bytes = 0;
  private maxBytes: number;
  private maxEntries: number;

  constructor(maxBytes = 32 * 1024 * 1024, maxEntries = 24) {
    this.maxBytes = maxBytes;
    this.maxEntries = maxEntries;
  }

  get(key: string) {
    const value = this.entries.get(key);
    if (value !== undefined) {
      this.entries.delete(key);
      this.entries.set(key, value);
    }
    return value;
  }

  set(key: string, value: string) {
    const previous = this.entries.get(key);
    if (previous !== undefined) {
      this.bytes -= previous.length * 2;
      this.entries.delete(key);
    }
    const size = value.length * 2;
    // Oversized previews remain visible in component state without retaining
    // another copy after navigation. They can be rendered again on demand.
    if (size > this.maxBytes) return;
    while (
      this.entries.size &&
      (this.bytes + size > this.maxBytes ||
        this.entries.size >= this.maxEntries)
    ) {
      const oldest = this.entries.keys().next().value!;
      this.bytes -= this.entries.get(oldest)!.length * 2;
      this.entries.delete(oldest);
    }
    this.entries.set(key, value);
    this.bytes += size;
  }
}
