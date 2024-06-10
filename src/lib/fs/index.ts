import init, { Shell as WASMShell } from '@/wasm/pkg';
import { fs } from './fs';

async function create(
  shell: WASMShell,
  fs: { [key: string]: { type: string; children?: any; content?: any }},
  currentPath = ''
) {
  for (const [name, value] of Object.entries(fs)) {
    const fullPath = `${currentPath}/${name}`;
    if (value.type === 'directory') {
      shell.run(`mkdir ${fullPath}`);
      if (value.children) {
        await create(shell, value.children, fullPath);
      }
    } else if (value.type === 'file') {
      console.log(`touch ${fullPath}`)
      shell.run(`touch ${fullPath}`);
      if (value.content) {
        shell.run(`write ${fullPath} '${JSON.stringify(value.content)}'`);
      }
    }
  }
}

export async function getShell() {
  await init();
  // https://github.com/rustwasm/wasm-bindgen/issues/166
  const shell = new WASMShell('guest', 'soohoonchoi.com');
  await create(shell, fs);
  return shell;
}

export type Shell = WASMShell;
