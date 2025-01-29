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
      type: ContentType.TEXT,
      text: "A",
    },
  }
};

const getContentAdd = (type: ContentType) => {
  switch (type) {
    case ContentType.TEXT:
      return getText();
    default:
      return getText();
  }
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
            type: ContentType.TEXT,
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
  addRow: ( path: string, type: ContentType) => void;
  addRowTable: (position?: "start" | "end") => void;
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
