# Overview

Papyr is a javascript library for building easily customizable and extensible rich text markdown editors. It is built on top of [CodeMirror 6](https://codemirror.net/6/) and [lang-markdown](https://github.com/codemirror/lang-markdown).

The project is structured to allow users to import only the core functionality of the Papyr editor or include specific extensions as needed. This modular approach helps in keeping the bundle size minimal and efficient.

# File Breakdown
```
papyr/
├── src/
│   ├── core/
│   │   ├── index.ts              # Main Papyr extension export
│   │
│   ├── syntax/
│   │   ├── index.ts              # Syntax manager
│   │   ├── bold.ts               # Bold parsing/hiding
│   │   ├── italic.ts             # Italic parsing/hiding
│   │   ├── headings.ts           # Heading parsing/hiding
│   │   ├── links.ts              # Link parsing/hiding
│   │   ├── lists.ts              # List parsing/hiding
│   │   ├── blockquotes.ts        # Blockquote parsing/hiding
│   │   ├── inline-code.ts        # Inline code parsing/hiding
│   │   ├── code-blocks.ts        # Code block parsing/hiding
│   │   └── horizontal-rules.ts   # HR parsing/hiding
│   │
│   ├── themes/
│   │   ├── default.css           # Default theme
│   │   ├── github.css
│   │   ├── obsidian.css
│   │   └── minimal.css           # CodeMirror default theme
│   │
│   └── extensions/               # Separate entry points!
│       ├── gfm/
│       │   ├── strikethrough.ts  # Individual exports
│       │   ├── tables.ts
│       │   ├── task-lists.ts
│       │   └── autolinks.ts
│       │
│       ├── editor/
│       │   ├── keybindings.ts
│       │   ├── bracket-matching.ts
│       │   └── highlight-active-line.ts
│       │    
│       │
│       └── advanced/
│           ├── collaborative.ts
│           └── vim-bindings.ts
├── test/                         # Test environment
│   ├── index.html
│   ├── main.ts
│   └── vite.config.test.ts
│
├── dist/                         # Build output
│   ├── papyr.js                  # Main bundle
│   ├── papyr.min.js
│   ├── extensions/               # Separate extension bundles
│   │   ├── strikethrough.js
│   │   ├── tables.js
│   │   └── ...
│   └── themes/
│       └── *.css
│
└── package.json
```

# Developers Note

I'm mostly using this file to plan out the structure of the project so I have a clear idea of how to properly implement the modular architecture I want.

As you can see, not everything is implemented yet, but these are all the planned features for the 1.0 release.