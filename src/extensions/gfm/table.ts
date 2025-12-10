import { syntaxTree } from "@codemirror/language";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  keymap,
} from "@codemirror/view";
import { type Extension, RangeSetBuilder, EditorSelection, Prec } from "@codemirror/state";

export interface TableOptions {
    hidden?: boolean;
    mode?: 'raw' | 'rich';
}

export const table = (options: TableOptions = {}): Extension => {
  const mode = options.mode || 'raw';
  
  const tableHeaderLine = Decoration.line({ class: "cm-table-line cm-table-header-line" });
  const tableRowLine = Decoration.line({ class: "cm-table-line cm-table-row-line" });
  const tableSeparatorLine = Decoration.line({ class: "cm-table-line cm-table-separator-line" });

  const tableCellMark = Decoration.mark({ class: "cm-table-cell" });
  const tablePipeMark = Decoration.mark({ class: "cm-table-pipe" });
  const tableSeparatorMark = Decoration.mark({ class: "cm-table-separator" });

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
        const tree = syntaxTree(view.state);
        const selection = view.state.selection.main;
        
        for (const { from, to } of view.visibleRanges) {
            tree.iterate({
                from, to,
                enter: (nodeRef) => {
                    const node = nodeRef.node;

                    // Check if cursor is on the line of this node
                    // We only care about TableHeader, TableRow, and the separator TableDelimiter
                    if (node.name === "TableHeader" || node.name === "TableRow") {
                        const line = view.state.doc.lineAt(node.from);
                        
                        // Check if line starts with pipe
                        if (!line.text.trimStart().startsWith('|')) {
                            return false; // Skip children
                        }

                        // If cursor overlaps with the line, skip decorations for this row (and its children)
                        if (mode === 'raw' && selection.head >= line.from && selection.head <= line.to) {
                            return false; // Skip children
                        }
                        
                        if (node.name === "TableHeader") {
                            builder.add(line.from, line.from, tableHeaderLine);
                        } else {
                            builder.add(line.from, line.from, tableRowLine);
                        }
                    }
                    else if (node.name === "TableDelimiter") {
                        if (node.parent?.name === "Table") {
                            // Separator row
                            const line = view.state.doc.lineAt(node.from);
                            
                            // Check if line starts with pipe
                            if (!line.text.trimStart().startsWith('|')) {
                                return false;
                            }

                            if (mode === 'raw' && selection.head >= line.from && selection.head <= line.to) {
                                return false;
                            }
                            builder.add(line.from, line.from, tableSeparatorLine);
                            builder.add(node.from, node.to, tableSeparatorMark);
                        } else {
                            // Pipe
                            builder.add(node.from, node.to, tablePipeMark);
                        }
                    }
                    else if (node.name === "TableCell") {
                        builder.add(node.from, node.to, tableCellMark);
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

  const tableKeymap = Prec.highest(keymap.of([
      {
          key: "Tab",
          run: (view) => handleTab(view),
          shift: (view) => handleShiftTab(view)
      },
      {
          key: "Enter",
          run: (view) => handleEnter(view)
      }
  ]));

  return [plugin, tableKeymap];
};

function getTableInfo(view: EditorView) {
    const { state } = view;
    const selection = state.selection.main;
    const tree = syntaxTree(state);
    let node = tree.resolveInner(selection.head);
    
    // Traverse up to find TableCell
    while (node.name !== "TableCell" && node.parent) {
        node = node.parent;
    }
    if (node.name !== "TableCell") return null;
    
    const cellNode = node;
    const rowNode = cellNode.parent!;
    const tableNode = rowNode.parent!;
    
    // Find all rows (Header, Delimiter, Row)
    const rows: { node: any, type: string, cells: any[] }[] = [];
    let cursor = tableNode.firstChild;
    while (cursor) {
        if (cursor.name === "TableHeader" || cursor.name === "TableRow") {
            const cells: any[] = [];
            let cellCursor = cursor.firstChild;
            while (cellCursor) {
                if (cellCursor.name === "TableCell") {
                    cells.push(cellCursor);
                }
                cellCursor = cellCursor.nextSibling;
            }
            rows.push({ node: cursor, type: cursor.name, cells });
        }
        cursor = cursor.nextSibling;
    }
    
    // Find current row index and cell index
    const rowIndex = rows.findIndex(r => r.node.from === rowNode.from);
    const cellIndex = rows[rowIndex].cells.findIndex(c => c.from === cellNode.from);
    
    return { tableNode, rows, rowIndex, cellIndex, cellNode };
}

function handleTab(view: EditorView): boolean {
    const info = getTableInfo(view);
    if (!info) return false;
    const { rows, rowIndex, cellIndex } = info;

    if (cellIndex < rows[rowIndex].cells.length - 1) {
        // Next cell in same row
        const nextCell = rows[rowIndex].cells[cellIndex + 1];
        view.dispatch({ selection: EditorSelection.range(nextCell.from, nextCell.to), scrollIntoView: true });
        return true;
    } else {
        // Last cell in row
        if (rowIndex < rows.length - 1) {
            // Next row
            const nextRow = rows[rowIndex + 1];
            if (nextRow.cells.length > 0) {
                 const nextCell = nextRow.cells[0];
                 view.dispatch({ selection: EditorSelection.range(nextCell.from, nextCell.to), scrollIntoView: true });
                 return true;
            }
        } else {
            // Last row, last cell -> Insert new row
            insertRow(view, info);
            return true;
        }
    }
    return false;
}

function handleShiftTab(view: EditorView): boolean {
    const info = getTableInfo(view);
    if (!info) return false;
    const { rows, rowIndex, cellIndex } = info;

    if (cellIndex > 0) {
        // Prev cell in same row
        const prevCell = rows[rowIndex].cells[cellIndex - 1];
        view.dispatch({ selection: EditorSelection.range(prevCell.from, prevCell.to), scrollIntoView: true });
        return true;
    } else {
        // First cell in row
        if (rowIndex > 0) {
            // Prev row
            const prevRow = rows[rowIndex - 1];
            if (prevRow.cells.length > 0) {
                 const prevCell = prevRow.cells[prevRow.cells.length - 1];
                 view.dispatch({ selection: EditorSelection.range(prevCell.from, prevCell.to), scrollIntoView: true });
                 return true;
            }
        }
    }
    return false;
}

function handleEnter(view: EditorView): boolean {
    const info = getTableInfo(view);
    if (!info) return false;
    const { rows, rowIndex, cellIndex } = info;

    if (rowIndex < rows.length - 1) {
        // Next row
        const nextRow = rows[rowIndex + 1];
        // Try to match column index
        const targetCellIndex = Math.min(cellIndex, nextRow.cells.length - 1);
        if (targetCellIndex >= 0) {
            const nextCell = nextRow.cells[targetCellIndex];
            view.dispatch({ selection: EditorSelection.range(nextCell.from, nextCell.to), scrollIntoView: true });
            return true;
        }
    } else {
        // Last row -> Insert new row
        insertRow(view, info);
        return true;
    }
    return false;
}

function insertRow(view: EditorView, info: any) {
    const { tableNode, rows } = info;
    const colCount = rows[0].cells.length; // Assume header defines col count
    
    // Create row string: |   |   | ...
    let rowString = "\n|";
    for (let i = 0; i < colCount; i++) {
        rowString += "   |";
    }
    
    const changes = { from: tableNode.to, insert: rowString };
    view.dispatch({
        changes,
        selection: { anchor: tableNode.to + 3 }, // Position in first cell of new row
        scrollIntoView: true
    });
}
