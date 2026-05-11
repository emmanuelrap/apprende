import { create } from "zustand";
import { supabase } from "../services/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type FilterStore = {
  categories: Category[];
  tags: Tag[];
  isLoading: boolean;

  fetchFilters: () => Promise<void>;
};

export const useFilterStore = create<FilterStore>((set) => ({
  categories: [],
  tags: [],
  isLoading: false,

  fetchFilters: async () => {
    set({ isLoading: true });
    try {
      const [{ data: categories }, { data: tags }] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("book_tags").select("*"),
      ]);
      set({ categories: categories ?? [], tags: tags ?? [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
