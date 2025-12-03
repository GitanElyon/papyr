import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { type Extension, RangeSetBuilder } from "@codemirror/state";

export const strikethrough = (options: { hidden?: boolean, thickness?: string } = {}): Extension => {
  const { hidden = true, thickness } = options;

  const styleAttributes = thickness ? { style: `text-decoration-thickness: ${thickness}` } : undefined;
  const contentMark = Decoration.mark({ class: "cm-strikethrough", attributes: styleAttributes });
  const formattingMark = Decoration.mark({ class: "cm-strikethrough cm-formatting", attributes: styleAttributes });

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
        
        for (const { from, to } of view.visibleRanges) {
          const text = view.state.doc.sliceString(from, to);
          const regex = /~~(.*?)~~/g;
          let match;
          while ((match = regex.exec(text))) {
            const start = from + match.index;
            const end = start + match[0].length;
            const contentStart = start + 2;
            const contentEnd = end - 2;
            
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
        return builder.finish();
      }
    },
    {
      decorations: (instance) => instance.decorations,
    }
  );
};
