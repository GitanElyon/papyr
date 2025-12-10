# Configuration Reference

This document provides a reference for configuring and using the Papyr markdown editor extension.

Papyr is designed to be used as a CodeMirror 6 extension. You configure the editor itself using standard CodeMirror patterns, and configure Papyr's specific features via the `papyr()` extension function.

```typescript
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { papyr } from 'papyr';

const view = new EditorView({
  parent: document.getElementById('editor'),
  state: EditorState.create({
    doc: '# Hello, Welcome to Papyr!',
    extensions: [
      // 1. Standard CodeMirror Setup (Line numbers, keymaps, etc.)
      basicSetup, 
      
      // 2. Papyr Extension
      papyr({
        // CommonMark syntax elements (all enabled by default)
        syntax: {
          // General markdown parsing
          general: { enabled: true, hidden: false },

          // Bold text (**text** or __text__)
          bold: { enabled: true, hidden: false },
          
          // Italic text (*text* or _text_)
          italic: { enabled: true, hidden: false },
          
          // Headings (# ## ### etc.)
          headings: { enabled: true, hidden: false },
          
          // Links ([text](url))
          links: { enabled: true, hidden: false },
          
          // Lists (- item, * item, 1. item)
          lists: { enabled: true, hidden: false },
          
          // Blockquotes (> text)
          blockquotes: { enabled: true, hidden: false },
          
          // Inline code (`code`)
          inlineCode: { enabled: true, hidden: false },
          
          // Code blocks (```lang or indented)
          codeBlocks: { enabled: true, hidden: false },
          
          // Horizontal rules (--- or ***)
          horizontalRules: { enabled: true, hidden: false }
        },

        // Additional Extensions (GFM)
        extensions: {
          gfm: {
            strikethrough: { hidden: false, thickness: '1px' },
            taskList: { hidden: false, disabled: false, hideBullet: false, bulletIcon: '➤' },
            autolink: true,
            table: true
          }
        },
        
        // Theme (loads predefined CSS variables)
        theme: 'default',
        
        // Content change callback
        onChange: (content: string) => {
          console.log('Content changed:', content);
        }
      })
    ]
  })
});
```

## Standard Editor Options

Since Papyr is just an extension, you control standard editor features using CodeMirror's native extensions.

```typescript
import { lineNumbers, EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

// ... inside extensions array:
[
  lineNumbers(),                    // Show line numbers
  EditorView.lineWrapping,          // Enable line wrapping
  EditorState.readOnly.of(true),    // Make read-only
  EditorState.tabSize.of(4),        // Set tab size
]
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