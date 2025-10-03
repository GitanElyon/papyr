# Configuration Reference

This document provides a reference for configuring and using the Papyr markdown editor. All options below are papyr's default settings and are optional unless otherwise noted.

```typescript
import { Papyr } from 'papyr';

const editor = new Papyr({
  // Required: DOM element where the editor will be mounted
  parent: document.getElementById('editor'),
  
  // Initial content (default: '')
  content: '# Hello, Welcome to Papyr!',
  
  // Basic editor options
  options: {
    lineWrapping: true,        // Wrap long lines (default: true)
    lineNumbers: false,        // Show line numbers (default: false)
    spellcheck: false,         // Browser spellcheck (default: false)
    readOnly: false,           // Make editor read-only (default: false)
    placeholder: 'Start typing...', // Placeholder text (default: '')
    autoPair: true,            // Auto-close brackets, quotes, syntax (default: true)
    tabSize: 2,                // Number of spaces per tab (default: 2)
  },
  
  // CommonMark syntax elements (all enabled by default)
  syntax: {
    // General markdown parsing, all others inherit from this
    general: { 
      enabled: true,    // Enable general markdown parsing (default: true)
      hidden: false,    // Hide all markdown syntax (default: false)
    },

    // Bold text (**text** or __text__)
    bold: { 
      enabled: true,    // Enable bold parsing (default: true)
      hidden: false,    // Hide ** markers (default: false)
    },
    
    // Italic text (*text* or _text_)
    italic: { 
      enabled: true,    // Enable italic parsing (default: true)
      hidden: false,    // Hide * markers (default: false)
    },
    
    // Headings (# ## ### etc.)
    headings: { 
      enabled: true,    // Enable heading parsing (default: true)
      hidden: false,    // Hide # markers (default: false)
    },
    
    // Links ([text](url))
    links: {
      enabled: true,    // Enable link parsing (default: true)
      hidden: false,    // Hide []() syntax (default: false)
    },
    
    // Lists (- item, * item, 1. item)
    lists: {
      enabled: true,    // Enable list parsing (default: true)
      hidden: false,    // Hide list markers (default: false)
    },
    
    // Blockquotes (> text)
    blockquotes: {
      enabled: true,    // Enable blockquote parsing (default: true)
      hidden: false,    // Hide > markers (default: false)
    },
    
    // Inline code (`code`)
    inlineCode: {
      enabled: true,    // Enable inline code parsing (default: true)
      hidden: false,    // Hide ` markers (default: false)
    },
    
    // Code blocks (```lang or indented)
    codeBlocks: {
      enabled: true,    // Enable code block parsing (default: true)
      hidden: false,    // Hide ``` markers (default: false)
    },
    
    // Horizontal rules (--- or ***)
    horizontalRules: {
      enabled: true,    // Enable HR parsing (default: true)
      hidden: false,    // Hide --- markers (default: false)
    }
  },

  // theme just loads predefined CSS variables
  theme: 'default',
  
  // Additional CodeMirror 6 extensions
  extensions: [
    // Add extensions here for non-CommonMark features
  ],
  
  // Content change callback
  onChange: (content: string) => {
    console.log('Content changed:', content);
  }
});

// Basic editor methods
editor.getContent();              // Get current markdown content
editor.setContent('# New content'); // Set content
editor.focus();                   // Focus the editor
editor.destroy();                 // Clean up and remove editor
```

# Extensions (Non-CommonMark Features)

For features beyond CommonMark, use extensions:

```typescript
import { 
  Papyr, 
  extensions: { 
    strikethrough,    // ~~text~~ (GFM)
    tables,           // | col1 | col2 | (GFM)
    taskLists,        // - [ ] item (GFM)
    autolinks,        // https://example.com (GFM)
    keybindings,      // Custom keyboard shortcuts
    bracketMatching,  // Highlight matching brackets
    highlightActiveLine, // Highlight current line
    vimMode,          // Vim key bindings
    collaborative     // Real-time collaboration
  } 
} from 'papyr';

const editor = new Papyr({
  parent: document.getElementById('editor'),
  extensions: [
    // GitHub Flavored Markdown extensions
    strikethrough(),
    tables(),
    taskLists(),
    autolinks(),
    
    // Editor enhancements
    keybindings({
      'Ctrl-b': 'toggleBold',
      'Ctrl-i': 'toggleItalic',
      'Ctrl-k': 'insertLink'
    }),
    bracketMatching(),
    highlightActiveLine(),
    
    // Advanced features
    vimMode(),
    collaborative({ room: 'doc-123' })
  ]
});
```

# Theming

Papyr comes with a default theme, but you can customize it via CSS variables or by providing your own styles.

```css
@import 'papyr/themes/default.css'; /* Default theme */

/* Or use a preset theme */
@import 'papyr/themes/github.css';
@import 'papyr/themes/obsidian.css';
@import 'papyr/themes/minimal.css';

/* Customize with CSS variables */
.papyr-editor {
  --papyr-bg: #ffffff;
  --papyr-text: #333333;
  --papyr-bold: #d73a49;
  --papyr-italic: #6f42c1;
  --papyr-heading: #1a1a1a;
  --papyr-link: #0366d6;
  --papyr-code-bg: #f6f8fa;
  --papyr-blockquote-border: #dfe2e5;
}

/* Or provide your own styles */
.papyr-bold {
  font-weight: 700;
}
.papyr-italic {
  font-style: italic;
  color: #555;
}
.papyr-heading-3 {
  font-weight: 600;
  margin-top: 1em;
}

```

Available themes:
- `default` - Clean, minimal styling
- `github` - GitHub-inspired colors and typography  
- `obsidian` - Dark theme similar to Obsidian app
- `minimal` - Bare-bones styling for custom designs
```

> It should be noted that not all features of markdown are supported yet. This is a work in progress and the features shown above are a taste of what is to come.