import type { Theme } from "@/src/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AppSettings = {
  fontSize: number;
  theme: Theme;
};

type PrefsStore = {
  nativeLanguage: string | null;
  interests: string[];
  appSettings: AppSettings;
  setNativeLanguage: (lang: string) => void;
  setInterests: (categoryIds: string[]) => void;
  setAppSettings: (settings: Partial<AppSettings>) => void;
};

export const usePrefsStore = create<PrefsStore>()(
  persist(
    (set) => ({
      nativeLanguage: null,
      interests: [],
      appSettings: { fontSize: 16, theme: "light" },
      setNativeLanguage: (lang) => set({ nativeLanguage: lang }),
      setInterests: (categoryIds) => set({ interests: categoryIds }),
      setAppSettings: (settings) =>
        set((state) => ({
          appSettings: { ...state.appSettings, ...settings },
        })),
    }),
    {
      name: "user-prefs",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
