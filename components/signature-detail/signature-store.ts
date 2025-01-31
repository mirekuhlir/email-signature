import { create } from "zustand";
import { ContentType } from "@/const/content";
import { generateRandomId } from "@/utils/generateRandomId";
import { cloneDeep, get as lGet, set as lSet, unset } from "lodash";

// TODO - někam do util?

const getText = () => {
  return {
    id: generateRandomId(),
    type: ContentType.TEXT,
    style: { backgroundColor: "purple" },
    content: {
      // TODO - pryč type z content
      type: ContentType.TEXT,
      text: "A",
    },
  };
};

const getContentAdd = (type: ContentType) => {
  switch (type) {
    case ContentType.TEXT:
      return getText();
    default:
      return getText();
  }
};

const getRowTable = (type?: ContentType) => {
  return ({
    id: generateRandomId(),
    style: { backgroundColor: "purple" },
    columns: [
      {
        id: generateRandomId(),
        // TODO
        rows: [getContentAdd(type as ContentType)],
      },
    ],
  });
};

export interface StoreState {
  rows: any[];
  initRows: (rows: any) => void;
  addRow: (path: string, type: ContentType) => void;
  addRowTable: (position?: "start" | "end", type?: ContentType) => void;
  removeRow: (id: string) => void;
  setContent: (path: string, content: any) => void;
}

// barvy - rgba nebo hex?

export const useSignatureStore = create<StoreState>((set) => ({
  rows: [],
  initRows: (rows: any) => {
    set({ rows });
  },

  //TODO - content type
  addRow: (path: string, type: ContentType) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);

      lSet(cloneRows, path, [
        ...lGet(cloneRows, path),
        // start end, správný obsah v row
        getContentAdd(type),
      ]);

      return { rows: cloneRows };
    }),

  addRowTable: (position: "start" | "end" = "end", type?: ContentType) =>
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

  removeRow: (path: string) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);
      const tableIndex = parseInt(path.split(".")[0].replace(/[\[\]]/g, ""));

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

      return { rows: cloneRows };
    }),
  setContent: (path: string, content: any) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);
      const currentContent = lGet(cloneRows, path);

      lSet(cloneRows, path, {
        ...currentContent,
        ...content,
      });

      return { rows: cloneRows };
    }),
}));
