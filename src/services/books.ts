import { supabase } from "./supabase";

export async function getBooksWithProgress(userId: string) {
  const { data, error } = await supabase.from("books").select(`
      id,
      title,
      author,
      cover_url,
      difficulty,
      xp_base,
      user_books (
        user_id,
        current_page,
        progress,
        status
      )
    `);

  if (error) throw error;

  const mapped = (data || []).map((book: any) => {
    const progress = book.user_books?.find((ub: any) => {
      return ub.user_id === userId;
    });

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover_url,
      progress: progress?.progress ?? 0,
      currentPage: progress?.current_page ?? 0,
      status: progress?.status ?? "new",
    };
  });

  return mapped;
}
