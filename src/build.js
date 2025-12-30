import { Glob } from "bun";
import { mkdir } from "fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { parse as parseYaml } from "yaml";

async function parseMarkdown(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const data = match ? parseYaml(match[1]) : {};
  let content = match ? match[2] : raw;

  // Remove <hide>...</hide> tags and their contents
  content = content.replace(/<hide>[\s\S]*?<\/hide>/g, '');

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml)
    .process(content);

  return { data, html: String(result) };
}

// Load templates
const postTemplate = await Bun.file("templates/post.html").text();
const blogTemplate = await Bun.file("templates/blog.html").text();

// Parse posts
const posts = [];
for await (const file of new Glob("content/*.md").scan()) {
  const raw = await Bun.file(file).text();
  const { data, html } = await parseMarkdown(raw);
  const slug = file.replace("content/", "").replace(".md", "");
  posts.push({ slug, title: data.title || slug, date: data.date || "", html });
}

posts.sort((a, b) => (b.date > a.date ? 1 : -1));

// Generate post pages
for (const post of posts) {
  await mkdir(`public/blog/${post.slug}`, { recursive: true });
  const html = postTemplate
    .replace(/\{\{title\}\}/g, post.title)
    .replace(/\{\{date\}\}/g, post.date)
    .replace(/\{\{content\}\}/g, post.html);
  await Bun.write(`public/blog/${post.slug}/index.html`, html);
}

// Generate blog index
const postsList = posts
  .map(p => `<p><a href="/blog/${p.slug}">${p.title}</a><br /><small>${p.date}</small></p>`)
  .join("\n    ");
const blogHtml = blogTemplate.replace(/\{\{posts\}\}/g, postsList);
await Bun.write("public/blog/index.html", blogHtml);

console.log(`Built ${posts.length} posts`);
