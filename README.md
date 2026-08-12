# 🕵️ BundleSherlock

> **The open-source bundle intelligence & reverse-engineering toolkit for modern JavaScript applications.**  
> Understand any minified JS bundle: what's vendor, what's original code, what APIs it calls, and extract clean source code into framework best-practice folder structures.

---

[![NPM Version](https://img.shields.io/npm/v/bundle-sherlock?color=brightgreen)](https://www.npmjs.com/package/bundle-sherlock)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

---

## ✨ Features

- **🔍 Multi-Bundler Unpacker**: Supports Webpack 4, Webpack 5, Vite, Rollup, Browserify, and Esbuild.
- **⚡ Embedded SourceMap Recovery Engine**: Automatically decodes Base64 inline source maps (`//# sourceMappingURL=data:application/json;base64,...`) to restore uncompiled **TypeScript and JSX** files with 100% fidelity.
- **🛡️ 99% Precision Zero-False-Positive Net Scorer**: Calculates weighted confidence scores using bulletproof long signatures, negative application weights, and `antiSignatures` protection.
- **📦 90+ Library Fingerprints**: Detects React, Next.js, Vue, Nuxt, Angular, Svelte, MUI, Radix, Tailwind, Redux, Zustand, TanStack Query, Axios, Three.js, Ethers, Sentry, and more.
- **🔗 API Endpoint & URL Extractor**: Scans for relative REST endpoints (`/api/v1/...`), GraphQL queries, and absolute URLs.
- **🚨 Secret Scanner**: Scans bundles for sensitive credentials (AWS keys, Google API keys, Stripe live keys, JWT tokens, GitHub PATs).
- **🧹 Modern AST Deobfuscator**: Cleans shorthand minification (`!0` ➔ `true`, `void 0` ➔ `undefined`, sequence expressions `(a(), b())`).
- **📁 Framework-Aware Reconstructor**: Saves extracted original source modules into clean modern ES Modules arranged in `src/components/`, `src/services/`, `src/hooks/`, `src/utils/`, and `src/config/`.

---

## 🚀 Installation

Install globally via NPM:

```bash
npm install -g bundle-sherlock
```

Or run directly with `npx`:

```bash
npx bundle-sherlock main.bundle.js
```

---

## 💡 Usage Examples

### 1. Inspect a Bundle (Terminal CLI Report)

```bash
bundle-sherlock main.730e86c3.js
```

### 2. Extract Clean Original Source Code Files

```bash
bundle-sherlock main.730e86c3.js -o ./decompiled_src --only-original
```

### 3. Target Specific Application Presets

```bash
# Target SaaS Auth & User Logic
bundle-sherlock main.js -t saas -o ./saas_src --only-original

# Target E-Commerce Checkout & Payment Logic
bundle-sherlock main.js -t ecommerce -o ./ecommerce_src --only-original
```

### 4. Output Raw JSON Inspection Data

```bash
bundle-sherlock main.js --json > report.json
```

---

## 🛠 Programmatic API Usage

You can use `BundleSherlock` as a TypeScript / Node.js library in your own security tools and build scripts:

```typescript
import { 
  unpackWebpack5, 
  detectLibraries, 
  extractEndpoints, 
  extractSecrets, 
  scoreModule 
} from 'bundle-sherlock';
import fs from 'node:fs';

const code = fs.readFileSync('bundle.js', 'utf-8');

// Unpack bundle modules
const modules = unpackWebpack5(code);

// Inspect module with 99% precision scorer
modules.forEach(module => {
  const result = scoreModule(module);
  console.log(`Module ${module.id}: ${result.type} (${result.confidence}% confidence)`);
});

// Detect libraries and secrets
const libraries = detectLibraries(code);
const secrets = extractSecrets(code);
```

---

## 📄 License

MIT © [Musoftwares](https://musoftwares.com)
