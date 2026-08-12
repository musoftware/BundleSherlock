import fs from 'node:fs';
import path from 'node:path';

export interface SourceMapData {
  version: number;
  sources: string[];
  sourcesContent?: string[];
  file?: string;
}

export interface RecoveredSourceFile {
  relativePath: string;
  code: string;
  size: number;
  lines: number;
}

export function extractInlineSourceMap(code: string): SourceMapData | null {
  // Check for inline base64 sourcemap comment: //# sourceMappingURL=data:application/json;charset=utf-8;base64,...
  const match = /\/\/#\s*sourceMappingURL=data:application\/json;(?:charset=utf-8;)?base64,([a-zA-Z0-9+/=]+)/i.exec(code);
  if (match && match[1]) {
    try {
      const decoded = Buffer.from(match[1], 'base64').toString('utf-8');
      return JSON.parse(decoded) as SourceMapData;
    } catch {
      return null;
    }
  }
  return null;
}

export function recoverSourcesFromSourceMap(sourceMap: SourceMapData): RecoveredSourceFile[] {
  const recovered: RecoveredSourceFile[] = [];

  if (!sourceMap.sources || !sourceMap.sourcesContent) {
    return recovered;
  }

  for (let i = 0; i < sourceMap.sources.length; i++) {
    const rawPath = sourceMap.sources[i];
    const sourceCode = sourceMap.sourcesContent[i];

    if (sourceCode && sourceCode.trim().length > 0) {
      // Clean webpack://, webpack:/// prefix
      let cleanPath = rawPath
        .replace(/^webpack:\/\/\/?/, '')
        .replace(/^\.\//, '');

      if (!cleanPath.startsWith('src/') && !cleanPath.startsWith('node_modules/')) {
        cleanPath = path.join('src', cleanPath);
      }

      recovered.push({
        relativePath: cleanPath,
        code: sourceCode,
        size: sourceCode.length,
        lines: sourceCode.split('\n').length
      });
    }
  }

  return recovered;
}
