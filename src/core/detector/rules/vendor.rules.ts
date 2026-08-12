import { DetectionRule } from './types';

export const vendorRules: DetectionRule[] = [
  {
    name: 'React Core',
    category: 'vendor_framework',
    signatures: [
      '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
      'ReactCurrentOwner',
      /Symbol\.for\(["']react\.element["']\)/,
      'useStateImpl'
    ],
    weight: 50,
    antiSignatures: ['/api/']
  },
  {
    name: 'Vue.js Core',
    category: 'vendor_framework',
    signatures: [
      '__VUE_DEVTOOLS_GLOBAL_HOOK__',
      '__v_isRef',
      '__v_isVNode'
    ],
    weight: 50
  },
  {
    name: 'Angular Core',
    category: 'vendor_framework',
    signatures: [
      'ɵɵdefineComponent',
      'ɵɵelementStart',
      'ng-version="'
    ],
    weight: 50
  },
  {
    name: 'Lodash Utility',
    category: 'vendor_framework',
    signatures: [
      'lodash__WEBPACK_IMPORTED_MODULE',
      '__lodash__',
      /function\s+isPlainObject\(e\)\{\s*return\s*!.*isObjectLike/
    ],
    weight: 35
  }
];
