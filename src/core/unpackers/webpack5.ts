import { BundleModule } from './webpack4.js';

export function unpackWebpack5(code: string): BundleModule[] {
  const modules: BundleModule[] = [];
  
  // Webpack 5 module dictionary pattern with arrow functions or standard functions:
  // e.g. 90995: (e, t, r) => { ... } or "90995": (e) => { ... }
  const moduleRegex = /(?:['"]?(\d+|[\w\/\.\-]+)['"]?)\s*:\s*(?:\((?:[a-zA-Z0-9_,\s]*)\)|[a-zA-Z0-9_]+)\s*=>\s*\{([\s\S]*?)\n\s*\},?/g;
  
  let match;
  while ((match = moduleRegex.exec(code)) !== null) {
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
