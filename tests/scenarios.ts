export interface TestScenario {
  id: number;
  name: string;
  bundleCode: string;
  expectedOriginalModuleCount: number;
  expectedVendorModuleCount: number;
}

const VENDOR_SNIPPETS = {
  react: `function ReactElement(){return "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED"}`,
  mui: `function MuiButton(){return "MuiButton-root ownerState && ownerState.variant useThemeProps({"}`,
  lodash: `function isPlainObject(e){return!e||"[object Object]"!==Object.prototype.toString.call(e)}`,
  axios: `function Axios(e){this.defaults=e;this.interceptors={request:new e,response:new e}}`,
  prism: `function Prism(){e.languages.dot={pattern:/pattern/};t.displayName="dot"}`,
  datefns: `function formatDistance(e,t){return "date-fns-format"}`,
  chartjs: `function Chart(e,t){return "Chart.js-canvas"}`,
  reactflow: `function ReactFlow(){return "react-flow__renderer react-flow__node react-flow__edge"}`
};

const APP_SNIPPETS = {
  authService: `function AuthService(){return fetch("/api/v1/auth/login").then(r=>r.json()).then(d=>localStorage.setItem("token",d.token))}`,
  userService: `function UserService(){return axios.get("/api/v1/users/profile").then(r=>r.data)}`,
  cartService: `function CartService(){return fetch("/api/v1/checkout/pay").then(r=>useCart())}`,
  dashboardController: `function DashboardController(){return createBrowserRouter(["/dashboard/stats"])}`
};

export function generate100TestScenarios(): TestScenario[] {
  const scenarios: TestScenario[] = [];

  const vendorKeys = Object.keys(VENDOR_SNIPPETS) as Array<keyof typeof VENDOR_SNIPPETS>;
  const appKeys = Object.keys(APP_SNIPPETS) as Array<keyof typeof APP_SNIPPETS>;

  for (let i = 1; i <= 100; i++) {
    // Pick 1 to 4 vendor libraries for this scenario
    const selectedVendors = vendorKeys.slice(0, (i % vendorKeys.length) + 1);
    
    // Pick 1 to 2 app modules for this scenario
    const selectedApps = appKeys.slice(0, (i % appKeys.length) + 1);

    const modulesObj: Record<string, string> = {};

    let modId = 100;
    selectedVendors.forEach(vk => {
      modulesObj[String(modId++)] = VENDOR_SNIPPETS[vk];
    });

    selectedApps.forEach(ak => {
      modulesObj[String(modId++)] = APP_SNIPPETS[ak];
    });

    // Format as Webpack 5 IIFE bundle
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

    scenarios.push({
      id: i,
      name: `Bundle Test Scenario #${i} [${selectedVendors.join('+')} vs ${selectedApps.join('+')}]`,
      bundleCode,
      expectedOriginalModuleCount: selectedApps.length,
      expectedVendorModuleCount: selectedVendors.length
    });
  }

  return scenarios;
}
