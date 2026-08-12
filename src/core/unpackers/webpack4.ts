export interface BundleModule {
  id: string;
  code: string;
  size: number;
  lines: number;
}

export function unpackWebpack4(code: string): BundleModule[] {
  const modules: BundleModule[] = [];
  const wp4Regex = /(?:^|[,{])\s*(?:['"]?([\w\/\.\-]+)['"]?)\s*:\s*function\s*\([\w\s,]*\)\s*\{/g;

  let match;
  while ((match = wp4Regex.exec(code)) !== null) {
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
      wp4Regex.lastIndex = i;
    }
  }

  return modules;
}
