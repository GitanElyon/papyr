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
                    if (node.name === "ATXHeading") {
                        const text = view.state.sliceDoc(node.from, node.to);
                        const match = text.match(/^(#{1,6})(\s+)(.*)$/);
                        
                        if (match) {
                            const level = match[1].length;
                            const start = node.from;
                            const end = node.to;
                            
                            const hashesLen = match[1].length;
                            const spaceLen = match[2].length;
                            const contentStartAbs = start + hashesLen + spaceLen;
                            
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
                            
                            const className = `cm-header cm-header-${level}`;
                            const contentMark = Decoration.mark({ class: className });
                            const formattingMark = Decoration.mark({ class: `${className} cm-formatting` });

                            if (hidden && !overlaps) {
                                builder.add(start, contentStartAbs, Decoration.replace({}));
                                builder.add(contentStartAbs, end, contentMark);
                            } else {
                                builder.add(start, contentStartAbs, formattingMark);
                                builder.add(contentStartAbs, end, contentMark);
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
