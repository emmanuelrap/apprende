import { create } from "zustand";
import { supabase } from "../services/supabase";

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

  reset: () =>
    set({ user: null, profile: null, xpEvents: [], isLoading: false }),
}));
