import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useBookStore } from "../store/bookStore";
import { useFilterStore } from "../store/filterStore";
import { useGamificationStore } from "../store/gamificationStore";
import { useReadingStore } from "../store/readingStore";
import { useVocabularyStore } from "../store/vocabularyStore";
import { supabase } from "../services/supabase";

let authInitialized = false;

export function useInitApp() {
  const user = useAuthStore((state) => state.user);
  const init = useAuthStore((state) => state.init);

  // Inicializar auth una sola vez
  useEffect(() => {
    if (authInitialized) return;
    authInitialized = true;
    init();
  }, [init]);

  // Datos públicos
  useEffect(() => {
    useFilterStore.getState().fetchFilters();
  }, []);

  // Cargar datos del usuario cuando hay sesión
  useEffect(() => {
    if (!user?.id) return;

    const initUserData = async () => {
      await useGamificationStore.getState().checkTrophies(user.id);
      await Promise.all([
        useBookStore.getState().fetchBooks(),
        useGamificationStore.getState().fetchTrophies(user.id),
        useGamificationStore.getState().fetchLevels(),
        useVocabularyStore.getState().fetchReviewItems(user.id),
        useReadingStore.getState().fetchSessions(user.id),
        useReadingStore.getState().fetchUserBooks(user.id),
        useAuthStore.getState().fetchXpEvents(user.id),
      ]);
    };

    initUserData();
  }, [user?.id]);

  // Escuchar cambios de auth (una sola suscripción global)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        if (!authInitialized) {
          authInitialized = true;
          init();
        }
      } else if (event === "SIGNED_IN" && session?.user) {
        init();
      } else if (event === "SIGNED_OUT") {
        useAuthStore.getState().reset();
        authInitialized = false;
      }
    });

    return () => subscription.unsubscribe();
  }, [init]);
}
