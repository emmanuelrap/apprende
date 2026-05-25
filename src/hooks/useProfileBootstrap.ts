import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useGamificationStore } from "../store/gamificationStore";
import { useReadingStore } from "../store/readingStore";

export function useProfileBootstrap() {
  const userId = useAuthStore((state) => state.user?.id);
  const [loading, setLoading] = useState(false);
  const [newTrophy, setNewTrophy] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;

      let active = true;

      const run = async () => {
        setLoading(true);
        try {
          const newTrophies = await useGamificationStore.getState().checkTrophies(userId);

          await Promise.all([
            useReadingStore.getState().fetchUserBooks(userId).catch(() => {}),
            useReadingStore.getState().fetchSessions(userId).catch(() => {}),
            useAuthStore.getState().fetchXpEvents(userId).catch(() => {}),
            useGamificationStore.getState().fetchTrophies(userId).catch(() => {}),
          ]);

          if (active && newTrophies.length > 0) {
            setNewTrophy(newTrophies[0]);
          }
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

  return { loading, newTrophy, clearNewTrophy: () => setNewTrophy(null) };
}
