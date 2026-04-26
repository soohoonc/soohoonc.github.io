import { serve } from "bun";
import { watch } from "fs";

const ROOT = import.meta.dir + "/..";
const PUBLIC = ROOT + "/public";
const CONTENT = ROOT + "/content";
const TEMPLATES = ROOT + "/templates";

const clients = new Set();
const encoder = new TextEncoder();

let reloadTimer;
let rebuildTimer;
let buildBusy = false;
let buildQueued = false;
let publicChangeQueued = false;

function notifyReload() {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    for (const client of clients) {
      client.enqueue(encoder.encode("data: reload\n\n"));
    }
  }, 50);
}

async function rebuild() {
  if (buildBusy) {
    buildQueued = true;
    return;
  }

  buildBusy = true;
  const proc = Bun.spawn(["bun", "run", "build"], { cwd: ROOT, stdout: "pipe", stderr: "pipe" });
  const status = await proc.exited;
  const stderr = await new Response(proc.stderr).text();
  const stdout = await new Response(proc.stdout).text();
  buildBusy = false;

  if (stdout) {
    console.log(stdout.trim());
  }
  if (status !== 0) {
    console.error(`build failed (${status})`);
    if (stderr) {
      console.error(stderr);
    }
  } else {
    notifyReload();
  }

  if (publicChangeQueued) {
    publicChangeQueued = false;
    notifyReload();
  }

  if (buildQueued) {
    buildQueued = false;
    rebuild();
  }
}

function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    rebuild();
  }, 80);
}

watch(PUBLIC, { recursive: true }, () => {
  if (buildBusy) {
    publicChangeQueued = true;
    return;
  }
  notifyReload();
});

watch(CONTENT, { recursive: true }, () => {
  scheduleRebuild();
});

watch(TEMPLATES, { recursive: true }, () => {
  scheduleRebuild();
});

void rebuild();

const RELOAD_SCRIPT = `<script>new EventSource('/~~reload').onmessage=()=>location.reload()</script>`;

const STATIC_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

const server = serve({
  port: 3000,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (pathname === "/~~reload") {
      let controller;
      const stream = new ReadableStream({
        start(c) { clients.add(controller = c); },
        cancel() { clients.delete(controller); },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    }

    for (const p of [pathname, pathname + "/index.html"]) {
      const file = Bun.file(PUBLIC + p);
      if (await file.exists()) {
        if (p.endsWith(".html")) {
          const html = await file.text();
          return new Response(html.replace("</body>", RELOAD_SCRIPT + "</body>"), {
            headers: {
              "Content-Type": "text/html",
              ...STATIC_HEADERS,
            },
          });
        }
        return new Response(file, { headers: STATIC_HEADERS });
      }
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(server.url.href);
