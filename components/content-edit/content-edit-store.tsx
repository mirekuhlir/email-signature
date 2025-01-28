import { create } from "zustand";

export interface StoreState {
  currentEdit: any;
  setCurrentEdit: (currentEdit: any) => void;
}

export const useContentEditStore = create<StoreState>((set) => ({
  currentEdit: {},
  setCurrentEdit: (currentEdit: any) =>
    set((state) => {
      return {
        currentEdit: {
          ...state.currentEdit,
          ...currentEdit,
        },
      };
    }),
}));
