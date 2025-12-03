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

class BulletWidget extends WidgetType {
  constructor(readonly icon: string) { super(); }
  toDOM() {
    const span = document.createElement("span");
    span.className = "cm-list-bullet";
    span.textContent = this.icon;
    return span;
  }
}

class CheckboxWidget extends WidgetType {
  constructor(readonly checked: boolean) { super(); }
  toDOM() {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = this.checked;
    input.className = "cm-task-checkbox";
    // Prevent editing via the checkbox for now
    input.onclick = (e) => e.preventDefault(); 
    return input;
  }
}

export const lists = (options: { 
    hidden?: boolean, 
    bulletIcon?: string 
} = {}): Extension => {
  const { hidden = true, bulletIcon = "•" } = options;

  const markClass = "cm-list-mark";
  const formattingClass = "cm-list-mark cm-formatting";

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
                    if (node.name === "ListMark") {
                        // Check if it's a bullet or ordered list
                        const text = view.state.sliceDoc(node.from, node.to);
                        const isBullet = /^[-*+]$/.test(text);
                        
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
                            if (isBullet) {
                                builder.add(node.from, node.to, Decoration.replace({
                                    widget: new BulletWidget(bulletIcon)
                                }));
                            } else {
                                // Ordered list - just style it
                                builder.add(node.from, node.to, Decoration.mark({ class: markClass }));
                            }
                        } else {
                            builder.add(node.from, node.to, Decoration.mark({ class: formattingClass }));
                        }
                    } else if (node.name === "TaskMarker") {
                        const text = view.state.sliceDoc(node.from, node.to);
                        const isChecked = text.includes("x") || text.includes("X");
                        
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
                             builder.add(node.from, node.to, Decoration.replace({
                                widget: new CheckboxWidget(isChecked)
                            }));
                        } else {
                            builder.add(node.from, node.to, Decoration.mark({ class: formattingClass }));
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
