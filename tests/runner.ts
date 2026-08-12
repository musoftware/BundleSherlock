import chalk from 'chalk';
import { generate100TestScenarios } from './scenarios';
import { unpackWebpack5 } from '../src/core/unpackers/webpack5';
import { scoreModule } from '../src/core/detector/engine/scorer';

export function run100BundleTestSuite() {
  console.log('\n' + chalk.bold.cyan('==================================================='));
  console.log(chalk.bold.magenta(' 🧪 BUNDLE SHERLOCK - 100 AUTOMATED BUNDLE TESTS'));
  console.log(chalk.bold.cyan('===================================================\n'));

  const scenarios = generate100TestScenarios();
  let passedCount = 0;
  let failedCount = 0;

  scenarios.forEach(scenario => {
    const modules = unpackWebpack5(scenario.bundleCode);

    let detectedOriginalCount = 0;
    let detectedVendorCount = 0;
    let leakedVendorCount = 0;

    modules.forEach(mod => {
      const scoreRes = scoreModule(mod);
      if (scoreRes.isOriginal) {
        // Check if a vendor module leaked into original
        if (mod.code.includes('__SECRET_INTERNALS') || mod.code.includes('MuiButton') || mod.code.includes('languages.') || mod.code.includes('react-flow')) {
          leakedVendorCount++;
        } else {
          detectedOriginalCount++;
        }
      } else {
        detectedVendorCount++;
      }
    });

    const isSuccess = 
      detectedOriginalCount === scenario.expectedOriginalModuleCount &&
      detectedVendorCount === scenario.expectedVendorModuleCount &&
      leakedVendorCount === 0;

    if (isSuccess) {
      passedCount++;
      console.log(`${chalk.green('✔ PASS')} [Test #${scenario.id}] ${scenario.name} - ${chalk.gray(`(App: ${detectedOriginalCount}, Vendor: ${detectedVendorCount}, Leakage: 0)`)}`);
    } else {
      failedCount++;
      console.log(`${chalk.red('✖ FAIL')} [Test #${scenario.id}] ${scenario.name} - Expected (App: ${scenario.expectedOriginalModuleCount}, Vendor: ${scenario.expectedVendorModuleCount}), Got (App: ${detectedOriginalCount}, Vendor: ${detectedVendorCount}, Leakage: ${leakedVendorCount})`);
    }
  });

  console.log('\n' + chalk.bold.cyan('---------------------------------------------------'));
  console.log(chalk.bold.white(`📊 FINAL TEST SUITE RESULTS:`));
  console.log(`   Total Scenarios Tested: ${chalk.bold.white(scenarios.length)}`);
  console.log(`   Passed: ${chalk.bold.green(passedCount)}`);
  console.log(`   Failed: ${chalk.bold.red(failedCount)}`);

  const passRate = ((passedCount / scenarios.length) * 100).toFixed(1);
  if (failedCount === 0) {
    console.log(chalk.bold.green(`🎉 100% PERFECT SCORE! All 100 real-world bundle tests passed with ZERO vendor leakage.`));
  } else {
    console.log(chalk.bold.yellow(`⚠️ Pass Rate: ${passRate}%`));
  }
  console.log(chalk.bold.cyan('---------------------------------------------------\n'));

  if (failedCount > 0) {
    process.exit(1);
  }
}

run100BundleTestSuite();
