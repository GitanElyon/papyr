# Overview

> **Pre-Alpha Notice:** This project is in its early stages of development. The API and features are subject to change as we refine and expand the library. Feedback and contributions are welcome!

Papyr is a **CodeMirror 6 extension** for building easily customizable and extensible rich text markdown editors. It is built on top of [lang-markdown](https://github.com/codemirror/lang-markdown) and provides a set of tools to painlessly implement a real-time single-panel WYSIWYG markdown editor in any web application.

The goal of papyr is to provide a simple way for developers to implement a single-panel customizable obsidian-like markdown editor which can be easily used as a drop-in extension for any CodeMirror 6 instance.

TLDR: papyr is a CodeMirror extension that turns your editor into a rich-text markdown editor like Obsidian.

## Installation

```bash
npm install @gitanelyon/papyr # not published yet
```

## Features
- **CodeMirror Extension:** Works seamlessly with any existing CodeMirror 6 setup.
- **Obsidian-like experience:** Users see and edit Markdown directly, with inline formatting.
- **Extensible architecture:** Built on CodeMirror 6, so you can add or remove features with ease.

# Configuration Reference

For a complete list of configuration options, go to [DOCS.md](./docs/DOCS.md).

All editor functionality is optional and can be configured when adding the extension. All editor styling should be controlled via CSS. The extension also comes with support for non-CommonMark features which can be added as needed (Strikethrough, Tables, Task Lists, Autolinks, etc).

## Basic Usage

```typescript
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { papyr } from 'papyr';

new EditorView({
  parent: document.getElementById('editor'),
  state: EditorState.create({
    doc: '# Hello World',
    extensions: [
      basicSetup,
      papyr({
        // Papyr configuration
        syntax: {
          bold: { hidden: true }
        }
      })
    ]
  })
});
```
# Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT License - see [LICENSE](./LICENSE.txt) file for details.

# Developerment

To run the development server:

```bash
npm run dev
```

To build the library and run the test environment:

```bash
npm run build:watch # in one terminal
cd test && npx vite # in another terminal
```

Then open `http://localhost:5173` in your browser.

# Developers Note

I originally had this idea back in 2024, but I didn't have the technical know-how to time to do implement it. After several headaches, I've finally decided to sit down and do it.

Hopefully this will be useful to someone out there.

TLDR: Papyr is a codemirror extension designed to replace the default markdown editor with a rich-text single-panel WYSIWYG experience similar to Obsidian.