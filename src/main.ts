import './style.css'

import { basicSetup, EditorView } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { HighlightStyle, tags } from '@codemirror/highlight'

const editor = new EditorView({
  doc: '# Hello World!\nThis is a markdown editor using CodeMirror 6.',
  extensions: [basicSetup, markdown()],
  parent: document.body,
})


