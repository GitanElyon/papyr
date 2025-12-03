import { syntaxTree } from "@codemirror/language";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { type Extension, RangeSetBuilder } from "@codemirror/state";

export const blockquote = (options: { hidden?: boolean } = {}): Extension => {
  const { hidden = true } = options;

  const contentMark = Decoration.line({ class: "cm-blockquote" });
  const formattingMark = Decoration.mark({ class: "cm-blockquote-marker cm-formatting" });

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
                    if (node.name === "QuoteMark") {
                        const start = node.from;
                        const end = node.to;
                        const line = view.state.doc.lineAt(start);
                        
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
                        
                        if (hidden && !overlaps) {
                            // Apply blockquote style to the whole line
                            builder.add(line.from, line.from, contentMark);
                            // Hide the > marker
                            builder.add(start, end, Decoration.replace({}));
                        } else {
                            // Apply blockquote style to the whole line
                            builder.add(line.from, line.from, contentMark);
                            // Show the > marker with formatting style
                            builder.add(start, end, formattingMark);
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
