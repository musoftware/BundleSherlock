import { DetectionRule } from './types';

export const editorRules: DetectionRule[] = [
  {
    name: 'Prism.js Syntax Highlighting',
    category: 'editor',
    signatures: [
      'Prism.languages',
      'hljs.registerLanguage',
      'languages.extend',
      'languages.insertBefore',
      'displayName = "naniscript"',
      'displayName = "hlsl"',
      'displayName = "peoplecode"',
      'displayName = "erlang"',
      'displayName = "javadoc"'
    ],
    weight: 30
  },
  {
    name: 'Highlight.js',
    category: 'editor',
    signatures: ['hljs.highlight', 'hljs.registerLanguage', 'hljs.configure'],
    weight: 30
  },
  {
    name: 'Monaco Editor',
    category: 'editor',
    signatures: ['monaco.editor', 'monaco.languages', 'createWebWorker'],
    weight: 30
  },
  {
    name: 'CodeMirror',
    category: 'editor',
    signatures: ['CodeMirror.fromTextArea', 'CodeMirror.defineMode', 'EditorView'],
    weight: 30
  },
  {
    name: 'Quill Editor',
    category: 'editor',
    signatures: ['Quill.register', 'new Quill(', 'quill-container'],
    weight: 30
  },
  {
    name: 'TipTap',
    category: 'editor',
    signatures: ['@tiptap/core', 'useEditor', 'EditorContent'],
    weight: 30
  },
  {
    name: 'Slate.js',
    category: 'editor',
    signatures: ['createEditor', 'Slate', 'Editable', 'withReact'],
    weight: 30
  },
  {
    name: 'KaTeX & MathJax',
    category: 'editor',
    signatures: ['katex.render', 'MathJax.Hub', 'katex-html'],
    weight: 30
  }
];
