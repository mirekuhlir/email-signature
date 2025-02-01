import { create } from "zustand";

export interface StoreState {
  //TODO -  přejmenovat a otypovat
  currentEdit: any;
  setContentEdit: (currentEdit: any) => void;
}

export const useContentEditStore = create<StoreState>((set) => ({
  currentEdit: {},
  setContentEdit: (currentEdit: any) =>
    set((state) => {
      return {
        currentEdit: {
          ...state.currentEdit,
          ...currentEdit,
        },
      };
    }),
}));
