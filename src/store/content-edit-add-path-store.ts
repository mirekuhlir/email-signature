import { create } from "zustand";

interface ContentEdit {
  editPath?: string | null;
  addPath?: string | null;
  nextEditPath?: string | null;
  position?: "start" | "end" | null;
  subEdit?: string | null;
  isImageLoading?: boolean;
  columnPath?: string | null;
}

export interface StoreState {
  contentEdit: ContentEdit;
  editingSectionIds: string[];
  setContentEdit: (contentEdit: ContentEdit) => void;
  addEditingSectionId: (id: string) => void;
  removeEditingSectionId: (id: string) => void;
}

export const useContentEditStore = create<StoreState>((set) => ({
  contentEdit: {
    // currently editing
    editPath: null,
    // new content
    addPath: null,
    // open edit after add content
    nextEditPath: null,
    position: null,
    subEdit: null,
    isImageLoading: false,
    columnPath: null,
  },
  editingSectionIds: [],
  setContentEdit: (edit: ContentEdit) =>
    set((state) => {
      return {
        contentEdit: {
          ...state.contentEdit,
          ...edit,
        },
      };
    }),
  addEditingSectionId: (id: string) =>
    set((state) => ({
      editingSectionIds: [...state.editingSectionIds, id],
    })),
  removeEditingSectionId: (id: string) =>
    set((state) => {
      const index = state.editingSectionIds.indexOf(id);
      if (index === -1) {
        return state; // ID not found, return original state
      }
      // Create a new array without the element at the found index
      const newEditingSectionIds = [
        ...state.editingSectionIds.slice(0, index),
        ...state.editingSectionIds.slice(index + 1),
      ];
      return { editingSectionIds: newEditingSectionIds };
    }),
}));
