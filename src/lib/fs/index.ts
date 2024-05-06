import init, { Shell as WASMShell } from '@/wasm/pkg';

export async function getShell() {
  await init();
  // https://github.com/rustwasm/wasm-bindgen/issues/166
  const shell = new WASMShell();
  return shell
}

export type Shell = WASMShell;
