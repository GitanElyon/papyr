# Overview

> **Pre-Alpha Notice:** This project is in its early stages of development. The API and features are subject to change as we refine and expand the library. Feedback and contributions are welcome!

Papyr is a javascript library for building easily customizable and extensible rich text markdown editors. It is built on top of [CodeMirror 6](https://codemirror.net/6/) and [lang-markdown](https://github.com/codemirror/lang-markdown) and provides a set of default extensions and tools to painlessly implement a real time single panel WYSIWYG markdown editor in any web application.

The goal of papyr is to provide a simple way for developers to implement a single-panel customizable obsidian-like markdown editor which can be easily used as a drop-in editor similar to tiptap or milkdown--the difference being that papyr uses real markdown as the source.

TLDR: papyr is a drop-in markdown editor similar to tiptap or milkdown, but uses real markdown as the source like obsidian.

## Installation

```bash
npm install @gitanelyon/papyr # not published yet
```

## Features
- **Drop-in editor:** works like Tiptap or Milkdown, but with real Markdown as the backing model.
- **Obsidian-like experience:** users see and edit Markdown directly, with inline formatting.
- **Extensible architecture:** built on CodeMirror 6, so you can add or remove features with ease.

# Configuration Reference

For a complete list of configuration options, go to [DOCS.md](./docs/DOCS.md).

All editor functionality is optional and can be configured when instantiating the editor. All editor styling should be controlled via CSS. The editor also comes with a set of extentions for non-CommonMark features which can be added as needed (Strikethrough, Tables, Task Lists, Autolinks, etc).

## Basic Usage

```typescript
import { Papyr } from 'papyr';

const editor = new Papyr({
  parent: document.getElementById('editor'),
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