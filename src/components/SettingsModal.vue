<template>
  <Teleport to="body">
    <div v-if="isOpen" class="settings-overlay" @click="closeModal">
      <div class="settings-modal" @click.stop>
        <header class="settings-header">
          <h2>Settings</h2>
          <button @click="closeModal" class="close-button" aria-label="Close Settings">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </header>
        
        <div class="settings-content">
          <nav class="settings-nav">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['nav-button', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </nav>
          
          <div class="settings-panel">
            <ThemeSettings v-if="activeTab === 'theme'" />
            <EditorSettings v-if="activeTab === 'editor'" />
          </div>
        </div>
        
        <footer class="settings-footer">
          <button @click="resetAllSettings" class="reset-button">
            Reset to Defaults
          </button>
          <button @click="closeModal" class="done-button">
            Done
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { resetSettings } from '../stores/settings.js'
import ThemeSettings from './settings/ThemeSettings.vue'
import EditorSettings from './settings/EditorSettings.vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const activeTab = ref('theme')

const tabs = [
  { id: 'theme', label: 'Theme' },
  { id: 'editor', label: 'Editor' }
]

const closeModal = () => {
  emit('close')
}

const resetAllSettings = () => {
  if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
    resetSettings()
  }
}
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.settings-modal {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.settings-header h2 {
  margin: 0;
  color: var(--color-heading);
  font-size: 20px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background: var(--color-background-mute);
}

.close-button svg {
  fill: var(--color-text);
}

.settings-content {
  display: flex;
  flex: 1;
  min-height: 0;
}

.settings-nav {
  width: 180px;
  flex-shrink: 0;
  border-right: 1px solid var(--color-border);
  padding: 20px 0;
}

.nav-button {
  display: block;
  width: 100%;
  padding: 12px 24px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: var(--color-text);
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.nav-button:hover {
  background: var(--color-background-soft);
}

.nav-button.active {
  background: var(--color-background-mute);
  color: var(--color-heading);
  font-weight: 500;
}

.settings-panel {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.settings-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-top: 1px solid var(--color-border);
}

.reset-button {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background: var(--color-background-soft);
  border-color: var(--color-border-hover);
}

.done-button {
  background: #007acc;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.done-button:hover {
  background: #005a9e;
}
</style>