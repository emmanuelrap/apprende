import { create } from "zustand";
import { supabase } from "../services/supabase";

type Trophy = {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  condition_type: string;
  condition_value: number;
  xp_reward: number;
  earned_at?: string;
};

type Level = {
  level: number;
  xp_required: number;
  title: string;
};

type GamificationStore = {
  trophies: Trophy[];
  userTrophies: Trophy[];
  levels: Level[];
  currentLevel: Level | null;
  nextLevel: Level | null;
  isLoading: boolean;

  fetchTrophies: (userId: string) => Promise<void>;
  fetchLevels: () => Promise<void>;
  checkTrophies: (userId: string) => Promise<void>;
  computeLevel: (xp: number) => void;
  reset: () => void;
};

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  trophies: [],
  userTrophies: [],
  levels: [],
  currentLevel: null,
  nextLevel: null,
  isLoading: false,

  fetchTrophies: async (userId) => {
    set({ isLoading: true });
    try {
      const { data: all } = await supabase.from("trophies").select("*");
      const { data: earned } = await supabase
        .from("user_trophies")
        .select("trophy_id, earned_at")
        .eq("user_id", userId);

      const earnedIds = new Set(earned?.map((e) => e.trophy_id));
      const userTrophies = all?.filter((t) => earnedIds.has(t.id)) ?? [];
      set({ trophies: all ?? [], userTrophies });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLevels: async () => {
    const { data } = await supabase.from("levels").select("*").order("level");
    set({ levels: data ?? [] });
  },

  computeLevel: (xp) => {
    const { levels } = get();
    const current = [...levels].reverse().find((l) => xp >= l.xp_required);
    const next = levels.find((l) => l.xp_required > xp);
    set({ currentLevel: current ?? null, nextLevel: next ?? null });
  },

  checkTrophies: async (userId) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", userId)
      .single();

    const userXp = profile?.xp ?? 0;

    const { data: userBooks } = await supabase
      .from("user_books")
      .select("status")
      .eq("user_id", userId);

    const booksCompleted =
      userBooks?.filter((b) => b.status === "completed").length ?? 0;
    const { data: allTrophies } = await supabase.from("trophies").select("*");
    const { data: earned } = await supabase
      .from("user_trophies")
      .select("trophy_id")
      .eq("user_id", userId);

    const earnedIds = new Set(earned?.map((e) => e.trophy_id));

    for (const trophy of allTrophies ?? []) {
      if (earnedIds.has(trophy.id)) continue;

      let conditionMet = false;
      if (trophy.condition_type === "xp_reached")
        conditionMet = userXp >= trophy.condition_value;
      if (trophy.condition_type === "books_completed")
        conditionMet = booksCompleted >= trophy.condition_value;

      if (conditionMet) {
        await supabase
          .from("user_trophies")
          .insert({ user_id: userId, trophy_id: trophy.id });
        await supabase.from("xp_events").insert({
          user_id: userId,
          amount: trophy.xp_reward,
          source: "trophy",
        });
      }
    }
  },

  reset: () =>
    set({
      trophies: [],
      userTrophies: [],
      currentLevel: null,
      nextLevel: null,
    }),
}));
