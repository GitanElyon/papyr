import { syntaxTree } from "@codemirror/language";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
import { type Extension, RangeSetBuilder } from "@codemirror/state";

class LanguageWidget extends WidgetType {
  language: string;
  constructor(language: string) {
    super();
    this.language = language;
  }
  toDOM() {
    const span = document.createElement("span");
    span.className = "cm-codeblock-language";
    span.textContent = this.language || "text";
    return span;
  }
}

export const codeblock = (options: { hidden?: boolean } = {}): Extension => {
  const { hidden = true } = options;

  const contentLine = Decoration.line({ class: "cm-codeblock" });
  const languageMark = Decoration.mark({ class: "cm-codeblock-language-text" });

  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
      }
      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
          this.decorations = this.buildDecorations(update.view);
        }
      }
      buildDecorations(view: EditorView): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();
        const ranges = view.state.selection.ranges;
        const tree = syntaxTree(view.state);

        for (const { from, to } of view.visibleRanges) {
            tree.iterate({
                from, to,
                enter: (node) => {
                    if (node.name === "FencedCode") {
                        const startLine = view.state.doc.lineAt(node.from);
                        const endLine = view.state.doc.lineAt(node.to);
                        
                        // Check overlap
                        let overlaps = false;
                        if (hidden) {
                            for (const range of ranges) {
                                if (range.from <= node.to && range.to >= node.from) {
                                    overlaps = true;
                                    break;
                                }
                            }
                        }

                        if (hidden && !overlaps) {
                            // First line: Replace content with language widget
                            const firstLineText = view.state.sliceDoc(startLine.from, startLine.to);
                            const langMatch = firstLineText.match(/^`{3,}(\w+)?/);
                            const lang = langMatch ? langMatch[1] : "";
                            
                            // We use a line decoration to style the background, 
                            // and a replace decoration to swap the text for the badge.
                            builder.add(startLine.from, startLine.from, contentLine);
                            builder.add(startLine.from, startLine.to, Decoration.replace({
                                widget: new LanguageWidget(lang || "")
                            }));
                            
                            // Content lines
                            for (let i = startLine.number + 1; i < endLine.number; i++) {
                                const line = view.state.doc.line(i);
                                builder.add(line.from, line.from, contentLine);
                            }
                            
                            // Last line: Hide it completely by replacing text
                            builder.add(endLine.from, endLine.to, Decoration.replace({}));
                        } else {
                            // Visible mode: Style all lines
                            
                            // Pre-calculate language position
                            const firstLineText = view.state.sliceDoc(startLine.from, startLine.to);
                            const langMatch = firstLineText.match(/^`{3,}(\w+)?/);
                            let langStart = -1;
                            let langEnd = -1;
                            if (langMatch && langMatch[1]) {
                                langStart = startLine.from + langMatch[0].indexOf(langMatch[1]);
                                langEnd = langStart + langMatch[1].length;
                            }

                            for (let i = startLine.number; i <= endLine.number; i++) {
                                const line = view.state.doc.line(i);
                                builder.add(line.from, line.from, contentLine);
                                
                                if (i === startLine.number && langStart !== -1) {
                                    builder.add(langStart, langEnd, languageMark);
                                }
                            }
                        }
                        return false;
                    }
                }
            });
        }
        return builder.finish();
      }
    },
    {
      decorations: (instance) => instance.decorations,
    }
  );
};
