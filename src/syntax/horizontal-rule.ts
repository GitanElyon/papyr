import { syntaxTree } from "@codemirror/language";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { type Extension, RangeSetBuilder } from "@codemirror/state";

export const horizontalRule = (options: { hidden?: boolean } = {}): Extension => {
  const { hidden = true } = options;

  const hrWidget = Decoration.line({
    class: "cm-hr"
  });
  
  const formattingMark = Decoration.mark({ class: "cm-hr-marker cm-formatting" });

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
                    if (node.name === "HorizontalRule") {
                        const start = node.from;
                        const end = node.to;
                        const line = view.state.doc.lineAt(start);
                        
                        // Check overlap
                        let overlaps = false;
                        if (hidden) {
                            for (const range of ranges) {
                                if (range.from <= end && range.to >= start) {
                                    overlaps = true;
                                    break;
                                }
                            }
                        }
                        
                        if (hidden && !overlaps) {
                            // And apply the line decoration which will render the HR
                            builder.add(line.from, line.from, hrWidget);
                            // Replace the entire line content with nothing (effectively hiding the text)
                            builder.add(start, end, Decoration.replace({}));
                        } else {
                            // Show the text with formatting style
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
