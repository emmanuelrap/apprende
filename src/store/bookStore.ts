import { create } from "zustand";
import { getBooksWithProgress } from "../services/books";
import { useAuthStore } from "./authStore";

type BookCategory = {
  id: string;
  name: string;
  slug: string;
};

type BookTag = {
  id: string;
  name: string;
  slug: string;
};

type BookStatus = "new" | "reading" | "completed" | "paused";

type Book = {
  id: string;
  title: string;
  author: string;
  cover: string | null;
  difficulty: number;
  xp: number;
  estimatedMinutes: number | null;
  totalPages: number;
  categories: BookCategory[];
  tags: BookTag[];
  progress: number;
  currentPage: number;
  status: BookStatus;
  startedAt: string | null;
  completedAt: string | null;
};

type BookFilters = {
  tagId?: string | null;
  categoryIds?: string[];
  search?: string;
};

type BookStore = {
  books: Book[];
  selectedBook: Book | null;
  isLoading: boolean;
  error: string | null;
  fetchBooks: (filters?: BookFilters) => Promise<void>;
  selectBook: (book: Book) => void;
  reset: () => void;
};

export const useBookStore = create<BookStore>((set) => ({
  books: [],
  selectedBook: null,
  isLoading: false,
  error: null,

  fetchBooks: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        set({ books: [] });
        return;
      }

      const books = await getBooksWithProgress(userId, filters);
      set({ books });
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
