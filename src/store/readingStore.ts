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
};

type ReaderInit = {
  totalPages: number;
  bookXp: number;
  bookTitle: string;
  xpBefore: number;
};

type ReadingStore = {
  userBooks: UserBook[];
  currentPage: number;
  currentContent: { es: string; en: string; fr: string } | null;
  isLoading: boolean;
  sessions: ReadingSession[];

  fetchSessions: (userId: string) => Promise<void>;
  fetchUserBooks: (userId: string) => Promise<void>;
  fetchPageContent: (bookId: string, pageNumber: number) => Promise<void>;
  saveSession: (
    userId: string,
    bookId: string,
    minutes: number,
    pages: number,
    xp: number,
  ) => Promise<void>;
  initReader: (bookId: string, userId: string) => Promise<ReaderInit>;
  saveProgress: (
    userId: string,
    bookId: string,
    pageNumber: number,
    totalPages: number,
  ) => Promise<void>;
  finishBook: (
    userId: string,
    bookId: string,
    bookXp: number,
    startTime: number,
    pagesRead: number,
  ) => Promise<void>;
  getPage: (
    bookId: string,
    pageNumber: number,
  ) => Promise<{
    id: string;
    pageNumber: number;
    contentEs: string;
    contentEn: string;
    contentFr: string;
  } | null>;
  reset: () => void;
};

export const useReadingStore = create<ReadingStore>((set) => ({
  userBooks: [],
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
    } catch (e) {
      console.error("[Reading] Error fetching user books:", e);
    } finally {
      set({ isLoading: false });
    }
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
      const fr = content?.find((c) => c.language === "fr")?.content ?? "";
      set({ currentContent: { es, en, fr }, currentPage: pageNumber });
    } catch (e) {
      console.error("[Reading] Error fetching page content:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  saveSession: async (userId, bookId, minutes, pages, xp) => {
    try {
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
      const { data: profile } = await supabase
        .from("profiles").select("xp").eq("id", userId).single();
      if (profile) {
        await supabase.from("profiles").update({ xp: profile.xp + xp }).eq("id", userId);
      }
    } catch (e) {
      console.error("[Reading] Error saving session:", e);
    }
  },

  initReader: async (bookId, userId) => {
    try {
      const [{ count }, { data: book }, { data: profile }] = await Promise.all([
        supabase
          .from("book_pages")
          .select("*", { count: "exact", head: true })
          .eq("book_id", bookId),
        supabase
          .from("books")
          .select("title, xp_base, difficulty")
          .eq("id", bookId)
          .single(),
        supabase.from("profiles").select("xp").eq("id", userId).single(),
      ]);

      return {
        totalPages: count ?? 0,
        bookXp: (book?.xp_base ?? 10) * (book?.difficulty ?? 1),
        bookTitle: book?.title ?? "",
        xpBefore: profile?.xp ?? 0,
      };
    } catch (e) {
      console.error("[Reading] Error initializing reader:", e);
      return { totalPages: 0, bookXp: 0, bookTitle: "", xpBefore: 0 };
    }
  },

  getBookLanguages: async (bookId: string) => {
    const { data: pages } = await supabase
      .from("book_pages")
      .select("id")
      .eq("book_id", bookId);
    if (!pages || pages.length === 0) return [];
    const { data } = await supabase
      .from("page_content")
      .select("language")
      .in("page_id", pages.map((p) => p.id));
    if (!data) return [];
    return [...new Set(data.map((d) => d.language))] as string[];
  },

  saveProgress: async (userId, bookId, pageNumber, totalPages) => {
    try {
      await supabase.from("user_books").upsert(
        {
          user_id: userId,
          book_id: bookId,
          current_page: pageNumber,
          progress:
            totalPages > 0 ? Math.round((pageNumber / totalPages) * 100) : 0,
          status: "reading",
        },
        { onConflict: "user_id,book_id" },
      );
    } catch (e) {
      console.error("[Reading] Error saving progress:", e);
    }
  },

  finishBook: async (userId, bookId, bookXp, startTime, pagesRead) => {
    try {
      await supabase.from("user_books").upsert(
        {
          user_id: userId,
          book_id: bookId,
          current_page: 0,
          status: "completed",
          progress: 100,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,book_id" },
      );

      await supabase.from("reading_sessions").insert({
        user_id: userId,
        book_id: bookId,
        minutes: Math.floor((Date.now() - startTime) / 60000),
        pages: pagesRead,
        xp: bookXp,
      });

      await supabase.from("xp_events").insert({
        user_id: userId,
        amount: bookXp,
        source: "book_completed",
        reference_id: bookId,
      });
      const { data: profile } = await supabase
        .from("profiles").select("xp").eq("id", userId).single();
      if (profile) {
        await supabase.from("profiles").update({ xp: profile.xp + bookXp }).eq("id", userId);
      }
    } catch (e) {
      console.error("[Reading] Error finishing book:", e);
    }
  },

  getPage: async (bookId, pageNumber) => {
    const { data, error } = await supabase
      .from("book_pages")
      .select(`id, page_number, page_content (content, language)`)
      .eq("book_id", bookId)
      .eq("page_number", pageNumber)
      .single();

    if (error || !data) return null;

    const getContent = (lang: string) =>
      (data.page_content as any[])?.find((c) => c.language === lang)?.content ??
      "";

    return {
      id: data.id,
      pageNumber: data.page_number,
      contentEs: getContent("es"),
      contentEn: getContent("en"),
      contentFr: getContent("fr"),
    };
  },

  reset: () =>
    set({
      userBooks: [],
      currentPage: 1,
      currentContent: null,
      sessions: [],
      isLoading: false,
    }),
}));
