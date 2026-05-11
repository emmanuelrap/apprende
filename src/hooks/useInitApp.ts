import { useEffect } from "react";
import { supabase } from "../services/supabase";
import { useAuthStore } from "../store/authStore";
import { useBookStore } from "../store/bookStore";
import { useFilterStore } from "../store/filterStore";
import { useGamificationStore } from "../store/gamificationStore";
import { useVocabularyStore } from "../store/vocabularyStore";

export function useInitApp() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // datos públicos, no dependen del usuario
    useFilterStore.getState().fetchFilters();

    // escucha cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          useAuthStore.getState().init();
        } else {
          // limpiar todo al desloguearse
          useAuthStore.getState().logout();
          useBookStore.getState().reset();
          useGamificationStore.getState().reset();
          useVocabularyStore.getState().reset();
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.id) {
      useBookStore.getState().fetchBooks();
      useGamificationStore.getState().fetchTrophies(user.id);
      useGamificationStore.getState().fetchLevels();
      useVocabularyStore.getState().fetchReviewItems(user.id);
    }
  }, [user?.id]);
}
