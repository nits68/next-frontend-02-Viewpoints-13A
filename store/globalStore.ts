import { create } from "zustand";

type GlobalStateData = {
  numberOfRecords: number;
  numberOfPages: number;
  actualPage: number;
  searchTerm: string;
};

type GlobalStore = {
  gs: GlobalStateData;
  set: <K extends keyof GlobalStateData>(key: K, value: GlobalStateData[K]) => void;
};

export const useGlobalStore = create<GlobalStore>()((set) => ({
  gs: {
    numberOfRecords: 0,
    numberOfPages: 0,
    actualPage: 0,
    searchTerm: "panoráma",
  },

  set: (key, value) =>
    set((state) => ({
      gs: {
        ...state.gs,
        [key]: value,
      },
    })),
}));
