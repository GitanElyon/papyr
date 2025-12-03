import {
  EditorView,
 } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import '../style.css'

export interface PapyrConfig {
  parent: HTMLElement
  content?: string
  options?: {
    lineWrapping?: boolean
    lineNumbers?: boolean
    spellcheck?: boolean
    readOnly?: boolean
    placeholder?: string
    autoPair?: boolean
    tabSize?: number
  }
  syntax?: {
    general?: { enabled?: boolean; hidden?: boolean }
    bold?: { enabled?: boolean; hidden?: boolean }
    italic?: { enabled?: boolean; hidden?: boolean }
    // others will be added later
  }
  theme?: string
  extensions?: any[]
  onChange?: (content: string) => void
}

export class Papyr {
  private view: EditorView

  constructor(config: PapyrConfig) {
    const extensions = [
      basicSetup,
      markdown(),
    ]

    if (config.extensions) {
      extensions.push(...config.extensions)
    }

    if (config.onChange) {
      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            config.onChange!(update.state.doc.toString())
          }
        })
      )
    }

    this.view = new EditorView({
      state: EditorState.create({
        doc: config.content || '',
        extensions
      }),
      parent: config.parent
    })
  }

  getContent(): string {
    return this.view.state.doc.toString()
  }

  setContent(content: string): void {
    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.length,
        insert: content
      }
    })
  }

  focus(): void {
    this.view.focus()
  }

  destroy(): void {
    this.view.destroy()
  }
}