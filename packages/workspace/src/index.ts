export interface Workspace {
  readonly roots: readonly string[];
  readFile(uri: string): Promise<Uint8Array>;
  writeFile(uri: string, data: Uint8Array): Promise<void>;
  watch?(uri: string, listener: (event: WorkspaceEvent) => void): Disposable;
}
export interface WorkspaceEvent {
  uri: string;
  type: "created" | "changed" | "deleted";
}
export interface Disposable {
  dispose(): void;
}

export class MemoryWorkspace implements Workspace {
  private readonly files = new Map<string, Uint8Array>();
  private readonly watchers = new Map<
    string,
    Set<(event: WorkspaceEvent) => void>
  >();
  constructor(public readonly roots: readonly string[] = ["/"]) {}

  /** Rejeita caminhos com `..` ou fora das raízes do workspace. */
  private check(uri: string): string {
    if (uri.split(/[\/]/).includes(".."))
      throw new Error(`path escapes workspace: ${uri}`);
    const inside = this.roots.some((root) => {
      const base = root.endsWith("/") ? root : `${root}/`;
      return uri === root || uri.startsWith(base);
    });
    if (!inside) throw new Error(`path outside workspace roots: ${uri}`);
    return uri;
  }

  async readFile(uri: string): Promise<Uint8Array> {
    this.check(uri);
    const value = this.files.get(uri);
    if (!value) throw new Error(`file not found: ${uri}`);
    return value.slice();
  }
  async writeFile(uri: string, data: Uint8Array): Promise<void> {
    this.check(uri);
    const type = this.files.has(uri) ? "changed" : "created";
    this.files.set(uri, data.slice());
    this.watchers.get(uri)?.forEach((listener) => listener({ uri, type }));
  }
  watch(uri: string, listener: (event: WorkspaceEvent) => void): Disposable {
    this.check(uri);
    const listeners = this.watchers.get(uri) ?? new Set();
    listeners.add(listener);
    this.watchers.set(uri, listeners);
    return {
      dispose: () => {
        listeners.delete(listener);
        if (!listeners.size) this.watchers.delete(uri);
      },
    };
  }
}
