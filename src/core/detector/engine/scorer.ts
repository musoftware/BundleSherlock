import { BundleModule } from '../../unpackers/webpack4';
import { DetectionResult } from '../rules/types';
import { getAllRules, getAppRules } from './loader';

export function scoreModule(module: BundleModule): DetectionResult {
  const code = module.code;
  let vendorScore = 0;
  let originalScore = 0;
  const matchedRules: string[] = [];

  // 1. License & Header Check
  if (/MIT|@license|v\d+\.\d+\.\d+|Copyright\s+\(c\)|BSD-3-Clause|Apache-2\.0/i.test(code)) {
    vendorScore += 50;
    matchedRules.push('License Header');
  }

  // 2. Size vs Line ratio check (Massive minified single-liner)
  if (module.size > 25000 && module.lines < 30) {
    vendorScore += 40;
    matchedRules.push('Minified Library Chunk');
  }

  // 3. Match against Vendor, UI, Editor, & Polyfill rules
  const vendorRulesList = getAllRules();
  for (const rule of vendorRulesList) {
    // Check for penalty exception override
    if (rule.penaltyIf) {
      const hasPenalty = rule.penaltyIf.some(p => code.includes(p));
      if (hasPenalty) continue;
    }

    let matchCount = 0;
    for (const signature of rule.signatures) {
      if (code.includes(signature)) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      vendorScore += matchCount * rule.weight;
      matchedRules.push(`${rule.name} (${matchCount} hits)`);
    }
  }

  // 4. Match against Application Positive Rules
  const appRulesList = getAppRules();
  for (const rule of appRulesList) {
    let matchCount = 0;
    for (const signature of rule.signatures) {
      if (code.includes(signature)) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      originalScore += matchCount * rule.weight;
      matchedRules.push(`[App] ${rule.name} (${matchCount} hits)`);
    }
  }

  // Check for JSX tag elements <ComponentName ... />
  if (/<[A-Z]\w+[^>]*\/>/m.test(code)) {
    originalScore += 25;
    matchedRules.push('[App] Custom JSX Component');
  }

  // 5. Short generic minified function penalty without application domain signals
  if (module.size < 2500 && originalScore === 0) {
    vendorScore += 30;
    matchedRules.push('Minified One-Liner Utility');
  }

  // 6. Decision & Confidence Calculation
  const totalScore = vendorScore + originalScore;
  let isOriginal = false;
  let type: 'ORIGINAL' | 'VENDOR' | 'UNKNOWN' = 'UNKNOWN';
  let confidence = 50;

  if (vendorScore > originalScore + 15) {
    type = 'VENDOR';
    isOriginal = false;
    confidence = Math.min(99, Math.round(50 + (vendorScore / (totalScore || 1)) * 50));
  } else if (originalScore > vendorScore) {
    type = 'ORIGINAL';
    isOriginal = true;
    confidence = Math.min(99, Math.round(50 + (originalScore / (totalScore || 1)) * 50));
  } else if (module.size < 12000 && vendorScore === 0) {
    type = 'ORIGINAL';
    isOriginal = true;
    confidence = 70;
  } else {
    type = 'VENDOR';
    isOriginal = false;
    confidence = 60;
  }

  return {
    isOriginal,
    type,
    confidence,
    vendorScore,
    originalScore,
    matchedRules
  };
}
