import fs from 'node:fs';
import path from 'node:path';
import { BundleModule } from '../unpackers/webpack4';
import { isOriginalModule } from '../../extractors/original-code';
import { deobfuscateCode } from './deobfuscator';
import { classifyModuleStructure } from './classifier';
import { linkModuleAST } from '../ast/graph';
import { renameSemanticIdentifiers } from '../ast/renamer';

export interface ExtractionOptions {
  outputDir: string;
  onlyOriginal?: boolean;
}

export interface ManifestData {
  extractedAt: string;
  totalModules: number;
  originalModulesCount: number;
  modules: Array<{
    id: string;
    filePath: string;
    isOriginal: boolean;
    size: number;
    lines: number;
  }>;
}

export function cleanModuleCode(code: string): string {
  let cleaned = code.trim();

  // Deobfuscate boolean and void shorthand
  cleaned = deobfuscateCode(cleaned);

  // Rename minified identifiers with semantic names
  cleaned = renameSemanticIdentifiers(cleaned);

  // Remove trailing comma or semicolon
  if (cleaned.endsWith(',')) cleaned = cleaned.slice(0, -1);

  // Unindent standard module wrapper body if applicable
  const lines = cleaned.split('\n');
  if (lines.length > 2) {
    const indented = lines.map(line => line.replace(/^  /, ''));
    cleaned = indented.join('\n');
  }

  return cleaned;
}

export function inferFilePath(module: BundleModule, isOriginal: boolean): string {
  const classified = classifyModuleStructure(module, isOriginal);
  return classified.relativePath;
}

export function generateConnectedAppJsx(extractedModules: Array<{ filePath: string; id: string }>): string {
  const imports: string[] = [];
  const serviceCalls: string[] = [];

  extractedModules.forEach((mod, idx) => {
    const modName = `ExtractedModule_${idx + 1}`;
    const cleanRelPath = './' + mod.filePath.replace(/^src[\\\/]/, '').replace(/\\/g, '/');
    imports.push(`import * as ${modName} from '${cleanRelPath}';`);
    serviceCalls.push(`    try { console.log("Initializing ${cleanRelPath}:", ${modName}); } catch(e) {}`);
  });

  return `import React, { useEffect } from 'react';
${imports.join('\n')}

export function App() {
  useEffect(() => {
    console.log("🕵️ BundleSherlock Application Core Started");
${serviceCalls.join('\n')}
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
        <h1 style={{ color: '#646cff' }}>🕵️ BundleSherlock Reconstructed Application</h1>
        <p>Successfully unbundled, linked, and connected <strong>${extractedModules.length}</strong> original application modules.</p>
      </header>
      <main>
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', color: '#fff' }}>
          <h3 style={{ marginTop: 0 }}>📦 Connected Application Modules:</h3>
          <ul style={{ lineHeight: '1.8' }}>
            ${extractedModules.map(m => `<li><code>./src/${m.filePath.replace(/^src[\\\/]/, '').replace(/\\/g, '/')}</code></li>`).join('\n            ')}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
`;
}

export function extractAndSaveSourceCode(
  modules: BundleModule[],
  options: ExtractionOptions
): ManifestData {
  const targetDir = path.resolve(process.cwd(), options.outputDir);
  fs.mkdirSync(targetDir, { recursive: true });

  const manifest: ManifestData = {
    extractedAt: new Date().toISOString(),
    totalModules: modules.length,
    originalModulesCount: 0,
    modules: []
  };

  // Build module map for AST linking
  const moduleMap = new Map<string, string>();
  modules.forEach(mod => {
    const isOrig = isOriginalModule(mod);
    const relPath = inferFilePath(mod, isOrig);
    moduleMap.set(String(mod.id), './' + relPath);
  });

  const extractedAppModules: Array<{ filePath: string; id: string }> = [];

  modules.forEach(mod => {
    const isOrig = isOriginalModule(mod);
    if (isOrig) manifest.originalModulesCount++;

    if (options.onlyOriginal && !isOrig) {
      return;
    }

    const relativeFilePath = inferFilePath(mod, isOrig);
    const fullPath = path.join(targetDir, relativeFilePath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    let cleanedCode = cleanModuleCode(mod.code);

    // Apply AST dependency graph linking
    cleanedCode = linkModuleAST({ ...mod, code: cleanedCode }, moduleMap);

    // Add module metadata header comment
    const header = `/**\n * 🕵️ BundleSherlock Extracted & Linked Module\n * ID: ${mod.id}\n * Type: ${isOrig ? 'Original Application Code' : 'Third-Party Vendor'}\n */\n\n`;
    fs.writeFileSync(fullPath, header + cleanedCode, 'utf-8');

    manifest.modules.push({
      id: mod.id,
      filePath: relativeFilePath,
      isOriginal: isOrig,
      size: mod.size,
      lines: mod.lines
    });

    if (isOrig) {
      extractedAppModules.push({ filePath: relativeFilePath, id: String(mod.id) });
    }
  });

  // Overwrite src/App.jsx with connected app component if src directory exists
  const srcDir = path.join(targetDir, 'src');
  if (fs.existsSync(srcDir) && extractedAppModules.length > 0) {
    const connectedAppJsx = generateConnectedAppJsx(extractedAppModules);
    fs.writeFileSync(path.join(srcDir, 'App.jsx'), connectedAppJsx, 'utf-8');
  }

  // Write manifest.json
  const manifestPath = path.join(targetDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  return manifest;
}
