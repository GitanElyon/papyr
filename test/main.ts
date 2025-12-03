import { Papyr } from '../src/core/index'
import { strikethrough } from '../src/extensions/gfm'

const editor = new Papyr({
  parent: document.getElementById('editor')!,
  content: '# Hello World!\n\nThis is **bold** text and *italic* text. ~~strikethrough~~',
  onChange: (content) => {
    console.log('Content changed:', content)
  },
  extensions: [
    strikethrough({
      hidden: true,
      thickness: '1px'
    })
  ]
})