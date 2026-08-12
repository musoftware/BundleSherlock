import { BundleModule } from './webpack4';

export function unpackBrowserify(code: string): BundleModule[] {
  const modules: BundleModule[] = [];

  // Browserify bundle module pattern: 1:[function(require,module,exports){ ... }, { "dep": 2 }]
  const browserifyRegex = /(?:['"]?(\d+|[\w\/\.\-]+)['"]?)\s*:\s*\[\s*function\s*\(([a-zA-Z0-9_,\s]*)\)\s*\{([\s\S]*?)\n\s*\}\s*,\s*(\{[\s\S]*?\})\s*\]/g;

  let match;
  while ((match = browserifyRegex.exec(code)) !== null) {
    const id = match[1];
    const moduleCode = match[3];
    modules.push({
      id,
      code: moduleCode,
      size: moduleCode.length,
      lines: moduleCode.split('\n').length
    });
  }

  return modules;
}
