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
import { BulletWidget } from "../../syntax/lists";

class CheckboxWidget extends WidgetType {
  checked: boolean;
  disabled: boolean;
  constructor(checked: boolean, disabled: boolean) { 
      super(); 
      this.checked = checked;
      this.disabled = disabled;
  }

  ignoreEvent(event: Event) {
      // We want to handle mousedown ourselves in the domEventHandlers
      return event.type === "mousedown";
  }

  toDOM() {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = this.checked;
    input.className = "cm-task-checkbox";
    if (this.disabled) {
        input.disabled = true;
    }
    return input;
  }
}

export interface TaskListOptions {
    hidden?: boolean;
    disabled?: boolean;
    hideBullet?: boolean;
    bulletIcon?: string;
}

const taskListHandlers = EditorView.domEventHandlers({
    mousedown(event, view) {
        const target = event.target as HTMLElement;
        if (target.nodeName === "INPUT" && target.classList.contains("cm-task-checkbox")) {
            if (target.hasAttribute("disabled")) return false;

            const pos = view.posAtDOM(target);
            // posAtDOM returns the position of the widget.
            // For a replacement decoration, it should be the start of the range.
            
            // We need to verify we are at a task marker.
            // The task marker is 3 chars: [ ] or [x]
            const text = view.state.sliceDoc(pos, pos + 3);
            
            if (/^\[[ xX]\]$/.test(text)) {
                const isChecked = text.includes("x") || text.includes("X");
                const newChar = isChecked ? " " : "x";
                
                view.dispatch({
                    changes: { from: pos + 1, to: pos + 2, insert: newChar }
                });
                
                event.preventDefault();
                return true;
            }
        }
        return false;
    }
});

export const taskList = (options: TaskListOptions = {}): Extension => {
  const { hidden = true, disabled = false, hideBullet = false, bulletIcon } = options;

  const formattingClass = "cm-task-marker cm-formatting";

  const plugin = ViewPlugin.fromClass(
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
                    // We iterate ListItem to handle both bullet hiding and checkbox
                    if (node.name === "ListItem") {
                        const taskNode = node.node.getChild("Task");
                        if (!taskNode) return; // Not a task list item

                        const listMarkNode = node.node.getChild("ListMark");
                        const taskMarkerNode = taskNode.getChild("TaskMarker");
                        
                        if (!taskMarkerNode) return;

                        // Handle Bullet (Hide or Custom Icon)
                        if (listMarkNode) {
                             // Check overlap for bullet
                            let bulletOverlaps = false;
                            if (hidden) {
                                for (const range of ranges) {
                                    if (range.from <= listMarkNode.to && range.to >= listMarkNode.from) {
                                        bulletOverlaps = true;
                                        break;
                                    }
                                }
                            }
                            
                            if (hidden && !bulletOverlaps) {
                                if (hideBullet) {
                                    builder.add(listMarkNode.from, listMarkNode.to, Decoration.replace({}));
                                } else if (bulletIcon) {
                                    builder.add(listMarkNode.from, listMarkNode.to, Decoration.replace({
                                        widget: new BulletWidget(bulletIcon)
                                    }));
                                }
                            }
                        }

                        // Handle Checkbox
                        const text = view.state.sliceDoc(taskMarkerNode.from, taskMarkerNode.to);
                        const isChecked = text.includes("x") || text.includes("X");
                        
                        // Check overlap for checkbox
                        let checkboxOverlaps = false;
                        if (hidden) {
                            for (const range of ranges) {
                                if (range.from <= taskMarkerNode.to && range.to >= taskMarkerNode.from) {
                                    checkboxOverlaps = true;
                                    break;
                                }
                            }
                        }

                        if (hidden && !checkboxOverlaps) {
                             builder.add(taskMarkerNode.from, taskMarkerNode.to, Decoration.replace({
                                widget: new CheckboxWidget(isChecked, disabled)
                            }));
                        } else {
                            builder.add(taskMarkerNode.from, taskMarkerNode.to, Decoration.mark({ class: formattingClass }));
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

  return [plugin, taskListHandlers];
};
