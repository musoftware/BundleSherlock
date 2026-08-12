import { DetectionRule } from './types';

export const polyfillRules: DetectionRule[] = [
  {
    name: 'Babel / ES Transpiler Helpers',
    category: 'polyfill',
    signatures: [
      '_asyncToGenerator',
      '_classCallCheck',
      '_inherits',
      '_createClass',
      '_defineProperty',
      '__extends',
      '__assign',
      '__rest',
      '__decorate'
    ],
    weight: 15
  },
  {
    name: 'Core-JS & Regenerator Runtime',
    category: 'polyfill',
    signatures: ['core-js', 'regeneratorRuntime', 'defineProperties', 'getOwnPropertyDescriptor'],
    weight: 20
  },
  {
    name: 'React Core Internals',
    category: 'polyfill',
    signatures: [
      '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
      'ReactCurrentOwner',
      'Symbol.for("react.element")',
      '__v_isRef',
      '__v_isVNode'
    ],
    weight: 25
  },
  {
    name: 'Webpack Runtime Boilerplate',
    category: 'polyfill',
    signatures: ['__webpack_require__', '__webpack_exports__', 'webpackChunk'],
    weight: 10
  }
];
