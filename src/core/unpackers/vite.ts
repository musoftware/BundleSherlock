import { BundleModule } from './webpack4';

export function unpackVite(code: string): BundleModule[] {
  const modules: BundleModule[] = [];
  
  // Vite ES Module chunks / dynamically imported module blocks
  const esmBlockRegex = /(?:export\s+\{(?:[\s\S]*?)\}|import\s+(?:[\s\S]*?)\s+from\s+["'].*?["']);?/g;
  
  const blocks = code.split(/(?=import\s+|export\s+)/);
  blocks.forEach((block, idx) => {
    const trimmed = block.trim();
    if (trimmed.length > 0) {
      modules.push({
        id: `vite_chunk_${idx}`,
        code: trimmed,
        size: trimmed.length,
        lines: trimmed.split('\n').length
      });
    }
  });

  return modules;
}
