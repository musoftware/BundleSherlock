import { BundleModule } from '../../unpackers/webpack4';
import { DetectionResult } from '../rules/types';
import { getAllRules, getOriginalRules } from './loader';

export function scoreModule(module: BundleModule): DetectionResult {
  const code = module.code;
  let vendorScore = 0;
  let originalScore = 0;
  const matchedRules: string[] = [];

  // 1. License Header Check (+50 Vendor)
  if (/MIT|@license|v\d+\.\d+\.\d+|Copyright\s+\(c\)|BSD-3-Clause|Apache-2\.0/i.test(code)) {
    vendorScore += 50;
    matchedRules.push('License Header (+50)');
  }

  // 2. Large Minified Library Chunk Check (+40 Vendor)
  if (module.size > 25000 && module.lines < 30) {
    vendorScore += 40;
    matchedRules.push('Minified Library Chunk (+40)');
  }

  // 2b. Massive Combined Library Bundle Check (>200KB without explicit app endpoints) (+80 Vendor)
  if (module.size > 200000) {
    vendorScore += 80;
    matchedRules.push('Massive Library Bundle (+80)');
  }

  // 3. Match Vendor Rules
  const vendorRulesList = getAllRules();
  for (const rule of vendorRulesList) {
    // Check anti-signatures: if present in code, skip vendor rule penalization
    if (rule.antiSignatures) {
      const hasAnti = rule.antiSignatures.some(anti => code.includes(anti));
      if (hasAnti) continue;
    }

    let matchCount = 0;
    for (const signature of rule.signatures) {
      if (typeof signature === 'string') {
        if (code.includes(signature)) matchCount++;
      } else if (signature instanceof RegExp) {
        if (signature.test(code)) matchCount++;
      }
    }

    if (matchCount > 0) {
      const addedScore = matchCount * rule.weight;
      vendorScore += addedScore;
      matchedRules.push(`${rule.name} (+${addedScore})`);
    }
  }

  // 4. Match Original Application Rules (Negative Weights e.g. -50, -80, -100)
  const appRulesList = getOriginalRules();
  for (const rule of appRulesList) {
    let matchCount = 0;
    for (const signature of rule.signatures) {
      if (typeof signature === 'string') {
        if (code.includes(signature)) matchCount++;
      } else if (signature instanceof RegExp) {
        if (signature.test(code)) matchCount++;
      }
    }

    if (matchCount > 0) {
      const addedScore = matchCount * Math.abs(rule.weight);
      originalScore += addedScore;
      matchedRules.push(`[App] ${rule.name} (-${addedScore})`);
    }
  }

  // 5. Compute Net Total Score (Vendor Score - Original Score)
  const netScore = vendorScore - originalScore;
  let isOriginal = false;
  let type: 'ORIGINAL' | 'VENDOR' | 'UNKNOWN' = 'UNKNOWN';
  let confidence = 50;

  if (originalScore >= 30 && netScore <= 0) {
    type = 'ORIGINAL';
    isOriginal = true;
    confidence = Math.min(99, Math.round(75 + (originalScore / (vendorScore + originalScore + 1)) * 24));
  } else if (vendorScore > 15 || netScore > 0) {
    type = 'VENDOR';
    isOriginal = false;
    confidence = Math.min(99, Math.round(75 + (vendorScore / (vendorScore + originalScore + 1)) * 24));
  } else if (/\.displayName\s*=|e\.exports\s*=|t\.exports\s*=|languages\./i.test(code)) {
    // Unmatched minified syntax plugin or module wrapper
    type = 'VENDOR';
    isOriginal = false;
    confidence = 80;
    matchedRules.push('Minified Module Export Wrapper (+20)');
  } else if (module.size < 8000 && originalScore > 0) {
    type = 'ORIGINAL';
    isOriginal = true;
    confidence = 70;
  } else {
    type = 'VENDOR';
    isOriginal = false;
    confidence = 65;
  }

  return {
    isOriginal,
    type,
    confidence,
    totalScore: netScore,
    vendorScore,
    originalScore,
    matchedRules
  };
}
