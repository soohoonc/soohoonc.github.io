import { serve } from "bun";
import { join } from "path";

const PUBLIC_DIR = "./public";

serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Default to index.html for root
    if (pathname === "/") {
      pathname = "/index.html";
    }

    // Construct file path
    const filePath = join(PUBLIC_DIR, pathname);
    const file = Bun.file(filePath);
    
    // Check if file exists
    const exists = await file.exists();
    if (!exists) {
      // Fallback to index.html for SPA routing
      const indexFile = Bun.file(join(PUBLIC_DIR, "index.html"));
      return new Response(indexFile, {
        headers: { "Content-Type": "text/html" }
      });
    }

    // Serve the file with appropriate content type
    const contentType = getContentType(pathname);
    return new Response(file, {
      headers: { "Content-Type": contentType }
    });
  },
  development: true,
});

function getContentType(pathname) {
  const ext = pathname.split('.').pop()?.toLowerCase();
  const types = {
    'html': 'text/html',
    'js': 'application/javascript', 
    'css': 'text/css',
    'stl': 'application/octet-stream',
    '3mf': 'application/octet-stream',
    'ico': 'image/x-icon',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'svg': 'image/svg+xml'
  };
  return types[ext] || 'application/octet-stream';
}

console.log("Server running at http://localhost:3000");