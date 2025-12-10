import { syntaxTree } from "@codemirror/language";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { type Extension, RangeSetBuilder } from "@codemirror/state";

export const header = (options: { hidden?: boolean } = {}): Extension => {
  const { hidden = true } = options;

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
                    if (node.name === "HeaderMark") {
                        const headerMark = node;
                        const level = headerMark.to - headerMark.from;
                        
                        // Find where the content starts (skip spaces after header mark)
                        let prefixEnd = headerMark.to;
                        const line = view.state.doc.lineAt(headerMark.from);
                        
                        while (prefixEnd < line.to) {
                            const char = view.state.sliceDoc(prefixEnd, prefixEnd + 1);
                            if (/[ \t]/.test(char)) {
                                prefixEnd++;
                            } else {
                                break;
                            }
                        }
                        
                        const start = headerMark.from;
                        
                        // Check overlap
                        let overlaps = false;
                        if (hidden) {
                            for (const range of ranges) {
                                if (range.from <= line.to && range.to >= line.from) {
                                    overlaps = true;
                                    break;
                                }
                            }
                        }
                        
                        const className = `cm-header cm-header-${level}`;
                        const lineDeco = Decoration.line({ class: className });
                        const formattingMark = Decoration.mark({ class: `cm-formatting` });

                        builder.add(line.from, line.from, lineDeco);

                        if (hidden && !overlaps && prefixEnd < line.to) {
                            builder.add(start, prefixEnd, Decoration.replace({}));
                        } else {
                            builder.add(start, prefixEnd, formattingMark);
                        }
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
