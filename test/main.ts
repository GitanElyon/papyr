import { Papyr } from '../src/core/index'
import { strikethrough } from '../src/extensions/gfm'

const editor = new Papyr({
  parent: document.getElementById('editor')!,
  content: '# Hello World!\n\nImplemented Syntax:\n\n---\n**bold**\n*italic*\n~~strikethrough~~\n`code`\n[link](https://github.com/gitanelyon/papyr)\n> This is a blockquote\n```javascript\nconsole.log("Hello Code Block");\n```\n\nEnd of document',
  onChange: (content) => {
    console.log('Content changed:', content)
  },
  syntax: {
    bold: { enabled: true, hidden: true },
    italic: { enabled: true, hidden: true },
    header: { enabled: true, hidden: true },
    inlineCode: { enabled: true, hidden: true },
    link: { enabled: true, hidden: true },
    blockquote: { enabled: true, hidden: true },
    horizontalRule: { enabled: true, hidden: true },
    codeblock: { enabled: true, hidden: true },
    lists: { enabled: true, hidden: true, bulletIcon: '•' }
  },
  extensions: [
    strikethrough({
      hidden: true,
      thickness: '1px'
    })
  ]
})