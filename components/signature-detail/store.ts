
import { create } from "zustand";
import { traversePath, updatePaths } from "./utils";
import { signature_a } from "@/templates/signature_a";

export interface StoreState {
    rows: any[];
    addRow: (path: string) => void;
    addColumn: (path: string) => void;
    removeColumn: (path: string) => void;
    removeRow: (path: string) => void;
    /*   addItem: (path: string) => void;
    removeItem: (path: string) => void; */
  }
  
  // barvy - rgba nebo hex?
  
  export const useStore = create<StoreState>((set) => ({
    rows: signature_a,
    setContent: (path: string, content: any) =>
      set((state) => {
        const newRows = [...state.rows];
        const target = traversePath(newRows, path);
        const lastIndex = parseInt(path.split(".").pop() || "0");
  
        if (target.columns) {
          target.columns[lastIndex].content = content;
        }
  
        return { rows: newRows };
      }),
  
    setStyle: (path: string, style: any) =>
      set((state) => {
        const newRows = [...state.rows];
        const target = traversePath(newRows, path);
        const lastIndex = parseInt(path.split(".").pop() || "0");
  
        if (target.columns) {
          target.columns[lastIndex].style = {
            ...target.columns[lastIndex].style,
            ...style,
          };
        } else if (target.rows) {
          target.rows[lastIndex].style = {
            ...target.rows[lastIndex].style,
            ...style,
          };
        }
  
        return { rows: newRows };
      }),
  
    addRow: (path: string) =>
      set((state) => {
        const newRows = [...state.rows];
        const target = traversePath(newRows, path);
        const newRow = {
          path: "",
          style: {},
          columns: [
            {
              path: "",
              content: { text: "New" },
              style: {},
            },
          ],
        };
  
        if (path === "-1") {
          // Add at the beginning
          newRows.unshift(newRow);
        } else if (path === String(newRows.length)) {
          // Add at the end
          newRows.push(newRow);
        } else if (target.rows) {
          target.rows.push(newRow);
        } else if (target.columns) {
          // Adding a row inside an empty column
          const lastIndex = parseInt(path.split(".").pop() || "0");
          target.columns[lastIndex].rows = [newRow];
        }
  
        return { rows: updatePaths(newRows) };
      }),
  
    removeRow: (path: string) =>
      set((state) => {
        const newRows = [...state.rows];
        const parts = path.split(".");
        const lastIndex = parseInt(parts.pop() || "0");
        const target = traversePath(newRows, parts.join("."));
  
        if (target.rows) {
          target.rows.splice(lastIndex, 1);
        }
  
        return { rows: updatePaths(newRows) };
      }),
  
    addColumn: (path: string) =>
      set((state) => {
        const newRows = [...state.rows];
        const target = traversePath(newRows, path);
        const lastIndex = parseInt(path.split(".").pop() || "0");
  
        const newColumn = {
          path: "",
          content: { text: "New Column" },
          style: {},
        };
  
        if (target.columns) {
          target.columns.push(newColumn);
        } else if (target.rows) {
          target.rows[lastIndex].columns.push(newColumn);
        }
  
        return { rows: updatePaths(newRows) };
      }),
  
    removeColumn: (path: string) =>
      set((state) => {
        const newRows = [...state.rows];
        const parts = path.split(".");
        const lastIndex = parseInt(parts.pop() || "0");
        const target = traversePath(newRows, parts.join("."));
  
        if (target.columns && target.columns.length > 1) {
          target.columns.splice(lastIndex, 1);
        }
  
        return { rows: updatePaths(newRows) };
      }),
  }));