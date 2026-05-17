import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PrefsStore = {
  nativeLanguage: string | null;
  targetLanguage: string | null;
  interests: string[]; // category ids
  setLanguages: (native: string, target: string) => void;
  setInterests: (categoryIds: string[]) => void;
};

export const usePrefsStore = create<PrefsStore>()(
  persist(
    (set) => ({
      nativeLanguage: null,
      targetLanguage: null,
      interests: [],
      setLanguages: (native, target) =>
        set({ nativeLanguage: native, targetLanguage: target }),
      setInterests: (categoryIds) => set({ interests: categoryIds }),
    }),
    {
      name: "user-prefs",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
