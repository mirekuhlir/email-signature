/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { ContentType } from "@/const/content";
import { cloneDeep, get as lGet, set as lSet } from "lodash";
import {
  getContentAdd,
  getRowTable,
} from "@/components/signature-detail/content-add/utils";

export interface StoreState {
  rows: any[];
  initRows: (rows: any) => void;
  addRow: (path: string, type: ContentType) => void;
  addRowTable: (position: "start" | "end", type: ContentType) => void;
  removeRow: (path: string, onRemoveRow?: (rows: any) => void) => void;
  setContent: (path: string, content: any) => void;
}

// barvy - rgba nebo hex?

export const useSignatureStore = create<StoreState>((set) => ({
  rows: [],
  initRows: (rows: any) => {
    set({ rows });
  },

  addRow: (path: string, type: ContentType) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);

      lSet(cloneRows, path, [
        ...lGet(cloneRows, path),
        getContentAdd(type),
      ]);

      return { rows: cloneRows };
    }),

  addRowTable: (position: "start" | "end" = "end", type: ContentType) =>
    set((state) => {
      let clonesRows = cloneDeep(state.rows);

      if (position === "start") {
        clonesRows = [
          getRowTable(type),
          ...clonesRows,
        ];

        return { rows: clonesRows };
      }

      clonesRows = [
        ...clonesRows,
        getRowTable(type),
      ];

      return { rows: clonesRows };
    }),

  removeRow: (path: string, onRemoveRow?: (rows: any) => void) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);
      const tableIndex = parseInt(path.split(".")[0].replace(/[[\]]/g, ""));

      const columnIndex = parseInt(path.split("columns[")[1].split("]")[0]);

      const columnsLength = cloneRows[tableIndex].columns.length;
      const rowsLength = cloneRows[tableIndex].columns[columnIndex].rows.length;

      if (columnsLength === 1 && rowsLength === 1) {
        // Remove entire table object
        cloneRows.splice(tableIndex, 1);
      } else {
        // Remove just the specific row
        const rowIndex = parseInt(path.split("rows[")[1].split("]")[0]);
        const rows = cloneRows[tableIndex].columns[columnIndex].rows;
        cloneRows[tableIndex].columns[columnIndex].rows = rows.filter((
          _: any,
          index: number,
        ) => index !== rowIndex);
      }

      onRemoveRow?.(cloneRows);

      return { rows: cloneRows };
    }),

  setContent: (path: string, content: any) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);
      const currentContent = lGet(cloneRows, path);

      if (content instanceof File) {
        lSet(cloneRows, path, content);
        return { rows: cloneRows };
      } else if (typeof content === "string") {
        lSet(cloneRows, path, content);
      } else if (typeof content === "object") {
        lSet(cloneRows, path, {
          ...currentContent,
          ...content,
        });
      } else {
        lSet(cloneRows, path, content);
      }
      return { rows: cloneRows };
    }),
}));
