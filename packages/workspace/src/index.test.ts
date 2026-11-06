import { MemoryWorkspace } from "./index.js";

async function rejects(work: () => Promise<unknown>): Promise<boolean> {
  try {
    await work();
  } catch {
    return false;
  }
  return true;
}

const workspace = new MemoryWorkspace(["/project"]);
const events: string[] = [];
const watcher = workspace.watch("/project/a.txt", (event) =>
  events.push(event.type),
);
await workspace.writeFile("/project/a.txt", new Uint8Array([1]));
await workspace.writeFile("/project/a.txt", new Uint8Array([2]));
if (events.join() !== "created,changed") throw new Error("watch events wrong");
if ((await workspace.readFile("/project/a.txt"))[0] !== 2)
  throw new Error("read mismatch");
watcher.dispose();

if (await rejects(() => workspace.readFile("/project/../etc/passwd")))
  throw new Error("traversal accepted");
if (await rejects(() => workspace.writeFile("/other/a.txt", new Uint8Array())))
  throw new Error("path outside roots accepted");
if (await rejects(() => workspace.readFile("/project/missing.txt")))
  throw new Error("missing file accepted");
