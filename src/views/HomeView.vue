<script setup>
import { ref } from 'vue'
import MarkdownEditor from '../components/MarkdownEditor.vue'
import SettingsIcon from '../components/SettingsIcon.vue'
import SettingsModal from '../components/SettingsModal.vue'

const showSettings = ref(false)

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}
</script>

<template>
  <main class="home-view">
    <MarkdownEditor />
    <SettingsIcon @toggle-settings="toggleSettings" />
    <SettingsModal :is-open="showSettings" @close="toggleSettings" />
  </main>
</template>

<style scoped>
.home-view {
  width: 100%;
  height: 100vh;
  max-width: 100vw;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
}
</style>
