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
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", userId)
      .single();
    if (profileError) {
      console.error("[Trophies] Error loading profile xp:", profileError);
      return;
    }

    const userXp = profile?.xp ?? 0;

    const { data: userBooks, error: userBooksError } = await supabase
      .from("user_books")
      .select("status")
      .eq("user_id", userId);
    if (userBooksError) {
      console.error("[Trophies] Error loading user_books:", userBooksError);
      return;
    }

    const booksCompleted =
      userBooks?.filter((b) => b.status === "completed").length ?? 0;

    const { data: allTrophies, error: allTrophiesError } = await supabase
      .from("trophies")
      .select("*");
    if (allTrophiesError) {
      console.error("[Trophies] Error loading trophies:", allTrophiesError);
      return;
    }

    const { data: earned, error: earnedError } = await supabase
      .from("user_trophies")
      .select("trophy_id")
      .eq("user_id", userId);
    if (earnedError) {
      console.error("[Trophies] Error loading earned trophies:", earnedError);
      return;
    }

    const earnedIds = new Set(earned?.map((e) => e.trophy_id));

    for (const trophy of allTrophies ?? []) {
      if (earnedIds.has(trophy.id)) continue;

      const conditionType = String(trophy.condition_type ?? "")
        .trim()
        .toLowerCase();
      let conditionMet = false;
      if (["xp_reached", "xp", "total_xp"].includes(conditionType))
        conditionMet = userXp >= trophy.condition_value;
      if (
        ["books_completed", "book_completed", "completed_books"].includes(
          conditionType,
        )
      )
        conditionMet = booksCompleted >= trophy.condition_value;

      if (!conditionMet) {
        console.log("[Trophies] Condition not met:", {
          trophyId: trophy.id,
          conditionType,
          conditionValue: trophy.condition_value,
          userXp,
          booksCompleted,
        });
      }

      if (conditionMet) {
        const { error: insertUserTrophyError } = await supabase
          .from("user_trophies")
          .insert({ user_id: userId, trophy_id: trophy.id });

        if (insertUserTrophyError) {
          console.error("[Trophies] Error inserting user_trophies:", {
            trophyId: trophy.id,
            error: insertUserTrophyError,
          });
          continue;
        }

        const { error: xpEventError } = await supabase.from("xp_events").insert({
          user_id: userId,
          amount: trophy.xp_reward,
          source: "trophy",
        });

        if (xpEventError) {
          console.error("[Trophies] Error inserting xp event for trophy:", {
            trophyId: trophy.id,
            error: xpEventError,
          });
        }

        console.log("[Trophy Unlocked]", {
          id: trophy.id,
          name: trophy.name,
          description: trophy.description,
          rarity: trophy.rarity,
          icon: trophy.icon,
          xp_reward: trophy.xp_reward,
          condition_type: trophy.condition_type,
          condition_value: trophy.condition_value,
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
