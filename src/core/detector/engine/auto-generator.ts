import fs from 'node:fs';
import path from 'node:path';
import { DetectionRule } from '../rules/types';

/**
 * Auto-extracts unique identifier signatures from source code or NPM bundle file.
 * @param code - Raw source code string of library
 * @param topCount - Maximum number of top unique signatures to extract
 * @returns Array of unique identifier strings
 */
export function extractUniqueIdentifiers(code: string, topCount = 10): string[] {
  // Find identifiers, function names, component names, and unique properties
  const matches = code.match(/\b[A-Za-z_$][A-Za-z0-9_$]{5,}\b/g) || [];

  // Filter common JavaScript keywords
  const reserved = new Set([
    'function', 'return', 'undefined', 'typeof', 'instanceof', 'constructor',
    'prototype', 'toString', 'valueOf', 'arguments', 'default', 'export', 'import'
  ]);

  const frequencyMap = new Map<string, number>();

  for (const word of matches) {
    if (!reserved.has(word)) {
      frequencyMap.set(word, (frequencyMap.get(word) || 0) + 1);
    }
  }

  // Sort by frequency and length uniqueness
  const sorted = Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  return sorted.slice(0, topCount);
}

/**
 * Auto-generates a DetectionRule for an installed NPM package.
 * @param packageName - Package name e.g. '@mui/material' or 'prismjs'
 * @param nodeModulesDir - Path to node_modules directory
 */
export function autoGenerateRuleFromPackage(packageName: string, nodeModulesDir = 'node_modules'): DetectionRule | null {
  try {
    const pkgDir = path.join(nodeModulesDir, packageName);
    if (!fs.existsSync(pkgDir)) return null;

    const pkgJsonPath = path.join(pkgDir, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) return null;

    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    const mainFile = pkgJson.main || pkgJson.module || 'index.js';
    const mainPath = path.join(pkgDir, mainFile);

    if (!fs.existsSync(mainPath)) return null;

    const code = fs.readFileSync(mainPath, 'utf-8');
    const signatures = extractUniqueIdentifiers(code, 8);

    return {
      name: pkgJson.name || packageName,
      category: 'vendor',
      signatures,
      weight: 20
    };
  } catch (error) {
    return null;
  }
}
