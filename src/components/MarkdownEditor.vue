<template>
  <div class="markdown-editor-container">
    <div ref="editorContainer" class="muya-editor" id="editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Muya,
  EmojiSelector,
  InlineFormatToolbar,
  ImageToolBar,
  ImageResizeBar,
  CodeBlockLanguageSelector,
  ParagraphFrontButton,
  ParagraphFrontMenu,
  TableColumnToolbar,
  ParagraphQuickInsertMenu,
  TableDragBar,
  TableRowColumMenu,
  PreviewToolBar,
} from '@muyajs/core'
import '@muyajs/core/lib/style.css'

// Use muya plugins
Muya.use(EmojiSelector)
Muya.use(InlineFormatToolbar)
Muya.use(ImageToolBar)
Muya.use(ImageResizeBar)
Muya.use(CodeBlockLanguageSelector)
Muya.use(ParagraphFrontButton)
Muya.use(ParagraphFrontMenu)
Muya.use(TableColumnToolbar)
Muya.use(ParagraphQuickInsertMenu)
Muya.use(TableDragBar)
Muya.use(TableRowColumMenu)
Muya.use(PreviewToolBar)

const editorContainer = ref(null)
let muya = null

const defaultOptions = {
  markdown: '# Welcome to Papyr\n\nStart writing your markdown here...\n\n## Features\n\n- **Bold text**\n- *Italic text*\n- [Links](https://example.com)\n- `Code snippets`\n\n```javascript\nfunction hello() {\n  console.log("Hello World!");\n}\n```\n\n> This is a blockquote\n\n1. Ordered list item 1\n2. Ordered list item 2\n\n- Unordered list item\n- Another item\n',
  fontSize: 16,
  lineHeight: 1.6,
  focusMode: false,
  theme: 'light',
  spellcheckEnabled: true,
  bulletListMarker: '-',
  orderListMarker: '.',
  preferLooseListItem: true,
  autoPairBracket: true,
  autoPairMarkdownSyntax: true,
  autoPairQuote: true,
  trimUnnecessaryCodeBlockEmptyLines: true,
  codeBlockLineNumbers: false,
  sequenceTheme: 'hand-drawn',
  mermaidTheme: 'default',
  hideQuickInsertHint: false,
  hideLinkPopup: false,
  autoCheck: false,
  listIndentation: 1,
  tabSize: 4
}

onMounted(() => {
  if (editorContainer.value) {
    try {
      // Initialize the muya editor
      muya = new Muya(editorContainer.value, defaultOptions)
      
      // Initialize the editor
      muya.init()
      
      // Set up event listeners
      muya.on('change', (changes) => {
        console.log('Editor content changed:', changes)
      })
      
      muya.on('focus', () => {
        console.log('Editor focused')
      })
      
      muya.on('blur', () => {
        console.log('Editor blurred')
      })
      
      muya.on('selection-change', (changes) => {
        console.log('Selection changed:', changes)
      })
      
      // Focus the editor after initialization
      setTimeout(() => {
        muya.focus()
      }, 100)
      
    } catch (error) {
      console.error('Error initializing Muya editor:', error)
    }
  }
})

onUnmounted(() => {
  if (muya) {
    muya.destroy()
    muya = null
  }
})

// Expose editor instance for parent components if needed
defineExpose({
  getMarkdown: () => muya?.getMarkdown() || '',
  setMarkdown: (markdown) => muya?.setMarkdown(markdown),
  focus: () => muya?.focus(),
  blur: () => muya?.blur()
})
</script>

<style scoped>
.markdown-editor-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
}

.muya-editor {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  background: #fff;
  color: #333;
  outline: none;
  box-sizing: border-box;
}

.muya-editor:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .muya-editor {
    background: #1e1e1e;
    color: #d4d4d4;
    border-color: #444;
  }
  
  .muya-editor:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
  }
}
</style>