import { syntaxTree } from "@codemirror/language";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { type Extension, RangeSetBuilder } from "@codemirror/state";

export const link = (options: { hidden?: boolean } = {}): Extension => {
  const { hidden = true } = options;

  const contentMark = Decoration.mark({ class: "cm-link" });
  const formattingMark = Decoration.mark({ class: "cm-link cm-formatting" });
  const urlMark = Decoration.mark({ class: "cm-link-url" });

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
                    if (node.name === "Link") {
                        const text = view.state.sliceDoc(node.from, node.to);
                        const match = text.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
                        
                        if (match) {
                            const start = node.from;
                            const end = node.to;
                            
                            const textContent = match[1];
                            // const urlContent = match[2];
                            
                            const textStart = start + 1;
                            const textEnd = textStart + textContent.length;
                            
                            const urlStart = textEnd + 2; // ](
                            const urlEnd = end - 1; // )
                            
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
                                // Hide [
                                builder.add(start, textStart, Decoration.replace({}));
                                // Show Text
                                builder.add(textStart, textEnd, contentMark);
                                // Hide ](URL)
                                builder.add(textEnd, end, Decoration.replace({}));
                            } else {
                                // Show [
                                builder.add(start, textStart, formattingMark);
                                // Show Text
                                builder.add(textStart, textEnd, contentMark);
                                // Show ](
                                builder.add(textEnd, urlStart, formattingMark);
                                // Show URL
                                builder.add(urlStart, urlEnd, urlMark);
                                // Show )
                                builder.add(urlEnd, end, formattingMark);
                            }
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
