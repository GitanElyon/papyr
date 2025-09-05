<template>
  <div class="theme-settings">
    <h3>Appearance</h3>
    
    <div class="setting-group">
      <label class="setting-label">Theme Preset</label>
      <div class="theme-presets">
        <button
          v-for="preset in THEME_PRESETS"
          :key="preset.name"
          :class="['theme-preset', { active: settings.theme.name === preset.name }]"
          @click="applyPreset(preset)"
        >
          <div 
            class="preset-preview"
            :style="{
              backgroundColor: preset.backgroundColor,
              color: preset.textColor
            }"
          >
            Aa
          </div>
          <span>{{ preset.name }}</span>
        </button>
      </div>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="background-color">Background Color</label>
      <div class="color-input-group">
        <input
          id="background-color"
          type="color"
          v-model="settings.theme.backgroundColor"
          @change="updateTheme"
        />
        <input
          type="text"
          v-model="settings.theme.backgroundColor"
          @change="updateTheme"
          class="color-text-input"
        />
      </div>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="text-color">Text Color</label>
      <div class="color-input-group">
        <input
          id="text-color"
          type="color"
          v-model="settings.theme.textColor"
          @change="updateTheme"
        />
        <input
          type="text"
          v-model="settings.theme.textColor"
          @change="updateTheme"
          class="color-text-input"
        />
      </div>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="font-family">Font Family</label>
      <select
        id="font-family"
        v-model="settings.theme.fontFamily"
        @change="updateTheme"
        class="setting-select"
      >
        <option v-for="font in FONT_FAMILIES" :key="font.name" :value="font.value">
          {{ font.name }}
        </option>
      </select>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="font-size">Font Size</label>
      <div class="range-input-group">
        <input
          id="font-size"
          type="range"
          min="12"
          max="24"
          step="1"
          v-model="settings.theme.fontSize"
          @input="updateTheme"
          class="setting-range"
        />
        <span class="range-value">{{ settings.theme.fontSize }}px</span>
      </div>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="line-height">Line Height</label>
      <div class="range-input-group">
        <input
          id="line-height"
          type="range"
          min="1.2"
          max="2.0"
          step="0.1"
          v-model="settings.theme.lineHeight"
          @input="updateTheme"
          class="setting-range"
        />
        <span class="range-value">{{ settings.theme.lineHeight }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { settings, applyTheme, THEME_PRESETS, FONT_FAMILIES } from '../../stores/settings.js'

const applyPreset = (preset) => {
  settings.theme.name = preset.name
  settings.theme.backgroundColor = preset.backgroundColor
  settings.theme.textColor = preset.textColor
  updateTheme()
}

const updateTheme = () => {
  applyTheme()
}
</script>

<style scoped>
.theme-settings h3 {
  margin: 0 0 24px 0;
  color: var(--color-heading);
  font-size: 18px;
  font-weight: 600;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-heading);
  font-size: 14px;
  font-weight: 500;
}

.theme-presets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.theme-preset {
  background: none;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.theme-preset:hover {
  border-color: var(--color-border-hover);
}

.theme-preset.active {
  border-color: #007acc;
  background: rgba(0, 122, 204, 0.1);
}

.preset-preview {
  width: 32px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-preset span {
  color: var(--color-text);
  font-size: 12px;
}

.color-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-input-group input[type="color"] {
  width: 40px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
}

.color-text-input {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 14px;
}

.setting-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 14px;
}

.range-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-range {
  flex: 1;
}

.range-value {
  min-width: 50px;
  text-align: right;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
}

input:focus,
select:focus {
  outline: none;
  border-color: #007acc;
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
}
</style>