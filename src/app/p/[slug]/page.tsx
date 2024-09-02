import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// import { MarkdownViewer } from '@/components/markdown-viewer';

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
  return (
    <div>
      {fileContent}
      {/* <MarkdownViewer content={fileContent} /> */}
    </div>
  );
};

export default Page;
