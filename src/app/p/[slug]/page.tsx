import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { remark } from 'remark';
import html from 'remark-html';

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

  const processedContent = await remark().use(html).process(fileContent);
  const contentHtml = processedContent.toString();

  return (
    <div>
      <h2>{slug}</h2>
      {contentHtml}
    </div>
  );
};

export default Page;
