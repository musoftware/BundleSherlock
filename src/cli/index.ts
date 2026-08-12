#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import fs from 'node:fs';
import path from 'node:path';

import { unpackWebpack4, unpackWebpack5, unpackVite, unpackRollup, BundleModule } from '../index';
import { detectLibraries } from '../index';
import { filterOriginalModules } from '../index';
import { extractEndpoints } from '../index';
import { extractSecrets } from '../index';

const program = new Command();

program
  .name('bundle-sherlock')
  .description('🕵️ Reverse engineering & inspection CLI for JavaScript bundles')
  .version('1.0.0')
  .argument('<file>', 'Path to JavaScript bundle file')
  .option('-j, --json', 'Output report in JSON format')
  .action((file: string, options: { json?: boolean }) => {
    const filePath = path.resolve(process.cwd(), file);

    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`❌ File not found: ${filePath}`));
      process.exit(1);
    }

    const code = fs.readFileSync(filePath, 'utf-8');

    // Step 1: Unpack modules
    let modules: BundleModule[] = unpackWebpack5(code);
    let bundleType = 'Webpack 5';

    if (modules.length === 0) {
      modules = unpackWebpack4(code);
      bundleType = 'Webpack 4';
    }
    if (modules.length === 0) {
      modules = unpackVite(code);
      bundleType = 'Vite ESM';
    }
    if (modules.length === 0) {
      modules = unpackRollup(code);
      bundleType = 'Rollup IIFE';
    }

    // Step 2: Filter original code
    const originalModules = filterOriginalModules(modules);
    const originalPercentage = modules.length > 0
      ? ((originalModules.length / modules.length) * 100).toFixed(1)
      : '0';

    // Step 3: Detect libraries
    const libraries = detectLibraries(code);

    // Step 4: Extract Endpoints & Secrets
    const endpoints = extractEndpoints(code);
    const secrets = extractSecrets(code);

    if (options.json) {
      const jsonReport = {
        file,
        bundleType,
        totalModules: modules.length,
        originalModulesCount: originalModules.length,
        originalPercentage: `${originalPercentage}%`,
        libraries,
        endpoints,
        secrets
      };
      console.log(JSON.stringify(jsonReport, null, 2));
      return;
    }

    // Output formatted report
    console.log('\n' + chalk.bold.cyan('==================================================='));
    console.log(chalk.bold.magenta(' 🕵️  BUNDLE SHERLOCK INSPECTION REPORT'));
    console.log(chalk.bold.cyan('===================================================\n'));

    console.log(`📁 File: ${chalk.yellow(file)}`);
    console.log(`📦 Detected Architecture: ${chalk.green(bundleType)}`);
    console.log(`🧩 Total Modules Found: ${chalk.bold.white(modules.length)}`);
    console.log(`✅ Original Application Code: ${chalk.bold.green(originalModules.length)} files (${chalk.bold.yellow(originalPercentage + '%')})\n`);

    // Library Table
    if (libraries.length > 0) {
      console.log(chalk.bold.blue('📦 Identified Libraries & Frameworks:'));
      const libTable = new Table({
        head: [chalk.white('Library'), chalk.white('Category'), chalk.white('Confidence'), chalk.white('Version')],
        colWidths: [20, 20, 15, 15]
      });

      libraries.forEach(lib => {
        const confColor = lib.confidence > 80 ? chalk.green : lib.confidence > 50 ? chalk.yellow : chalk.red;
        libTable.push([
          lib.name,
          lib.category,
          confColor(`${lib.confidence}%`),
          lib.version || 'Unknown'
        ]);
      });

      console.log(libTable.toString() + '\n');
    }

    // Endpoints Section
    console.log(chalk.bold.blue('🔗 Extracted Endpoints & URLs:'));
    console.log(`  Relative API Paths: ${chalk.cyan(endpoints.relative.length)} found`);
    if (endpoints.relative.length > 0) {
      endpoints.relative.slice(0, 10).forEach(ep => console.log(`   • ${chalk.gray(ep)}`));
      if (endpoints.relative.length > 10) console.log(`   ...and ${endpoints.relative.length - 10} more`);
    }

    console.log(`  Absolute URLs: ${chalk.cyan(endpoints.absolute.length)} found`);
    if (endpoints.absolute.length > 0) {
      endpoints.absolute.slice(0, 5).forEach(url => console.log(`   • ${chalk.gray(url)}`));
    }
    console.log('');

    // Secrets Section
    console.log(chalk.bold.blue('⚠️ Secret Scanner:'));
    if (secrets.length === 0) {
      console.log(`  ${chalk.green('✔ No sensitive API keys or credentials detected.')}\n`);
    } else {
      console.log(`  ${chalk.bold.red(`🚨 ${secrets.length} potential secret(s) found:`)}`);
      secrets.forEach(sec => {
        console.log(`   • ${chalk.red(sec.type)}: ${chalk.yellow(sec.key)}`);
      });
      console.log('');
    }

    console.log(chalk.bold.cyan('---------------------------------------------------'));
    console.log(chalk.gray('  Run with --json for raw data output.'));
    console.log(chalk.bold.cyan('---------------------------------------------------\n'));
  });

program.parse();
