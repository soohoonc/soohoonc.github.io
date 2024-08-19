import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { serialize } from 'next-mdx-remote/serialize';
import remarkHtml from 'remark-html';

import { MarkdownViewer } from '@/components/markdown-viewer'

// export const dynamicParams = false;

export function generateStaticParams() {
  const projectFiles = glob.sync('public/p/*.mdx');
  return projectFiles.map((file) => {
    const slug = path.basename(file, '.mdx');
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
  const filePath = path.join(process.cwd(), 'public', 'p', `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const mdxSource = await serialize(fileContent, {
    mdxOptions: {
      remarkPlugins: [remarkHtml],
      rehypePlugins: [],
    },
  })
  return (
    <MarkdownViewer source={mdxSource} />
  );
};

export default Page;
