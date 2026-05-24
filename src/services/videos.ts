import { supabase } from "./supabase";

type Video = {
  id: string;
  title: string;
  url: string;
  thumbnail: string | null;
  category_id: string | null;
  language: string;
  created_at: string;
};

export async function getVideos(language?: string) {
  let query = supabase.from("videos").select("*");

  if (language) {
    query = query.eq("language", language);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Video[];
}

export type { Video };
