import { syntaxTree } from "@codemirror/language";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { type Extension, RangeSetBuilder } from "@codemirror/state";

export const autolink = (_options: { hidden?: boolean } = {}): Extension => {
  // hidden option is reserved for future use if we want to hide protocol etc.
  // const { hidden = true } = options; 

  const linkMark = Decoration.mark({ class: "cm-link" });

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
                    // GFM Autolinks are often parsed as URL nodes or Link nodes depending on context.
                    // In Lezer Markdown, bare URLs are often just URL nodes or text.
                    // However, the GFM extension usually parses them as 'URL' nodes inside the tree.
                    if (node.name === "URL") {
                        // Ensure this URL is NOT part of a standard Link structure [text](url)
                        // We can check the parent.
                        const parent = node.node.parent;
                        if (parent && parent.name === "Link") {
                            return;
                        }
                        
                        // If it's a standalone URL (Autolink)
                        builder.add(node.from, node.to, linkMark);
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
