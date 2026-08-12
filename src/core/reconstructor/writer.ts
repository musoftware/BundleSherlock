import fs from 'node:fs';
import path from 'node:path';
import { BundleModule } from '../unpackers/webpack4';
import { isOriginalModule } from '../../extractors/original-code';
import { extractEndpoints } from '../../extractors/endpoints';
import { extractSecrets } from '../../extractors/secrets';

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

import { deobfuscateCode } from './deobfuscator';

export function cleanModuleCode(code: string): string {
  let cleaned = code.trim();

  // Deobfuscate boolean and void shorthand
  cleaned = deobfuscateCode(cleaned);

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

import { classifyModuleStructure } from './classifier';

export function inferFilePath(module: BundleModule, isOriginal: boolean): string {
  const classified = classifyModuleStructure(module, isOriginal);
  return classified.relativePath;
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

  modules.forEach(mod => {
    const isOrig = isOriginalModule(mod);
    if (isOrig) manifest.originalModulesCount++;

    if (options.onlyOriginal && !isOrig) {
      return;
    }

    const relativeFilePath = inferFilePath(mod, isOrig);
    const fullPath = path.join(targetDir, relativeFilePath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    const cleanedCode = cleanModuleCode(mod.code);

    // Add module metadata header comment
    const header = `/**\n * 🕵️ BundleSherlock Extracted Module\n * ID: ${mod.id}\n * Type: ${isOrig ? 'Original Application Code' : 'Third-Party Vendor'}\n */\n\n`;
    fs.writeFileSync(fullPath, header + cleanedCode, 'utf-8');

    manifest.modules.push({
      id: mod.id,
      filePath: relativeFilePath,
      isOriginal: isOrig,
      size: mod.size,
      lines: mod.lines
    });
  });

  // Write manifest.json
  const manifestPath = path.join(targetDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  return manifest;
}
