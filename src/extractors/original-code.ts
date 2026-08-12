import { BundleModule } from '../core/unpackers/webpack4.js';

export function isOriginalModule(module: BundleModule): boolean {
  // Rule 1: Very large size with very few lines is minified third-party vendor library
  if (module.size > 40000 && module.lines < 30) {
    return false;
  }

  // Rule 2: Presence of open-source license headers or explicit library version headers
  if (/MIT|@license|v\d+\.\d+\.\d+|Copyright\s+\(c\)/i.test(module.code)) {
    return false;
  }

  // Rule 3: Application original signals (API endpoints, state calls, local storage, custom app logic)
  if (/\/api\/|fetch\(|axios|localStorage|sessionStorage|router\.push|state\./i.test(module.code)) {
    return true;
  }

  // Rule 4: Compact module under 15KB is likely application code
  return module.size < 15000;
}

export function filterOriginalModules(modules: BundleModule[]): BundleModule[] {
  return modules.filter(isOriginalModule);
}
