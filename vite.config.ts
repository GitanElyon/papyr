import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: 'src/core/index.ts',
      name: 'papyr',
      fileName: (format) => `papyr.${format}.js`,
    },
    rollupOptions: {
      external: ['codemirror', 'codemirror/lang-markdown'],
      output: {
        globals: {
          codemirror: 'CodeMirror',
          'codemirror/lang-markdown': 'CodeMirrorLangMarkdown',
        },
      },
    },
  },
})
