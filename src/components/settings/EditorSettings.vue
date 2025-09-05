<template>
  <div class="editor-settings">
    <h3>Editor Configuration</h3>
    
    <div class="setting-group">
      <div class="checkbox-setting">
        <input
          id="focus-mode"
          type="checkbox"
          v-model="settings.editor.focusMode"
        />
        <label for="focus-mode" class="checkbox-label">
          <span class="checkbox-title">Focus Mode</span>
          <span class="checkbox-description">Hide other paragraphs while typing</span>
        </label>
      </div>
    </div>
    
    <div class="setting-group">
      <div class="checkbox-setting">
        <input
          id="spellcheck"
          type="checkbox"
          v-model="settings.editor.spellcheckEnabled"
        />
        <label for="spellcheck" class="checkbox-label">
          <span class="checkbox-title">Spell Check</span>
          <span class="checkbox-description">Enable spell checking</span>
        </label>
      </div>
    </div>
    
    <div class="setting-group">
      <div class="checkbox-setting">
        <input
          id="code-block-line-numbers"
          type="checkbox"
          v-model="settings.editor.codeBlockLineNumbers"
        />
        <label for="code-block-line-numbers" class="checkbox-label">
          <span class="checkbox-title">Code Block Line Numbers</span>
          <span class="checkbox-description">Show line numbers in code blocks</span>
        </label>
      </div>
    </div>
    
    <div class="setting-group">
      <div class="checkbox-setting">
        <input
          id="auto-pair-bracket"
          type="checkbox"
          v-model="settings.editor.autoPairBracket"
        />
        <label for="auto-pair-bracket" class="checkbox-label">
          <span class="checkbox-title">Auto Pair Brackets</span>
          <span class="checkbox-description">Automatically close brackets and parentheses</span>
        </label>
      </div>
    </div>
    
    <div class="setting-group">
      <div class="checkbox-setting">
        <input
          id="auto-pair-markdown"
          type="checkbox"
          v-model="settings.editor.autoPairMarkdownSyntax"
        />
        <label for="auto-pair-markdown" class="checkbox-label">
          <span class="checkbox-title">Auto Pair Markdown</span>
          <span class="checkbox-description">Automatically close markdown syntax like ** or __</span>
        </label>
      </div>
    </div>
    
    <div class="setting-group">
      <div class="checkbox-setting">
        <input
          id="auto-pair-quote"
          type="checkbox"
          v-model="settings.editor.autoPairQuote"
        />
        <label for="auto-pair-quote" class="checkbox-label">
          <span class="checkbox-title">Auto Pair Quotes</span>
          <span class="checkbox-description">Automatically close quotes</span>
        </label>
      </div>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="bullet-marker">Bullet List Marker</label>
      <select
        id="bullet-marker"
        v-model="settings.editor.bulletListMarker"
        class="setting-select"
      >
        <option value="-">- (Hyphen)</option>
        <option value="*">* (Asterisk)</option>
        <option value="+">+ (Plus)</option>
      </select>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="order-marker">Ordered List Marker</label>
      <select
        id="order-marker"
        v-model="settings.editor.orderListMarker"
        class="setting-select"
      >
        <option value=".">. (Period)</option>
        <option value=")"> ) (Parenthesis)</option>
      </select>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="tab-size">Tab Size</label>
      <div class="range-input-group">
        <input
          id="tab-size"
          type="range"
          min="2"
          max="8"
          step="1"
          v-model="settings.editor.tabSize"
          class="setting-range"
        />
        <span class="range-value">{{ settings.editor.tabSize }}</span>
      </div>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="list-indentation">List Indentation</label>
      <div class="range-input-group">
        <input
          id="list-indentation"
          type="range"
          min="1"
          max="4"
          step="1"
          v-model="settings.editor.listIndentation"
          class="setting-range"
        />
        <span class="range-value">{{ settings.editor.listIndentation }}</span>
      </div>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="sequence-theme">Sequence Diagram Theme</label>
      <select
        id="sequence-theme"
        v-model="settings.editor.sequenceTheme"
        class="setting-select"
      >
        <option value="hand-drawn">Hand Drawn</option>
        <option value="simple">Simple</option>
      </select>
    </div>
    
    <div class="setting-group">
      <label class="setting-label" for="mermaid-theme">Mermaid Theme</label>
      <select
        id="mermaid-theme"
        v-model="settings.editor.mermaidTheme"
        class="setting-select"
      >
        <option value="dark">Dark</option>
        <option value="default">Default</option>
        <option value="forest">Forest</option>
        <option value="neutral">Neutral</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { settings } from '../../stores/settings.js'
</script>

<style scoped>
.editor-settings h3 {
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

.checkbox-setting {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.checkbox-setting input[type="checkbox"] {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  accent-color: #007acc;
}

.checkbox-label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
}

.checkbox-title {
  color: var(--color-heading);
  font-size: 14px;
  font-weight: 500;
}

.checkbox-description {
  color: var(--color-text);
  font-size: 13px;
  opacity: 0.8;
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
  min-width: 30px;
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