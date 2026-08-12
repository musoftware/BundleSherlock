import { BundleModule } from '../unpackers/webpack4';

export interface ModuleLinkInfo {
  id: string;
  relativePath: string;
  exportName?: string;
  imports: Array<{
    targetId: string;
    localName: string;
  }>;
}

export function linkModuleAST(module: BundleModule, moduleMap: Map<string, string>): string {
  let code = module.code;

  // 1. Convert Webpack __webpack_require__(id) or require(id) into ES Module import calls
  const importStatements: string[] = [];

  code = code.replace(/(?:__webpack_require__|require)\s*\(\s*["']?(\d+|[\w\/\.\-]+)["']?\s*\)/g, (match, targetId) => {
    const targetPath = moduleMap.get(String(targetId));
    if (targetPath) {
      const aliasName = `mod_${targetId}`;
      importStatements.push(`import * as ${aliasName} from '${targetPath}';`);
      return aliasName;
    }
    return match;
  });

  // 2. Convert module.exports or exports.default into ES export
  if (/module\.exports\s*=\s*/.test(code)) {
    code = code.replace(/module\.exports\s*=\s*/, 'export default ');
  } else if (/exports\.default\s*=\s*/.test(code)) {
    code = code.replace(/exports\.default\s*=\s*/, 'export default ');
  } else if (!/export\s+(default|const|function|class)/.test(code)) {
    // If no export statement exists, default export the main declared function/object
    const match = /function\s+([A-Za-z0-9_$]+)/.exec(code);
    if (match && match[1]) {
      code += `\n\nexport default ${match[1]};`;
    }
  }

  // Prepend deduplicated import statements
  const uniqueImports = Array.from(new Set(importStatements));
  if (uniqueImports.length > 0) {
    code = uniqueImports.join('\n') + '\n\n' + code;
  }

  return code;
}
