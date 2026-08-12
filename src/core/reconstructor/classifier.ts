import { BundleModule } from '../unpackers/webpack4';

export interface ClassifiedModulePath {
  category: 'components' | 'hooks' | 'services' | 'store' | 'pages' | 'utils' | 'config' | 'types' | 'vendor';
  suggestedName: string;
  relativePath: string;
}

export function inferModuleName(module: BundleModule): string | null {
  const code = module.code;

  // 1. Explicit displayName assignment: e.g. `t.displayName = "peoplecode"`
  const displayNameMatch = /\.displayName\s*=\s*["']([^"']+)["']/i.exec(code);
  if (displayNameMatch && displayNameMatch[1]) {
    return displayNameMatch[1];
  }

  // 2. Explicit component or function definition: e.g. `function UserProfile(` or `class Sidebar extends`
  const funcMatch = /(?:function|class)\s+([A-Z][a-zA-Z0-9_$]+)\s*[\(\{]/i.exec(code);
  if (funcMatch && funcMatch[1] && funcMatch[1].length > 2) {
    return funcMatch[1];
  }

  // 3. Named hook function: e.g. `function useAuth(`
  const hookMatch = /function\s+(use[A-Z][a-zA-Z0-9_$]+)\s*\(/i.exec(code);
  if (hookMatch && hookMatch[1]) {
    return hookMatch[1];
  }

  // 4. Source map or Webpack comment: e.g. `/*! ./src/utils/formatDate.js */`
  const commentMatch = /(?:\/\*!\s*|CONCATENATED MODULE:\s*)(?:[\.\w\/\-]+\/)?([a-zA-Z0-9_\-]+)\.(?:[a-z]{2,4})/i.exec(code);
  if (commentMatch && commentMatch[1]) {
    return commentMatch[1];
  }

  return null;
}

export function classifyModuleStructure(module: BundleModule, isOriginal: boolean): ClassifiedModulePath {
  if (!isOriginal) {
    const name = inferModuleName(module) || `module_${module.id}`;
    return {
      category: 'vendor',
      suggestedName: name,
      relativePath: `vendor/${name}.js`
    };
  }

  const code = module.code;
  const inferredName = inferModuleName(module);
  const safeId = String(module.id).replace(/[^a-zA-Z0-9_\-]/g, '_');

  // Category 1: React / Next Pages & Routes
  if (/getStaticProps|getServerSideProps|__NEXT_DATA__|useRouter|next\/router|router\.push/i.test(code)) {
    const name = inferredName || `Page_${safeId}`;
    return {
      category: 'pages',
      suggestedName: name,
      relativePath: `src/pages/${name}.jsx`
    };
  }

  // Category 2: Custom React Hooks
  if (/^use[A-Z]/.test(inferredName || '') || (/\b(?:useState|useEffect|useCallback|useMemo|useRef)\b/.test(code) && !/React\.createElement|_jsx/i.test(code))) {
    const name = inferredName || `useHook_${safeId}`;
    return {
      category: 'hooks',
      suggestedName: name,
      relativePath: `src/hooks/${name}.js`
    };
  }

  // Category 3: React / Vue UI Components
  if (/React\.createElement|_jsx|_jsxs|<[A-Z][a-zA-Z0-9]*|displayName|useContext/i.test(code)) {
    const name = inferredName || `Component_${safeId}`;
    return {
      category: 'components',
      suggestedName: name,
      relativePath: `src/components/${name}.jsx`
    };
  }

  // Category 4: Services & API Fetchers
  if (/\/api\/|axios\.create|fetch\(|QueryClient|useQuery|useMutation|ApolloClient/i.test(code)) {
    const name = inferredName || `service_${safeId}`;
    return {
      category: 'services',
      suggestedName: name,
      relativePath: `src/services/${name}.js`
    };
  }

  // Category 5: Store & State Management
  if (/createStore|createSlice|configureStore|createContext|Provider|useReducer|zustand|mobx/i.test(code)) {
    const name = inferredName || `store_${safeId}`;
    return {
      category: 'store',
      suggestedName: name,
      relativePath: `src/store/${name}.js`
    };
  }

  // Category 6: Types & Schemas
  if (/z\.object|yup\.object|Joi\.object|schema/i.test(code)) {
    const name = inferredName || `schema_${safeId}`;
    return {
      category: 'types',
      suggestedName: name,
      relativePath: `src/types/${name}.js`
    };
  }

  // Category 7: Config & Constants
  if (/API_KEY|BASE_URL|process\.env|config|constants/i.test(code)) {
    const name = inferredName || `config_${safeId}`;
    return {
      category: 'config',
      suggestedName: name,
      relativePath: `src/config/${name}.js`
    };
  }

  // Default Fallback Category: Utils
  const name = inferredName || `util_${safeId}`;
  return {
    category: 'utils',
    suggestedName: name,
    relativePath: `src/utils/${name}.js`
  };
}
