import { create } from "zustand";
import { getRecorridos, getRecorridoById, type Recorrido } from "../services/recorridos";
import { useAuthStore } from "./authStore";

type RecorridoStore = {
  recorridos: Recorrido[];
  selectedRecorrido: Recorrido | null;
  isLoading: boolean;
  error: string | null;
  fetchRecorridos: () => Promise<void>;
  selectRecorrido: (id: string) => Promise<void>;
  reset: () => void;
};

export const useRecorridoStore = create<RecorridoStore>((set) => ({
  recorridos: [],
  selectedRecorrido: null,
  isLoading: false,
  error: null,

  fetchRecorridos: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        set({ recorridos: [] });
        return;
      }
      const recorridos = await getRecorridos(userId);
      set({ recorridos });
    } catch {
      set({ error: "Error cargando recorridos" });
    } finally {
      set({ isLoading: false });
    }
  },

  selectRecorrido: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return;
      const recorrido = await getRecorridoById(id, userId);
      set({ selectedRecorrido: recorrido });
    } catch {
      set({ error: "Error cargando recorrido" });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () =>
    set({ recorridos: [], selectedRecorrido: null, isLoading: false, error: null }),
}));
