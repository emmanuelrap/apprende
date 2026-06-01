import { supabase } from "./supabase";

export type BookVocabulary = {
  id: string;
  book_id: string;
  word_es: string;
  word_en: string;
  level: string;
};

export async function getBookVocabulary(
  bookId: string,
): Promise<BookVocabulary[]> {
  const { data, error } = await supabase
    .from("book_vocabulary")
    .select("*")
    .eq("book_id", bookId)
    .order("level", { ascending: true });

  if (error) throw error;

  return data ?? [];
}
