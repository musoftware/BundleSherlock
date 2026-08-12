import { DetectionRule } from '../rules/types';
import { uiRules } from '../rules/ui.rules';
import { editorRules } from '../rules/editor.rules';
import { polyfillRules } from '../rules/polyfill.rules';
import { vendorRules } from '../rules/vendor.rules';
import { originalRules } from '../rules/original.rules';

export function getAllRules(): DetectionRule[] {
  return [
    ...uiRules,
    ...editorRules,
    ...polyfillRules,
    ...vendorRules
  ];
}

export function getOriginalRules(): DetectionRule[] {
  return originalRules;
}
