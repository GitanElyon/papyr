import { syntaxTree } from "@codemirror/language";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { type Extension, RangeSetBuilder } from "@codemirror/state";

export const inlineCode = (options: { hidden?: boolean } = {}): Extension => {
  const { hidden = true } = options;

  const contentMark = Decoration.mark({ class: "cm-inline-code" });
  const formattingMark = Decoration.mark({ class: "cm-inline-code cm-formatting" });

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
                    if (node.name === "InlineCode") {
                        const nodeText = view.state.sliceDoc(node.from, node.to);
                        let delimiterLen = 0;
                        for(let i=0; i<nodeText.length; i++) {
                            if(nodeText[i] === '`') delimiterLen++;
                            else break;
                        }
                        
                        if (delimiterLen === 0) return;

                        const start = node.from;
                        const end = node.to;
                        const contentStart = start + delimiterLen;
                        const contentEnd = end - delimiterLen;
                        
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
                            builder.add(start, contentStart, Decoration.replace({}));
                            if (contentStart < contentEnd) {
                                builder.add(contentStart, contentEnd, contentMark);
                            }
                            builder.add(contentEnd, end, Decoration.replace({}));
                        } else {
                            builder.add(start, contentStart, formattingMark);
                            if (contentStart < contentEnd) {
                                builder.add(contentStart, contentEnd, contentMark);
                            }
                            builder.add(contentEnd, end, formattingMark);
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
