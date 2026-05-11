import { create } from "zustand";
import { supabase } from "../services/supabase";

type Profile = {
  name: string;
  avatar_url: string | null;
  xp: number;
};

type AuthStore = {
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;

  init: () => Promise<void>;
  logout: () => Promise<void>;
  reset: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
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

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  reset: () => set({ user: null, profile: null, isLoading: false }),
}));
