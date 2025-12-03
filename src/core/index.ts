import {
  EditorView,
 } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { bold } from '../syntax/bold'
import { italic } from '../syntax/italic'
import { header } from '../syntax/header'
import { inlineCode } from '../syntax/inline-code'
import { link } from '../syntax/link'
import { blockquote } from '../syntax/blockquote'
import { horizontalRule } from '../syntax/horizontal-rule'
import { codeblock } from '../syntax/codeblock'
import { lists } from '../syntax/lists'
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
    header?: { enabled?: boolean; hidden?: boolean }
    inlineCode?: { enabled?: boolean; hidden?: boolean }
    link?: { enabled?: boolean; hidden?: boolean }
    blockquote?: { enabled?: boolean; hidden?: boolean }
    horizontalRule?: { enabled?: boolean; hidden?: boolean }
    codeblock?: { enabled?: boolean; hidden?: boolean }
    lists?: { enabled?: boolean; hidden?: boolean; bulletIcon?: string }
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
      markdown({ base: markdownLanguage }),
    ]

    if (config.syntax?.bold?.enabled) {
      extensions.push(bold({
        hidden: config.syntax.bold.hidden
      }))
    }

    if (config.syntax?.italic?.enabled) {
      extensions.push(italic({
        hidden: config.syntax.italic.hidden
      }))
    }

    if (config.syntax?.header?.enabled) {
      extensions.push(header({
        hidden: config.syntax.header.hidden
      }))
    }

    if (config.syntax?.inlineCode?.enabled) {
      extensions.push(inlineCode({
        hidden: config.syntax.inlineCode.hidden
      }))
    }

    if (config.syntax?.link?.enabled) {
      extensions.push(link({
        hidden: config.syntax.link.hidden
      }))
    }

    if (config.syntax?.blockquote?.enabled) {
      extensions.push(blockquote({
        hidden: config.syntax.blockquote.hidden
      }))
    }

    if (config.syntax?.horizontalRule?.enabled) {
      extensions.push(horizontalRule({
        hidden: config.syntax.horizontalRule.hidden
      }))
    }

    if (config.syntax?.codeblock?.enabled) {
      extensions.push(codeblock({
        hidden: config.syntax.codeblock.hidden
      }))
    }

    if (config.syntax?.lists?.enabled) {
      extensions.push(lists({
        hidden: config.syntax.lists.hidden,
        bulletIcon: config.syntax.lists.bulletIcon
      }))
    }

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