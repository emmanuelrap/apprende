import { create } from "zustand";
import { supabase } from "../services/supabase";

type ReviewItem = {
  id: string;
  type: "word" | "sentence";
  content: string;
  translation: string | null;
  context: string | null;
  mastery: number;
  next_review_at: string | null;
  review_count: number;
};

type VocabularyStore = {
  reviewItems: ReviewItem[];
  isLoading: boolean;

  fetchReviewItems: (userId: string) => Promise<void>;
  addItem: (
    userId: string,
    item: Omit<
      ReviewItem,
      "id" | "mastery" | "review_count" | "next_review_at"
    > & { book_id: string; page_id: string },
  ) => Promise<void>;
  updateMastery: (itemId: string, mastery: number) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  reset: () => void;
};

export const useVocabularyStore = create<VocabularyStore>((set) => ({
  reviewItems: [],
  isLoading: false,

  fetchReviewItems: async (userId) => {
    set({ isLoading: true });
    try {
      const { data } = await supabase
        .from("review_items")
        .select("*")
        .eq("user_id", userId)
        .order("next_review_at", { ascending: true });
      set({ reviewItems: data ?? [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (userId, item) => {
    const { data } = await supabase
      .from("review_items")
      .insert({ user_id: userId, ...item })
      .select()
      .single();
    set((state) => ({ reviewItems: [data, ...state.reviewItems] }));
  },

  updateMastery: async (itemId, mastery) => {
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + ([1, 3, 7][mastery] ?? 7));

    const { data: current } = await supabase
      .from("review_items")
      .select("review_count")
      .eq("id", itemId)
      .single();

    await supabase
      .from("review_items")
      .update({
        mastery,
        next_review_at: nextReview.toISOString(),
        review_count: (current?.review_count ?? 0) + 1,
      })
      .eq("id", itemId);

    set((state) => ({
      reviewItems: state.reviewItems.map((i) =>
        i.id === itemId
          ? { ...i, mastery, review_count: (i.review_count ?? 0) + 1 }
          : i,
      ),
    }));
  },

  deleteItem: async (itemId) => {
    await supabase.from("review_items").delete().eq("id", itemId);
    set((state) => ({
      reviewItems: state.reviewItems.filter((i) => i.id !== itemId),
    }));
  },

  reset: () => set({ reviewItems: [], isLoading: false }),
}));
