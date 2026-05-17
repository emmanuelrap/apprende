import { create } from "zustand";
import { supabase } from "../services/supabase";

type UserBook = {
  id: string;
  book_id: string;
  current_page: number;
  progress: number;
  status: "reading" | "completed" | "paused";
};

type ReadingSession = {
  id: string;
  book_id: string;
  minutes: number;
  pages: number;
  xp: number;
  created_at: string;
  books?: { title: string };
  reset: () => void;
};

type ReadingStore = {
  userBooks: UserBook[];
  currentReading: UserBook | null;
  currentPage: number;
  currentContent: { es: string; en: string } | null;
  isLoading: boolean;
  sessions: ReadingSession[];

  fetchSessions: (userId: string) => Promise<void>;
  fetchUserBooks: (userId: string) => Promise<void>;
  startBook: (userId: string, bookId: string) => Promise<void>;
  updateProgress: (
    userBookId: string,
    page: number,
    totalPages: number,
  ) => Promise<void>;
  fetchPageContent: (bookId: string, pageNumber: number) => Promise<void>;
  saveSession: (
    userId: string,
    bookId: string,
    minutes: number,
    pages: number,
    xp: number,
  ) => Promise<void>;
  reset: () => void;
};

export const useReadingStore = create<ReadingStore>((set, get) => ({
  userBooks: [],
  currentReading: null,
  currentPage: 1,
  currentContent: null,
  isLoading: false,
  sessions: [],

  fetchSessions: async (userId) => {
    const { data } = await supabase
      .from("reading_sessions")
      .select("*, books(title)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    set({ sessions: data ?? [] });
  },

  fetchUserBooks: async (userId) => {
    set({ isLoading: true });
    try {
      const { data } = await supabase
        .from("user_books")
        .select("*")
        .eq("user_id", userId);
      set({ userBooks: data ?? [] });
    } finally {
      set({ isLoading: false });
    }
  },

  startBook: async (userId, bookId) => {
    const { data } = await supabase
      .from("user_books")
      .upsert({ user_id: userId, book_id: bookId, status: "reading" })
      .select()
      .single();
    set({ currentReading: data });
  },

  updateProgress: async (userBookId, page, totalPages) => {
    const progress = Math.round((page / totalPages) * 100);
    await supabase
      .from("user_books")
      .update({ current_page: page, progress })
      .eq("id", userBookId);
    set({ currentPage: page });
  },

  fetchPageContent: async (bookId, pageNumber) => {
    set({ isLoading: true });
    try {
      const { data: pageData } = await supabase
        .from("book_pages")
        .select("id")
        .eq("book_id", bookId)
        .eq("page_number", pageNumber)
        .single();

      if (!pageData) return;

      const { data: content } = await supabase
        .from("page_content")
        .select("language, content")
        .eq("page_id", pageData.id);

      const es = content?.find((c) => c.language === "es")?.content ?? "";
      const en = content?.find((c) => c.language === "en")?.content ?? "";
      set({ currentContent: { es, en }, currentPage: pageNumber });
    } finally {
      set({ isLoading: false });
    }
  },

  saveSession: async (userId, bookId, minutes, pages, xp) => {
    await supabase.from("reading_sessions").insert({
      user_id: userId,
      book_id: bookId,
      minutes,
      pages,
      xp,
    });
    await supabase.from("xp_events").insert({
      user_id: userId,
      amount: xp,
      source: "reading",
    });
  },
  reset: () =>
    set({
      userBooks: [],
      currentReading: null,
      currentPage: 1,
      currentContent: null,
      sessions: [],
      isLoading: false,
    }),
}));
