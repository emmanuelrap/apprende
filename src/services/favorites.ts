import { supabase } from "./supabase";

export async function getFavorites(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from("user_favorites")
    .select("book_id")
    .eq("user_id", userId);

  return (data ?? []).map((r) => r.book_id);
}

export async function toggleFavorite(
  userId: string,
  bookId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .maybeSingle();

  if (data) {
    await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("book_id", bookId);
    return false;
  }

  await supabase
    .from("user_favorites")
    .insert({ user_id: userId, book_id: bookId });
  return true;
}
