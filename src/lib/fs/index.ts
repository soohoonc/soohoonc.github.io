import init, { FileSystem as WASMFileSystem } from '@/wasm/pkg'

export async function createFileSystem() {
  await init()
  const fs = new WASMFileSystem()
  return fs;
}

export type FileSystem = WASMFileSystem;