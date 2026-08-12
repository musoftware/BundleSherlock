import { DetectionRule } from './types';

export const editorRules: DetectionRule[] = [
  {
    name: 'Prism.js Syntax Highlighting',
    category: 'vendor_editor',
    signatures: [
      'Prism.languages',
      /\b[a-zA-Z_$]\.languages\.[a-zA-Z0-9_$]+\s*=/,
      /\b[a-zA-Z_$]\.languages\.insertBefore\(/,
      /\b[a-zA-Z_$]\.languages\.extend\(/,
      /\.displayName\s*=\s*["'](?:dot|editorconfig|erlang|hpkp|hsts|io|jexl|jq|n4js|peoplecode|vim|visualBasic|hlsl|http|idris|naniscript|javadoc|properties|t4Vb|phpExtras|tsx|flow|firestore|clike|markup|javascript|python|ruby|rust|c|cpp|java)["']/,
      /languages-[a-z0-9_-]+/
    ],
    weight: 45
  },
  {
    name: 'Highlight.js',
    category: 'vendor_editor',
    signatures: [
      'hljs.highlight',
      'hljs.registerLanguage',
      'hljs.configure',
      /\bhljs\.[a-zA-Z0-9_$]+/
    ],
    weight: 40
  },
  {
    name: 'Monaco Editor',
    category: 'vendor_editor',
    signatures: ['monaco.editor', 'monaco.languages', 'createWebWorker'],
    weight: 40
  },
  {
    name: 'CodeMirror',
    category: 'vendor_editor',
    signatures: ['CodeMirror.fromTextArea', 'CodeMirror.defineMode', 'EditorView'],
    weight: 40
  },
  {
    name: 'Quill Editor',
    category: 'vendor_editor',
    signatures: ['Quill.register', 'new Quill(', 'quill-container'],
    weight: 40
  },
  {
    name: 'TipTap',
    category: 'vendor_editor',
    signatures: ['@tiptap/core', 'useEditor', 'EditorContent'],
    weight: 40
  },
  {
    name: 'Slate.js',
    category: 'vendor_editor',
    signatures: ['createEditor', 'Slate', 'Editable', 'withReact'],
    weight: 40
  },
  {
    name: 'KaTeX & MathJax',
    category: 'vendor_editor',
    signatures: ['katex.render', 'MathJax.Hub', 'katex-html'],
    weight: 40
  }
];
