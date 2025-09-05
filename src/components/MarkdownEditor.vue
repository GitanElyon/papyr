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

// Function to handle cursor movement and scrolling
const handleCursorMovement = () => {
  if (!editorContainer.value) return
  
  try {
    // Find the active cursor element in the DOM
    const activeCursor = editorContainer.value.querySelector('.muya-cursor')
    if (!activeCursor) {
      // If no cursor found, look for the focused element or selection
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        scrollToCursor(rect)
      }
      return
    }
    
    const cursorRect = activeCursor.getBoundingClientRect()
    scrollToCursor(cursorRect)
  } catch (error) {
    console.warn('Error handling cursor movement:', error)
  }
}

// Helper function to scroll the container to keep cursor visible
const scrollToCursor = (cursorRect) => {
  const container = editorContainer.value
  if (!container || !cursorRect.height) return
  
  const containerRect = container.getBoundingClientRect()
  const scrollBuffer = 50 // pixels of buffer space
  
  const containerTop = containerRect.top
  const containerBottom = containerRect.bottom
  const cursorTop = cursorRect.top
  const cursorBottom = cursorRect.bottom
  
  if (cursorTop < containerTop + scrollBuffer) {
    // Cursor is above visible area, scroll up
    container.scrollBy(0, cursorTop - (containerTop + scrollBuffer))
  } else if (cursorBottom > containerBottom - scrollBuffer) {
    // Cursor is below visible area, scroll down  
    container.scrollBy(0, cursorBottom - (containerBottom - scrollBuffer))
  }
}

const defaultOptions = {
  markdown: '# Welcome to Papyr\n\nStart writing your markdown here...\n\n## Features\n\n- **Bold text**\n- *Italic text*\n- [Links](https://example.com)\n- `Code snippets`\n\n```javascript\nfunction hello() {\n  console.log("Hello World!");\n}\n```\n\n> This is a blockquote\n\n1. Ordered list item 1\n2. Ordered list item 2\n\n- Unordered list item\n- Another item\n',
  fontSize: 16,
  lineHeight: 1.6,
  focusMode: false,
  theme: 'dark',
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
  mermaidTheme: 'dark',
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
        // Handle cursor position tracking and scrolling
        setTimeout(handleCursorMovement, 10) // Small delay to ensure DOM is updated
      })
      
      // Add keyboard event listener for immediate scrolling on arrow keys
      muya.on('key-down', (event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) {
          setTimeout(handleCursorMovement, 10)
        }
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
  font-family: 'Helvetica', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  background: #1a1a1a;
  color: #ffffff;
  outline: none;
  box-sizing: border-box;
  overflow-y: auto;
}

.muya-editor:focus {
  border: none;
  box-shadow: none;
}

/* Override Muya's default text colors and formatting */
.muya-editor :deep(*) {
  color: #ffffff !important;
}

.muya-editor :deep(strong) {
  font-weight: 700 !important;
  color: #ffffff !important;
}

.muya-editor :deep(em) {
  font-style: italic !important;
  color: #ffffff !important;
}

.muya-editor :deep(h1),
.muya-editor :deep(h2),
.muya-editor :deep(h3),
.muya-editor :deep(h4),
.muya-editor :deep(h5),
.muya-editor :deep(h6) {
  color: #ffffff !important;
  font-weight: bold !important;
}

.muya-editor :deep(p),
.muya-editor :deep(li),
.muya-editor :deep(blockquote),
.muya-editor :deep(code),
.muya-editor :deep(pre) {
  color: #ffffff !important;
}

.muya-editor :deep(.muya-paragraph-front),
.muya-editor :deep(.muya-paragraph-front span) {
  color: #ffffff !important;
}
</style>