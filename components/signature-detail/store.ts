import { create } from "zustand";
import { signature_a } from "@/templates/signature_a";
import { SignaturePart } from "@/const/signature-parts";
import { generateRandomId } from "@/utils/generateRandomId";

// TODO - obsah
const getRow = () => {
  return ({
    id: generateRandomId(),
    style: { backgroundColor: "purple" },
    columns: [
      {
        id: generateRandomId(),
        style: {
          verticalAlign: "top",
        },
        content: { text: "A" },
      },
      {
        id: generateRandomId(),
        rows: [{
          id: generateRandomId(),
          style: { backgroundColor: "red" },
          content: {
            text: "123",
          },
        }, {
          id: generateRandomId(),
          content: {
            text: "124",
          },
        }],
      },
    ],
  });
};

export interface StoreState {
  rows: any[];
  initRows: (rows: any) => void;
  addRow: (path?: string, position?: "start" | "end") => void;
  removeRow: (id: string) => void;
}

// barvy - rgba nebo hex?

export const useStore = create<StoreState>((set) => ({
  rows: [],
  initRows: (rows: any) => {
    set({ rows });
  },
  addRow: (id?: string, position: "start" | "end" = "end") =>
    set((state) => {
      const updatedState = JSON.parse(JSON.stringify(state));

      if (!id) {
        if (position === "start") {
          updatedState.rows = [
            getRow(),
            ...updatedState.rows,
          ];

          return { rows: updatedState.rows };
        }

        updatedState.rows = [
          ...updatedState.rows,
          getRow(),
        ];

        return { rows: updatedState.rows };
      }

      const traverse = (items: any, targetId: string): boolean => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          if (item.id === targetId && Array.isArray(item.rows)) {
            // TODO - start a end
            // TODO - správný obsah
            item.rows = [...item.rows, getRow()];

            return true;
          }

          if (item.rows && traverse(item.rows, targetId)) {
            return true;
          }
          if (item.columns && traverse(item.columns, targetId)) {
            return true;
          }
        }
        return false;
      };

      traverse(updatedState.rows, id);

      return { rows: updatedState.rows };
    }),
  removeRow: (id: string) =>
    set((state) => {
      const updatedState = JSON.parse(JSON.stringify(state));
      const removeRowRecursive = (items: any[]): any[] => {
        return items.filter((item) => {
          if (item.id === id) return false;

          if (item.rows) {
            item.rows = removeRowRecursive(item.rows);
          }

          if (item.columns) {
            item.columns = removeRowRecursive(item.columns);
          }

          return true;
        });
      };

      updatedState.rows = removeRowRecursive(updatedState.rows);
      return { rows: updatedState.rows };
    }),
}));
