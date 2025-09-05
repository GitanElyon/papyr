<template>
  <div class="editor-container">
    <div ref="editorRef" class="editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Muya } from '@muyajs/core'

const editorRef = ref(null)
let editor = null

const initializeEditor = () => {
  if (editorRef.value) {
    editor = new Muya(editorRef.value, {
      spellcheck: false,
      theme: 'light',
      markdown: '# Welcome to Papyr\n\nStart writing your markdown here...\n\n**This is bold text** and *this is italic*.\n\n- List item 1\n- List item 2\n- List item 3',
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    initializeEditor()
  }, 100) // Small delay to ensure DOM is ready
})

onUnmounted(() => {
  if (editor) {
    editor.destroy()
  }
})
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: calc(100vh - 60px); /* Account for header height */
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
}

.editor {
  flex: 1;
  width: 100%;
  max-width: 100%;
  min-height: 400px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}
</style>