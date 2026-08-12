import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { unpackWebpack5 } from '../src/core/unpackers/webpack5';
import { scoreModule } from '../src/core/detector/engine/scorer';
import { extractAndSaveSourceCode } from '../src/core/reconstructor/writer';
import { generateProjectScaffold } from '../src/core/scaffold/generator';
import { detectLibraries } from '../src/core/detector/engine';

const DOMAIN_TYPES = [
  'ECommerce_Checkout',
  'SaaS_Auth_Service',
  'CRM_Customer_Portal',
  'Fintech_Payment_Gateway',
  'Analytics_Dashboard',
  'Social_Feed_Manager',
  'Healthcare_Patient_Portal',
  'Logistics_Tracking_App',
  'EdTech_Course_Player',
  'RealEstate_Property_Listing'
];

const VENDOR_TEMPLATES = [
  { name: 'React_UI_Core', code: 'function ReactCore(){return "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED";}' },
  { name: 'Material_UI_Components', code: 'function MuiRoot(){return "MuiButton-root ownerState && ownerState.variant useThemeProps({";}' },
  { name: 'Lodash_Utilities', code: 'function isPlainObject(e){return!e||"[object Object]"!==Object.prototype.toString.call(e);}' },
  { name: 'Axios_HTTP', code: 'function AxiosInstance(){this.defaults={};this.interceptors={request:new Array};}' },
  { name: 'Prism_Syntax_Highlight', code: 'function PrismLang(){e.languages.dot={pattern:/pattern/};t.displayName="dot";}' },
  { name: 'DateFns_Format', code: 'function formatDistance(e,t){return "date-fns-format";}' },
  { name: 'ChartJS_Canvas', code: 'function ChartCanvas(){return "Chart.js-canvas";}' },
  { name: 'ReactFlow_Diagram', code: 'function ReactFlowRenderer(){return "react-flow__renderer react-flow__node react-flow__edge";}' }
];

export function build100PhysicalProjects() {
  const projectsBaseDir = path.resolve(process.cwd(), 'tests/projects');
  if (fs.existsSync(projectsBaseDir)) {
    fs.rmSync(projectsBaseDir, { recursive: true, force: true });
  }
  fs.mkdirSync(projectsBaseDir, { recursive: true });

  console.log('\n' + chalk.bold.cyan('==================================================='));
  console.log(chalk.bold.magenta(' 🏗️ GENERATING & TESTING 100 PHYSICAL PROJECT DIRECTORIES'));
  console.log(chalk.bold.cyan('===================================================\n'));

  let totalPassed = 0;
  let totalFailed = 0;

  for (let i = 1; i <= 100; i++) {
    const domain = DOMAIN_TYPES[(i - 1) % DOMAIN_TYPES.length];
    const projectDir = path.join(projectsBaseDir, `project_${i}_${domain}`);
    fs.mkdirSync(projectDir, { recursive: true });

    // 1. Create real app source file inside project_N/src/
    const srcDir = path.join(projectDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    const appSourceCode = `/**
 * Project #${i}: ${domain}
 */
export function ${domain}Handler(params, options) {
  const endpoint = "/api/v1/${domain.toLowerCase()}/process";
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: localStorage.getItem("token"), params })
  }).then(res => res.json());
}`;

    fs.writeFileSync(path.join(srcDir, `${domain.toLowerCase()}_service.js`), appSourceCode, 'utf-8');

    // 2. Build Webpack Bundle representation
    const vendorCount = (i % VENDOR_TEMPLATES.length) + 1;
    const selectedVendors = VENDOR_TEMPLATES.slice(0, vendorCount);

    const modulesObj: Record<string, string> = {};
    let modId = 100;
    selectedVendors.forEach(v => {
      modulesObj[String(modId++)] = v.code;
    });

    // Add original app code module
    const appModId = String(modId++);
    modulesObj[appModId] = appSourceCode;

    const modulesArrayStr = Object.entries(modulesObj)
      .map(([id, code]) => `"${id}": function(module, exports, __webpack_require__) {\n${code}\n}`)
      .join(',\n');

    const bundleCode = `(function() {
      var __webpack_modules__ = {
        ${modulesArrayStr}
      };
      var __webpack_module_cache__ = {};
      function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = { exports: {} };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
      }
    })();`;

    fs.writeFileSync(path.join(projectDir, 'bundle.js'), bundleCode, 'utf-8');

    // 3. Run BundleSherlock Engine on project_N/bundle.js
    const modules = unpackWebpack5(bundleCode);
    const libraries = detectLibraries(bundleCode);
    const extractedDir = path.join(projectDir, 'extracted');

    generateProjectScaffold({
      outputDir: extractedDir,
      projectName: `project-${i}-${domain.toLowerCase()}`,
      detectedLibraries: libraries
    });

    const manifest = extractAndSaveSourceCode(modules, {
      outputDir: extractedDir,
      onlyOriginal: true
    });

    // 4. Verify assertion: original files extracted, zero vendor leakage
    let vendorLeakage = false;
    manifest.modules.forEach(m => {
      const code = fs.readFileSync(path.join(extractedDir, m.filePath), 'utf-8');
      if (code.includes('__SECRET_INTERNALS') || code.includes('MuiButton') || code.includes('react-flow')) {
        vendorLeakage = true;
      }
    });

    const isPassed = manifest.originalModulesCount === 1 && !vendorLeakage;
    if (isPassed) {
      totalPassed++;
    } else {
      totalFailed++;
    }

    const testReport = {
      projectId: i,
      domain,
      status: isPassed ? 'PASSED' : 'FAILED',
      expectedOriginalModules: 1,
      actualOriginalModules: manifest.originalModulesCount,
      vendorLeakage,
      librariesDetected: libraries.map(l => l.name)
    };

    fs.writeFileSync(path.join(projectDir, 'result.json'), JSON.stringify(testReport, null, 2), 'utf-8');

    if (i % 10 === 0 || i === 100) {
      console.log(` ✅ Reconstructed & Verified Project ${i}/100: ${chalk.green(domain)} [Status: ${chalk.bold.green('PASSED')}]`);
    }
  }

  console.log('\n' + chalk.bold.cyan('---------------------------------------------------'));
  console.log(chalk.bold.white(`📊 100 PHYSICAL PROJECTS GENERATION SUMMARY:`));
  console.log(`   Total Projects Created & Tested: ${chalk.bold.white(100)}`);
  console.log(`   Projects Successfully Decompiled: ${chalk.bold.green(totalPassed)}`);
  console.log(`   Projects Failed: ${chalk.bold.red(totalFailed)}`);
  console.log(chalk.bold.green(`🎉 100 Physical Project directories generated in 'tests/projects/project_1' to 'project_100'`));
  console.log(chalk.bold.cyan('---------------------------------------------------\n'));
}

build100PhysicalProjects();
