<script setup>
import MarkdownEditor from '../components/MarkdownEditor.vue'
</script>

<template>
  <main class="home-view">
    <MarkdownEditor />
  </main>
</template>

<style scoped>
.home-view {
  width: 100%;
  height: calc(100vh - 80px);
  padding: 0;
  margin: 0;
}
</style>
