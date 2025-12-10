import { EditorView } from '@codemirror/view'
import type { Extension } from '@codemirror/state'
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
import { taskList } from '../extensions/gfm/task-list'
import { strikethrough } from '../extensions/gfm/strikethrough'
import { autolink } from '../extensions/gfm/autolink'
import { table } from '../extensions/gfm/table'
import {keymap} from "@codemirror/view"
import { defaultKeymap, indentMore, indentLess } from '@codemirror/commands'
// import '../style.css'

export interface PapyrConfig {
  syntax?: {
    bold?: boolean | { hidden?: boolean }
    italic?: boolean | { hidden?: boolean }
    header?: boolean | { hidden?: boolean }
    inlineCode?: boolean | { hidden?: boolean }
    link?: boolean | { hidden?: boolean }
    blockquote?: boolean | { hidden?: boolean }
    horizontalRule?: boolean | { hidden?: boolean }
    codeblock?: boolean | { hidden?: boolean }
    lists?: boolean | { hidden?: boolean; bulletIcon?: string }
  }
  extensions?: {
    gfm?: boolean | {
      strikethrough?: boolean | { hidden?: boolean, thickness?: string }
      taskList?: boolean | { hidden?: boolean, disabled?: boolean, hideBullet?: boolean, bulletIcon?: string }
      autolink?: boolean | { hidden?: boolean }
      table?: boolean | { hidden?: boolean, mode?: 'raw' | 'rich' }
    }
  }
  theme?: string
  onChange?: (content: string) => void
}

export const papyr = (config: PapyrConfig = {}): Extension => {
  const extensions: Extension[] = [
    markdown({ base: markdownLanguage }),
    keymap.of([
      ...defaultKeymap,
      {
        key: "Tab",
        preventDefault: true,
        run: indentMore,
      },
      {
        key: "Shift-Tab",
        preventDefault: true,
        run: indentLess,
      },
    ]),
  ]

  const syntax = config.syntax || {};
  const explicitKeys = Object.keys(syntax).filter(k => syntax[k as keyof typeof syntax] !== undefined);
  const enableAll = explicitKeys.length === 0;

  const resolve = (key: keyof typeof syntax) => {
      const val = syntax[key];
      if (enableAll) return {}; // Enabled, default options
      if (val === undefined || val === false) return null; // Disabled
      if (val === true) return {}; // Enabled, default options
      return val; // Enabled, custom options
  }

  const boldOpts = resolve('bold');
  if (boldOpts) {
    extensions.push(bold(boldOpts))
  }

  const italicOpts = resolve('italic');
  if (italicOpts) {
    extensions.push(italic(italicOpts))
  }

  const headerOpts = resolve('header');
  if (headerOpts) {
    extensions.push(header(headerOpts))
  }

  const inlineCodeOpts = resolve('inlineCode');
  if (inlineCodeOpts) {
    extensions.push(inlineCode(inlineCodeOpts))
  }

  const linkOpts = resolve('link');
  if (linkOpts) {
    extensions.push(link(linkOpts))
  }

  const blockquoteOpts = resolve('blockquote');
  if (blockquoteOpts) {
    extensions.push(blockquote(blockquoteOpts))
  }

  const horizontalRuleOpts = resolve('horizontalRule');
  if (horizontalRuleOpts) {
    extensions.push(horizontalRule(horizontalRuleOpts))
  }

  const codeblockOpts = resolve('codeblock');
  if (codeblockOpts) {
    extensions.push(codeblock(codeblockOpts))
  }

  // Determine if we need to ignore task lists in the main lists extension
  let ignoreTaskLists = false;
  if (config.extensions?.gfm) {
       const gfmConfig = config.extensions.gfm === true ? {} : config.extensions.gfm;
       const taskConfig = gfmConfig.taskList;
       if (taskConfig !== false) {
           const opts = taskConfig === true || taskConfig === undefined ? {} : taskConfig;
           if (opts.hideBullet || opts.bulletIcon) {
               ignoreTaskLists = true;
           }
       }
  }

  const listsOpts = resolve('lists');
  if (listsOpts) {
    extensions.push(lists({
      ...listsOpts,
      ignoreTaskLists: ignoreTaskLists
    }))
  }

  // GFM Extensions
  if (config.extensions?.gfm) {
      const gfmConfig = config.extensions.gfm === true ? {} : config.extensions.gfm;
      
      // Strikethrough
      const strikeConfig = gfmConfig.strikethrough;
      if (strikeConfig !== false) {
          const opts = strikeConfig === true || strikeConfig === undefined ? {} : strikeConfig;
          extensions.push(strikethrough({
              hidden: opts.hidden !== false,
              thickness: opts.thickness
          }));
      }

      // Task List
      const taskConfig = gfmConfig.taskList;
      if (taskConfig !== false) {
          const opts = taskConfig === true || taskConfig === undefined ? {} : taskConfig;
          
          extensions.push(taskList({
              hidden: opts.hidden !== false,
              disabled: opts.disabled === true,
              hideBullet: opts.hideBullet === true,
              bulletIcon: opts.bulletIcon
          }));
      }

      // Autolink
      const linkConfig = gfmConfig.autolink;
      if (linkConfig !== false) {
          const opts = linkConfig === true || linkConfig === undefined ? {} : linkConfig;
          extensions.push(autolink({
              hidden: opts.hidden !== false
          }));
      }

      // Table
      const tableConfig = gfmConfig.table;
      if (tableConfig !== false) {
          const opts = tableConfig === true || tableConfig === undefined ? {} : tableConfig;
          extensions.push(table({
              hidden: opts.hidden !== false,
              mode: opts.mode
          }));
      }
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

  return extensions;
}