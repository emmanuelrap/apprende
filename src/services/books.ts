import { supabase } from "./supabase";

// =====================
// 📚 GET BOOKS + PROGRESS
// =====================
export async function getBooksWithProgress(userId: string) {
  const { data, error } = await supabase
    .from("books")
    .select(
      `
    id,
    title,
    author,
    cover_url,
    difficulty,
    xp_base,
    estimated_minutes,
    total_pages,
    book_categories ( categories ( id, name, slug ) ),
    book_tag_relations ( book_tags ( id, name, slug ) ),
    user_books ( current_page, progress, status, started_at, completed_at )
  `,
    )
    .eq("user_books.user_id", userId);

  if (error) throw error;

  return (data || []).map((book: any) => {
    const progress = book.user_books?.[0] ?? null;

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover_url,
      difficulty: book.difficulty,
      xp: (book.xp_base ?? 10) * (book.difficulty ?? 1),
      estimatedMinutes: book.estimated_minutes,
      totalPages: book.total_pages,
      categories: book.book_categories?.map((bc: any) => bc.categories) ?? [],
      tags: book.book_tag_relations?.map((bt: any) => bt.book_tags) ?? [],
      progress: progress?.progress ?? 0,
      currentPage: progress?.current_page ?? 0,
      status: progress?.status ?? "new",
      startedAt: progress?.started_at ?? null,
      completedAt: progress?.completed_at ?? null,
    };
  });
}

// =====================
// 🗑 DELETE BOOK
// =====================
export async function deleteBook(bookId: string) {
  const { data, error } = await supabase
    .from("books")
    .delete()
    .eq("id", bookId)
    .select();

  if (error) {
    console.error("❌ DELETE ERROR:", error);
    throw error;
  }

  return data;
}
