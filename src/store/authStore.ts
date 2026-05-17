import { create } from "zustand";
import { supabase } from "../services/supabase";
import { useGamificationStore } from "./gamificationStore";
import { useReadingStore } from "./readingStore";
import { useVocabularyStore } from "./vocabularyStore";

type Profile = {
  name: string;
  avatar_url: string | null;
  xp: number;
};

type XpEvent = {
  id: string;
  amount: number;
  source: string;
  created_at: string;
};

type AuthStore = {
  user: any | null;
  profile: Profile | null;
  xpEvents: XpEvent[];
  isLoading: boolean;

  init: () => Promise<void>;
  logout: () => Promise<void>;
  clearMyData: () => Promise<void>;
  reset: () => void;
  fetchXpEvents: (userId: string) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  xpEvents: [],
  isLoading: true,

  init: async () => {
    set({ isLoading: true });
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      set({ user: null, profile: null, isLoading: false });
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("name, avatar_url, xp")
      .eq("id", user.id)
      .single();

    set({ user, profile: profileData ?? null, isLoading: false });
  },

  fetchXpEvents: async (userId) => {
    const { data } = await supabase
      .from("xp_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    set({ xpEvents: data ?? [] });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, xpEvents: [] });
  },

  clearMyData: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const operations = [
      supabase.from("user_trophies").delete().eq("user_id", userId),
      supabase.from("reading_sessions").delete().eq("user_id", userId),
      supabase.from("user_books").delete().eq("user_id", userId),
      supabase.from("xp_events").delete().eq("user_id", userId),
      supabase.from("review_items").delete().eq("user_id", userId),
    ];

    const results = await Promise.all(operations);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ xp: 0 })
      .eq("id", userId);

    if (profileError) throw profileError;

    useGamificationStore.getState().reset();
    useReadingStore.getState().reset();
    useVocabularyStore.getState().reset();
    set((state) => ({
      ...state,
      xpEvents: [],
      profile: state.profile ? { ...state.profile, xp: 0 } : state.profile,
    }));
  },

  reset: () =>
    set({ user: null, profile: null, xpEvents: [], isLoading: false }),
}));
