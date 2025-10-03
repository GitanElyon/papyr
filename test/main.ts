import { Papyr } from '../src/core/index'

const editor = new Papyr({
  parent: document.getElementById('editor')!,
  content: '# Hello World!\n\nThis is **bold** text and *italic* text.',
  onChange: (content) => {
    console.log('Content changed:', content)
  }
})