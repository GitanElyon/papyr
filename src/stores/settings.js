import { reactive, watch } from 'vue'

// Default settings
const DEFAULT_SETTINGS = {
  theme: {
    name: 'Dark',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    lineHeight: 1.6
  },
  editor: {
    focusMode: false,
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
}

// Load settings from localStorage or use defaults
const loadSettings = () => {
  const stored = localStorage.getItem('papyr-settings')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      // Deep merge with defaults to handle missing properties
      return {
        theme: { ...DEFAULT_SETTINGS.theme, ...parsed.theme },
        editor: { ...DEFAULT_SETTINGS.editor, ...parsed.editor }
      }
    } catch (e) {
      console.error('Failed to parse stored settings:', e)
    }
  }
  return DEFAULT_SETTINGS
}

// Create reactive settings store
export const settings = reactive(loadSettings())

// Save settings to localStorage whenever they change
watch(
  settings,
  (newSettings) => {
    localStorage.setItem('papyr-settings', JSON.stringify(newSettings))
  },
  { deep: true }
)

// Helper function to apply theme to CSS variables
export const applyTheme = () => {
  const root = document.documentElement
  root.style.setProperty('--color-background', settings.theme.backgroundColor)
  root.style.setProperty('--color-text', settings.theme.textColor)
  root.style.setProperty('--editor-font-family', settings.theme.fontFamily)
  root.style.setProperty('--editor-font-size', `${settings.theme.fontSize}px`)
  root.style.setProperty('--editor-line-height', settings.theme.lineHeight.toString())
}

// Helper function to get Muya options from settings
export const getMuyaOptions = () => ({
  fontSize: settings.theme.fontSize,
  lineHeight: settings.theme.lineHeight,
  focusMode: settings.editor.focusMode,
  theme: settings.theme.name.toLowerCase(),
  spellcheckEnabled: settings.editor.spellcheckEnabled,
  bulletListMarker: settings.editor.bulletListMarker,
  orderListMarker: settings.editor.orderListMarker,
  preferLooseListItem: settings.editor.preferLooseListItem,
  autoPairBracket: settings.editor.autoPairBracket,
  autoPairMarkdownSyntax: settings.editor.autoPairMarkdownSyntax,
  autoPairQuote: settings.editor.autoPairQuote,
  trimUnnecessaryCodeBlockEmptyLines: settings.editor.trimUnnecessaryCodeBlockEmptyLines,
  codeBlockLineNumbers: settings.editor.codeBlockLineNumbers,
  sequenceTheme: settings.editor.sequenceTheme,
  mermaidTheme: settings.editor.mermaidTheme,
  hideQuickInsertHint: settings.editor.hideQuickInsertHint,
  hideLinkPopup: settings.editor.hideLinkPopup,
  autoCheck: settings.editor.autoCheck,
  listIndentation: settings.editor.listIndentation,
  tabSize: settings.editor.tabSize
})

// Reset settings to defaults
export const resetSettings = () => {
  Object.assign(settings, DEFAULT_SETTINGS)
}

// Available theme presets
export const THEME_PRESETS = [
  {
    name: 'Dark',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff'
  },
  {
    name: 'Light',
    backgroundColor: '#ffffff',
    textColor: '#2c3e50'
  },
  {
    name: 'Sepia',
    backgroundColor: '#f4f1ea',
    textColor: '#5c4b37'
  },
  {
    name: 'High Contrast',
    backgroundColor: '#000000',
    textColor: '#ffffff'
  }
]

// Font family options
export const FONT_FAMILIES = [
  {
    name: 'System Default',
    value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  {
    name: 'Georgia',
    value: 'Georgia, "Times New Roman", Times, serif'
  },
  {
    name: 'Helvetica',
    value: 'Helvetica, Arial, sans-serif'
  },
  {
    name: 'Monaco',
    value: 'Monaco, "Lucida Console", "Courier New", monospace'
  },
  {
    name: 'Times',
    value: '"Times New Roman", Times, serif'
  }
]