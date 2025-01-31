import { create } from "zustand";

export interface StoreState {
  //TODO -  přejmenovat a otypovat
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
