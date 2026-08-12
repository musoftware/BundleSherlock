import { BundleModule } from '../core/unpackers/webpack4';

export function isOriginalModule(module: BundleModule): boolean {
  const code = module.code;

  // Rule 1: Very large size with very few lines is minified third-party vendor library
  if (module.size > 30000 && module.lines < 30) {
    return false;
  }

  // Rule 2: Open-source license headers or explicit library version headers
  if (/MIT|@license|v\d+\.\d+\.\d+|Copyright\s+\(c\)|BSD-3-Clause|Apache-2\.0/i.test(code)) {
    return false;
  }

  // Rule 3: Third-Party Library Plugins & Syntax Highlighting definitions (Prism, Highlight.js, CodeMirror, Monaco)
  if (/(?:Prism|e)\.languages\.|hljs\.registerLanguage|languages\.extend|languages\.insertBefore|\.displayName\s*=\s*["'](?:naniscript|hpkp|hsts|editorconfig|properties|nand2tetris|t4Vb|phpExtras|tsx|erlang|flow|firestore|hlsl|http|idris|io|jexl|jq|n4js|peoplecode|vim|visualBasic|clike|markup|javascript|python|ruby|rust|c|cpp|java)["']/i.test(code)) {
    return false;
  }

  // Rule 4: Transpiler Helpers, Polyfills, & Core-JS Internals
  if (/_asyncToGenerator|_classCallCheck|_inherits|_createClass|_defineProperty|__extends|__assign|__rest|__decorate|core-js|regeneratorRuntime/i.test(code)) {
    return false;
  }

  // Rule 5: Framework Core Internals & Symbol Registrations
  if (/__SECRET_INTERNALS_DO_NOT_USE|ReactCurrentOwner|Symbol\.for\(["']react\.element["']\)|__v_isRef|__v_isVNode/i.test(code)) {
    return false;
  }

  // Rule 6: Strong Application Original Signals (Custom API endpoints, checkout logic, business state)
  if (/\/api\/|\/checkout\/|\/auth\/|\/user\/|\/v1\/|\/v2\/|fetch\(|axios|localStorage|sessionStorage|paystack|activeTransaction|checkoutModal|logAttempt|logAPIResponse/i.test(code)) {
    return true;
  }

  // Rule 7: Compact application module without vendor signatures
  return module.size < 12000;
}

export function filterOriginalModules(modules: BundleModule[]): BundleModule[] {
  return modules.filter(isOriginalModule);
}
