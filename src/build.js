import { Glob } from "bun";
import { mkdir } from "fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
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
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(content);

  let html = String(result);

  return { data, html };
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
  // Generate description from content (strip HTML, limit to 155 chars for SEO)
  const description = html.replace(/<[^>]*>/g, "").slice(0, 155).trim();
  posts.push({ slug, title: data.title || slug, date: data.date || "", html, description });
}

posts.sort((a, b) => (b.date > a.date ? 1 : -1));

// Generate post pages
for (const post of posts) {
  await mkdir(`public/blog/${post.slug}`, { recursive: true });
  const html = postTemplate
    .replace(/\{\{title\}\}/g, post.title)
    .replace(/\{\{date\}\}/g, post.date)
    .replace(/\{\{description\}\}/g, post.description)
    .replace(/\{\{content\}\}/g, post.html);
  await Bun.write(`public/blog/${post.slug}/index.html`, html);
}

// Generate blog index
const postsList = posts
  .map(p => `<p><a href="/blog/${p.slug}">${p.title}</a></p>`)
  .join("\n    ");
const blogHtml = blogTemplate.replace(/\{\{posts\}\}/g, postsList);
await Bun.write("public/blog/index.html", blogHtml);

// Generate RSS feed
const siteUrl = "https://soohoonchoi.com";
const rssItems = posts.map(p => {
  const pubDate = p.date ? new Date(p.date).toUTCString() : "";
  // Strip HTML tags for description and limit length
  const description = p.html.replace(/<[^>]*>/g, "").slice(0, 500);
  return `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <guid>${siteUrl}/blog/${p.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}...]]></description>
    </item>`;
}).join("\n");

const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>soohoonchoi blog</title>
    <link>${siteUrl}/blog</link>
    <description>Blog posts by Soohoon Choi</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

await Bun.write("public/feed.xml", rssFeed);

console.log(`Built ${posts.length} posts`);
