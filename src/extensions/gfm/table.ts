import { syntaxTree } from "@codemirror/language";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { type Extension, RangeSetBuilder } from "@codemirror/state";

export const table = (_options: { hidden?: boolean } = {}): Extension => {
  
  const tableHeaderMark = Decoration.mark({ class: "cm-table-header" });
  const tableDelimiterMark = Decoration.mark({ class: "cm-table-delimiter" });
  const tableRowMark = Decoration.line({ class: "cm-table-row" });

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
        const tree = syntaxTree(view.state);
        
        for (const { from, to } of view.visibleRanges) {
            tree.iterate({
                from, to,
                enter: (node) => {
                    if (node.name === "Table") {
                        // Style the whole table rows? 
                        // Actually, Table node spans the whole block.
                        // We can iterate children.
                    }
                    else if (node.name === "TableHeader") {
                        builder.add(node.from, node.to, tableHeaderMark);
                    }
                    else if (node.name === "TableDelimiter") {
                        builder.add(node.from, node.to, tableDelimiterMark);
                    }
                    else if (node.name === "TableRow") {
                        // Apply line decoration to the row
                        const line = view.state.doc.lineAt(node.from);
                        builder.add(line.from, line.from, tableRowMark);
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
