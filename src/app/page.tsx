import { File } from '@/components/file';
import fs from 'fs';
import path from 'path';

const Page = () => {
  const filePath = path.join(process.cwd(), 'public/fs/index.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  return <File filePath={filePath} fileContent={fileContent} />;
};

export default Page;
