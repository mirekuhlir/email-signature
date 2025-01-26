import { create } from "zustand";
import { SignaturePart } from "@/const/signature-parts";
import { generateRandomId } from "@/utils/generateRandomId";
import { cloneDeep, get as lGet, set as lSet, unset } from "lodash";

// TODO - content type
const getRow = () => {
  return ({
    id: generateRandomId(),
    type: SignaturePart.TEXT,
    style: { backgroundColor: "purple" },
    content: { text: "A" },
  });
};

const getRowTable = () => {
  return ({
    id: generateRandomId(),
    style: { backgroundColor: "purple" },
    columns: [
      {
        id: generateRandomId(),
        rows: [{
          id: generateRandomId(),
          style: { backgroundColor: "red" },
          content: {
            text: "123",
          },
        }],
      },
    ],
  });
};

export interface StoreState {
  rows: any[];
  initRows: (rows: any) => void;
  addRow: (id: string, path: string) => void;
  addRowTable: (position?: "start" | "end") => void;
  removeRow: (id: string) => void;
}

// barvy - rgba nebo hex?

export const useStore = create<StoreState>((set) => ({
  rows: [],
  initRows: (rows: any) => {
    set({ rows });
  },

  //TODO - content type
  addRow: (id: string, path: string) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);

      lSet(cloneRows, path, [
        ...lGet(cloneRows, path),
        // start end, správný obsah v row
        getRow(),
      ]);

      return { rows: cloneRows };
    }),

  addRowTable: (position: "start" | "end" = "end") =>
    set((state) => {
      let clonesRows = cloneDeep(state.rows);

      if (position === "start") {
        clonesRows = [
          getRowTable(),
          ...clonesRows,
        ];

        return { rows: clonesRows };
      }

      clonesRows = [
        ...clonesRows,
        getRowTable(),
      ];

      return { rows: clonesRows };
    }),

  removeRow: (path: string) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);

      unset(cloneRows, path);

      return { rows: cloneRows };
    }),
}));
