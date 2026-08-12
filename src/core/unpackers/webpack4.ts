export interface BundleModule {
  id: string;
  code: string;
  size: number;
  lines: number;
}

export function unpackWebpack4(code: string): BundleModule[] {
  const modules: BundleModule[] = [];
  
  // Pattern 1: standard (window.webpackJsonp = window.webpackJsonp || []).push([[chunkId], { 123: function(e,t,r){...} }])
  // Pattern 2: object form module dictionary
  const wp4Regex = /(?:['"]?(\d+|[\w\/\.\-]+)['"]?)\s*:\s*function\s*\(([a-zA-Z0-9_,\s]*)\)\s*\{([\s\S]*?)\n\s*\},?/g;
  
  let match;
  while ((match = wp4Regex.exec(code)) !== null) {
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
