import { BundleModule } from '../core/unpackers/webpack4';
import { scoreModule } from '../core/detector/engine/scorer';
import { DetectionResult } from '../core/detector/rules/types';

export function isOriginalModule(module: BundleModule): boolean {
  const result = scoreModule(module);
  return result.isOriginal;
}

export function inspectModule(module: BundleModule): DetectionResult {
  return scoreModule(module);
}

export function filterOriginalModules(modules: BundleModule[]): BundleModule[] {
  return modules.filter(isOriginalModule);
}
