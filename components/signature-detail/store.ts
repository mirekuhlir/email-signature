import { create } from "zustand";
import { traversePath, updatePaths,incrementLastNumber } from "./utils";
import { signature_a } from "@/templates/signature_a";
import { SignaturePart } from "@/const/signature-parts";

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

  
   // TODO - rozlišit přidání na začátek a na konec 
  addRow: (path: string) =>
    set((state) => {

      const updatedState = JSON.parse(JSON.stringify(state))


      const traverse = (items : any, targetPath: string): boolean => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          
          if (item.path === targetPath && Array.isArray(item.rows)) {
            console.warn("item.rows", item.rows)
            const lastRow = item.rows[item.rows.length - 1]

            item.rows  = [...item.rows,{
              style: {},
              path: incrementLastNumber(lastRow.path),
              columns: [
                // TODO - taky přidat path?
                {
                 // TODO - funkce a parametr na type 
                type: SignaturePart.TEXT,
                  content: { text: "My text" },
                },
              ],
            }] 

            return true
          }
          
          if (item.rows && traverse(item.rows, targetPath)) {
            return true
          }
          if (item.columns && traverse(item.columns, targetPath)) {
            return true
          }
        }
        return false
      }
    
      traverse(updatedState.rows, path)
      return {rows : updatedState.rows};

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
