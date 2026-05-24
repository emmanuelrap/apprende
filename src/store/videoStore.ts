import { create } from "zustand";
import { getVideos } from "../services/videos";
import type { Video } from "../services/videos";

type VideoStore = {
  videos: Video[];
  isLoading: boolean;
  error: string | null;
  fetchVideos: (language?: string) => Promise<void>;
};

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  isLoading: false,
  error: null,

  fetchVideos: async (language) => {
    set({ isLoading: true, error: null });
    try {
      const videos = await getVideos(language);
      set({ videos });
    } catch {
      set({ error: "Error cargando videos" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
