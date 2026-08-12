import { BundleModule } from './webpack4';

export function unpackEsbuild(code: string): BundleModule[] {
  const modules: BundleModule[] = [];

  // Esbuild module declaration pattern: var init_xyz = __esm({ ... }) or var require_xyz = __commonJS({ ... })
  const esbuildRegex = /(?:var|let|const)\s+([a-zA-Z0-9_$]+)\s*=\s*__(?:commonJS|esm)\s*\(\s*\{?\s*(?:["']?.*?:|\(\))?\s*\{([\s\S]*?)\n\s*\}\s*\}?\s*\)/g;

  let match;
  while ((match = esbuildRegex.exec(code)) !== null) {
    const id = match[1];
    const moduleCode = match[2];
    modules.push({
      id,
      code: moduleCode,
      size: moduleCode.length,
      lines: moduleCode.split('\n').length
    });
  }

  return modules;
}
