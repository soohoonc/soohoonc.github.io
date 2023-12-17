import init, { FileSystem as WASMFileSystem } from '@/wasm/pkg';

export async function createFileSystem() {
  await init();
  // https://github.com/rustwasm/wasm-bindgen/issues/166
  const fs = new WASMFileSystem();
  return fs;
}

export type FileSystem = WASMFileSystem;
