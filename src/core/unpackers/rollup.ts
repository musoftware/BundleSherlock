import { BundleModule } from './webpack4';

export function unpackRollup(code: string): BundleModule[] {
  const modules: BundleModule[] = [];
  
  // Rollup IIFE chunk pattern splitters
  const blocks = code.split(/(?=\(function\s*\(|\/\*@__PURE__\*\/\s*function|\(function\s*[\w\$]*\s*\()/);
  
  blocks.forEach((block, idx) => {
    const trimmed = block.trim();
    if (trimmed.length > 20) {
      modules.push({
        id: `rollup_mod_${idx}`,
        code: trimmed,
        size: trimmed.length,
        lines: trimmed.split('\n').length
      });
    }
  });

  return modules;
}
