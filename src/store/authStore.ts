import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../services/supabase";
import { useGamificationStore } from "./gamificationStore";
import { usePrefsStore } from "./prefsStore";
import { useReadingStore } from "./readingStore";
import { useVocabularyStore } from "./vocabularyStore";

type Profile = {
  name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
};

type XpEvent = {
  id: string;
  amount: number;
  source: string;
  created_at: string;
};

type AuthStore = {
  user: User | null;
  profile: Profile | null;
  xpEvents: XpEvent[];
  isLoading: boolean;
  error: string | null;

  init: () => Promise<void>;
  refreshProfile: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
  clearMyData: () => Promise<void>;
  reset: () => void;
  setLoadingDone: () => void;
  fetchXpEvents: (userId: string) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  xpEvents: [],
  isLoading: true,
  error: null,

  refreshProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("name, avatar_url, xp, level")
      .eq("id", userId)
      .single();
    if (!error && data) set({ profile: data });
  },

  init: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data.user) {
        set({ user: null, profile: null, isLoading: false });
        return;
      }

      const user = data.user;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, avatar_url, xp, level")
        .eq("id", user.id)
        .single();

      if (profileError) {
        set({ user, profile: null, isLoading: false });
        return;
      }

      set({ user, profile: profileData, isLoading: false });
    } catch {
      set({
        error: "Error al cargar autenticación",
        user: null,
        profile: null,
        isLoading: false,
      });
    }
  },

  fetchXpEvents: async (userId) => {
    const { data, error } = await supabase
      .from("xp_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return;
    set({ xpEvents: data ?? [] });
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignorar error de logout
    }
    set({ user: null, profile: null, xpEvents: [], error: null });
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
    usePrefsStore.persist.clearStorage();
    useReadingStore.getState().reset();
    useVocabularyStore.getState().reset();
    set((state) => ({
      ...state,
      xpEvents: [],
      profile: state.profile ? { ...state.profile, xp: 0 } : state.profile,
    }));
  },

  reset: () =>
    set({
      user: null,
      profile: null,
      xpEvents: [],
      error: null,
      isLoading: false,
    }),

  setLoadingDone: () => set({ isLoading: false }),
}));
