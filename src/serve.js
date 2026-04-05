import { serve } from "bun";
import { watch } from "fs";

const PUBLIC = import.meta.dir + "/../public";

const clients = new Set();

let reloadTimer;
watch(PUBLIC, { recursive: true }, () => {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    for (const client of clients) {
      client.enqueue(new TextEncoder().encode("data: reload\n\n"));
    }
  }, 50);
});

const RELOAD_SCRIPT = `<script>new EventSource('/~~reload').onmessage=()=>location.reload()</script>`;

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
            headers: { "Content-Type": "text/html" },
          });
        }
        return new Response(file);
      }
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(server.url.href);
