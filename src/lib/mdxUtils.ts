import fs from 'fs-extra';
import path from 'path';
// import glob from 'glob';
import * as glob from 'glob';


const PAGES_PATH = path.join(process.cwd(), 'public/pages');

export function getPages() {
  const files = glob.sync(`${PAGES_PATH}/**/*.mdx`, { cwd: PAGES_PATH });
  return files.map((file) => ({
    filepath: file,
    slug: file.replace(/\.mdx$/, '')
  }));
}


export async function getPage(filepath: string) {
  const fullPath = path.join(PAGES_PATH, filepath);
  const content = await fs.readFile(fullPath, 'utf8');
  return content;
}