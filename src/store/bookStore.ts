import { create } from "zustand";
import { supabase } from "../services/supabase";

type Book = {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  difficulty: number;
  total_pages: number;
  xp_base: number;
  categories: string[];
  tags: string[];
};

type BookStore = {
  books: Book[];
  selectedBook: Book | null;
  isLoading: boolean;
  error: string | null;

  fetchBooks: () => Promise<void>;
  selectBook: (book: Book) => void;
  reset: () => void;
};

export const useBookStore = create<BookStore>((set) => ({
  books: [],
  selectedBook: null,
  isLoading: false,
  error: null,

  fetchBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await supabase.from("books").select(`
          *,
          categories:book_categories(category:categories(name)),
          tags:book_tag_relations(tag:book_tags(name))
        `);
      set({ books: data ?? [] });
    } catch {
      set({ error: "Error cargando libros" });
    } finally {
      set({ isLoading: false });
    }
  },

  selectBook: (book) => set({ selectedBook: book }),

  reset: () =>
    set({ books: [], selectedBook: null, isLoading: false, error: null }),
}));
