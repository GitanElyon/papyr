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
        // Handle cursor position tracking and scrolling
        setTimeout(handleCursorMovement, 10)
      })
      
      muya.on('focus', () => {
        console.log('Editor focused')
        setTimeout(handleCursorMovement, 50)
      })
      
      muya.on('blur', () => {
        console.log('Editor blurred')
      })
      
      muya.on('selection-change', (changes) => {
        console.log('Selection changed:', changes)
        // Handle cursor position tracking and scrolling
        setTimeout(handleCursorMovement, 10) // Small delay to ensure DOM is updated

      })
      
      // Add additional event listeners for comprehensive cursor tracking
      muya.on('change', () => {
        setTimeout(handleCursorMovement, 10)
      })
      
      // Also listen to focus events
      muya.on('focus', () => {
        setTimeout(handleCursorMovement, 50)

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
  max-width: 100vw;
  position: relative;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background: #1a1a1a;
  overflow-x: hidden;
}

.muya-editor {
  width: 100%;
  height: 100vh;
  max-width: 100%;
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
  overflow-y: auto;
  overflow-x: hidden;
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

/* Override Muya's default text colors and formatting for normal text elements only */
.muya-editor :deep(strong) {
  font-weight: 700 !important;
  color: var(--color-text) !important;
}

.muya-editor :deep(em) {
  font-style: italic !important;
  color: var(--color-text) !important;
}

.muya-editor :deep(h1),
.muya-editor :deep(h2),
.muya-editor :deep(h3),
.muya-editor :deep(h4),
.muya-editor :deep(h5),
.muya-editor :deep(h6) {
  color: var(--color-text) !important;
  font-weight: bold !important;
}

.muya-editor :deep(p),
.muya-editor :deep(li),
.muya-editor :deep(blockquote) {
  color: var(--color-text) !important;
}

.muya-editor :deep(.muya-paragraph-front),
.muya-editor :deep(.muya-paragraph-front span) {
  color: var(--color-text) !important;
}

/* Make markdown syntax characters less prominent */
.muya-editor :deep(.mu-hide),
.muya-editor :deep(.mu-remove),
.muya-editor :deep(span.mu-hide),
.muya-editor :deep(span.mu-remove) {
  opacity: 0.3 !important;
  color: var(--color-text) !important;
  transition: opacity 0.2s ease;
}

/* Show syntax characters more prominently on hover for editing */
.muya-editor :deep(.mu-content:hover .mu-hide),
.muya-editor :deep(.mu-content:hover .mu-remove) {
  opacity: 0.6 !important;
}

/* Fix inline code styling to match theme text color */
.muya-editor :deep(code.mu-inline-rule) {
  color: var(--color-text) !important;
  background-color: transparent !important;
}
</style>