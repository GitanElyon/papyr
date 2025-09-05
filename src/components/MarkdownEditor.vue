<template>
  <div class="markdown-editor-container">
    <div ref="editorContainer" class="muya-editor" id="editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
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
import { settings, getMuyaOptions, applyTheme } from '../stores/settings.js'

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

const getInitialOptions = () => ({
  markdown: '# Welcome to Papyr\n\nStart writing your markdown here...\n\n## Features\n\n- **Bold text**\n- *Italic text*\n- [Links](https://example.com)\n- `Code snippets`\n\n```javascript\nfunction hello() {\n  console.log("Hello World!");\n}\n```\n\n> This is a blockquote\n\n1. Ordered list item 1\n2. Ordered list item 2\n\n- Unordered list item\n- Another item\n',
  ...getMuyaOptions()
})

onMounted(() => {
  // Apply theme on component mount
  applyTheme()
  
  if (editorContainer.value) {
    try {
      // Initialize the muya editor with current settings
      muya = new Muya(editorContainer.value, getInitialOptions())
      
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

// Watch for settings changes and update the editor
watch(
  () => settings,
  () => {
    applyTheme()
    if (muya) {
      // Simple approach: just update options without trying to refresh
      const newOptions = getMuyaOptions()
      Object.keys(newOptions).forEach(key => {
        if (muya.options && muya.options[key] !== newOptions[key]) {
          muya.options[key] = newOptions[key]
        }
      })
    }
  },
  { deep: true }
)

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
  height: 100vh;
  position: relative;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background: #1a1a1a;
}

.muya-editor {
  width: 100%;
  height: 100vh;
  border: none;
  border-radius: 0;
  padding: 20px;
  font-family: var(--editor-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif);
  font-size: var(--editor-font-size, 16px);
  line-height: var(--editor-line-height, 1.6);
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  box-sizing: border-box;
}

.muya-editor:focus {
  border: none;
  box-shadow: none;
}

/* Apply selection color to text selection */
.muya-editor ::selection {
  background-color: var(--color-selection, #3b82f6);
  color: var(--color-text);
}

.muya-editor ::-moz-selection {
  background-color: var(--color-selection, #3b82f6);
  color: var(--color-text);
}

/* Apply paragraph spacing */
.muya-editor p {
  margin-bottom: var(--editor-paragraph-spacing, 16px);
}

/* Also apply to Muya-specific paragraph elements */
.muya-editor .ag-paragraph {
  margin-bottom: var(--editor-paragraph-spacing, 16px);
}
</style>