import { serve } from "bun";

const PUBLIC = import.meta.dir + "/../public";

const server = serve({
  port: 3000,
  async fetch(req) {
    const { pathname } = new URL(req.url);
    for (const p of [pathname, pathname + "/index.html"]) {
      const file = Bun.file(PUBLIC + p);
      if (await file.exists()) return new Response(file);
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log(server.url.href);
