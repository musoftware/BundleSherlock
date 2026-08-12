import { BundleModule } from './webpack4';

export function unpackWebpack5(code: string): BundleModule[] {
  const modules: BundleModule[] = [];
  const moduleRegex = /(?:^|[,{])\s*(?:['"]?([\w\/\.\-]+)['"]?)\s*:\s*(?:(?:\((?:[\w\s,]*)\)|[\w]+)\s*=>|function\s*\([\w\s,]*\))\s*\{/g;

  let match;
  while ((match = moduleRegex.exec(code)) !== null) {
    const id = match[1];
    const startIdx = match.index + match[0].length - 1; // position of '{'
    let depth = 1;
    let i = startIdx + 1;
    let inString = false;
    let stringChar = '';

    while (i < code.length && depth > 0) {
      const char = code[i];
      if (inString) {
        if (char === stringChar && code[i - 1] !== '\\') {
          inString = false;
        }
      } else {
        if (char === '"' || char === "'" || char === '`') {
          inString = true;
          stringChar = char;
        } else if (char === '{') {
          depth++;
        } else if (char === '}') {
          depth--;
        }
      }
      i++;
    }

    if (depth === 0) {
      const moduleCode = code.slice(startIdx + 1, i - 1);
      modules.push({
        id,
        code: moduleCode,
        size: moduleCode.length,
        lines: moduleCode.split('\n').length
      });
      moduleRegex.lastIndex = i;
    }
  }

  return modules;
}
