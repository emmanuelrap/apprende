import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useGamificationStore } from "../store/gamificationStore";
import { useReadingStore } from "../store/readingStore";

export function useProfileBootstrap() {
  const userId = useAuthStore((state) => state.user?.id);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;

      let active = true;

      const run = async () => {
        setLoading(true);
        try {
          await Promise.all([
            useReadingStore.getState().fetchUserBooks(userId),
            useReadingStore.getState().fetchSessions(userId),
            useAuthStore.getState().fetchXpEvents(userId),
          ]);

          await useGamificationStore.getState().fetchTrophies(userId);
        } finally {
          if (active) setLoading(false);
        }
      };

      run();

      return () => {
        active = false;
      };
    }, [userId]),
  );

  return { loading };
}
