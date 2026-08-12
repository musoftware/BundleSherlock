import fs from 'node:fs';
import path from 'node:path';
import { LibraryDetectionResult } from '../detector/engine';

export interface ScaffoldOptions {
  outputDir: string;
  projectName?: string;
  detectedLibraries: LibraryDetectionResult[];
}

export function generateProjectScaffold(options: ScaffoldOptions) {
  const { outputDir, projectName = 'reconstructed-app', detectedLibraries } = options;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Build dependencies map based on detected libraries
  const dependencies: Record<string, string> = {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  };

  const devDependencies: Record<string, string> = {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.3.1"
  };

  detectedLibraries.forEach(lib => {
    const nameLower = lib.name.toLowerCase();
    if (nameLower.includes('material-ui') || nameLower.includes('mui')) {
      dependencies['@mui/material'] = '^5.15.20';
      dependencies['@emotion/react'] = '^11.11.4';
      dependencies['@emotion/styled'] = '^11.11.5';
    } else if (nameLower.includes('axios')) {
      dependencies['axios'] = '^1.7.2';
    } else if (nameLower.includes('zustand')) {
      dependencies['zustand'] = '^4.5.2';
    } else if (nameLower.includes('date-fns')) {
      dependencies['date-fns'] = '^3.6.0';
    } else if (nameLower.includes('lodash')) {
      dependencies['lodash'] = '^4.17.21';
    } else if (nameLower.includes('chart.js')) {
      dependencies['chart.js'] = '^4.4.3';
    }
  });

  // Write package.json
  const packageJson = {
    name: projectName,
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    },
    dependencies,
    devDependencies
  };

  fs.writeFileSync(
    path.join(outputDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  );

  // Write vite.config.js
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
`;
  fs.writeFileSync(path.join(outputDir, 'vite.config.js'), viteConfig, 'utf-8');

  // Write index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml, 'utf-8');

  // Ensure src directory exists
  const srcDir = path.join(outputDir, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }

  // Write src/index.css
  const indexCss = `/* Reconstructed Application Styles */
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  background-color: #242424;
  color: rgba(255, 255, 255, 0.87);
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}
`;
  fs.writeFileSync(path.join(srcDir, 'index.css'), indexCss, 'utf-8');

  // Write src/main.jsx
  const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
  fs.writeFileSync(path.join(srcDir, 'main.jsx'), mainJsx, 'utf-8');

  // Write src/App.jsx
  const appJsx = `import React from 'react';

export function App() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🕵️ BundleSherlock Reconstructed Application</h1>
      <p>This codebase was automatically unbundled, linked, and reconstructed.</p>
    </div>
  );
}

export default App;
`;
  fs.writeFileSync(path.join(srcDir, 'App.jsx'), appJsx, 'utf-8');
}
