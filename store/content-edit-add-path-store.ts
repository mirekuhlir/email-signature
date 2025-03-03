import { create } from "zustand";

interface ContentEdit {
  editPath?: string | null;
  addPath?: string | null;
  nextEditPath?: string | null;
  position?: "start" | "end" | null;
  subEdit?: string | null;
  isImageLoading?: boolean;
}

export interface StoreState {
  contentEdit: ContentEdit;
  setContentEdit: (contentEdit: ContentEdit) => void;
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
  },
  setContentEdit: (edit: ContentEdit) =>
    set((state) => {
      return {
        contentEdit: {
          ...state.contentEdit,
          ...edit,
        },
      };
    }),
}));
