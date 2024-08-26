import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkHtml from 'remark-html';

export const dynamicParams = false;

export function generateStaticParams() {
  const projectFiles = glob.sync('public/p/*.md');
  return projectFiles.map((file) => {
    const slug = path.basename(file, '.md');
    return { slug };
  });
}

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: ProjectPageProps) => {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'public', 'p', `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const content = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(fileContent);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: String(content) }} />
  );
};

export default Page;
