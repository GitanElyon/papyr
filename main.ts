import { EditorView, minimalSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { papyr } from './src/core/index'

const startState = EditorState.create({
  doc: '# Hello World!\n\nImplemented Syntax:\n\n---\n**bold**\n*italic*\n~~strikethrough~~\n`code`\n[link](https://github.com/gitanelyon/papyr)\n> This is a blockquote\n```javascript\nconsole.log("Hello Code Block");\n```\n- unordered list\n- [ ] checkbox\n\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n\nAll info can be found at:\nhttps://github.com/GitanElyon\nEnd of document',
  extensions: [
    
    minimalSetup,
    // Papyr Extension
    papyr({
      onChange: (content) => {
        console.log('Content changed:', content)
      },
      syntax: {
        bold: { hidden: true },
        italic: { hidden: true },
        header: { hidden: true },
        inlineCode: { hidden: true },
        link: { hidden: true },
        blockquote: { hidden: true },
        horizontalRule: { hidden: true },
        codeblock: { hidden: true },
        lists: { hidden: true, bulletIcon: '•' }
      },
      extensions: {
        gfm: {
            strikethrough: {
                hidden: true,
            },
            taskList: {
                hidden: true,
                disabled: false,
                hideBullet: false,
                bulletIcon: '➤'
            },
            autolink: true,
            table: {
                mode: 'raw'
            }
        }
      }
    })
  ]
})

new EditorView({
  state: startState,
  parent: document.getElementById('editor')!
})