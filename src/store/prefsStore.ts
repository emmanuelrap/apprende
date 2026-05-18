import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PrefsStore = {
  nativeLanguage: string | null;
  interests: string[]; // category ids
  setNativeLanguage: (lang: string) => void;
  setInterests: (categoryIds: string[]) => void;
};

export const usePrefsStore = create<PrefsStore>()(
  persist(
    (set) => ({
      nativeLanguage: null,
      interests: [],
      setNativeLanguage: (lang) => set({ nativeLanguage: lang }),
      setInterests: (categoryIds) => set({ interests: categoryIds }),
    }),
    {
      name: "user-prefs",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
