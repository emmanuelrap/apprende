import { supabase } from "./supabase";

type BookStatus = "new" | "reading" | "completed" | "paused";

type BookFilters = {
  tagId?: string | null;
  categoryIds?: string[];
  search?: string;
};

type BookCategory = { id: string; name: string; slug: string };
type BookTag = { id: string; name: string; slug: string };
type BookWithRelations = {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  cover_url: string | null;
  difficulty: number;
  xp_base: number | null;
  estimated_minutes: number | null;
  total_pages: number | null;
  min_level: number | null;
  book_categories: { categories: BookCategory[] }[];
  book_tag_relations: { book_tags: BookTag[] }[];
  user_books: {
    current_page: number;
    progress: number;
    status: string;
    started_at: string | null;
    completed_at: string | null;
  }[];
};

export async function getBooksWithProgress(
  userId: string,
  filters?: BookFilters,
) {
  const selectedCategories = filters?.categoryIds ?? [];
  const selectedTag = filters?.tagId ?? null;
  const search = filters?.search?.trim();

  let filteredIds: string[] | null = null;

  if (selectedCategories.length > 0) {
    const { data: catRows, error: catError } = await supabase
      .from("book_categories")
      .select("book_id")
      .in("category_id", selectedCategories);

    if (catError) throw catError;

    filteredIds = [...new Set((catRows ?? []).map((r) => r.book_id))];
  }

  if (selectedTag) {
    const { data: tagRows, error: tagError } = await supabase
      .from("book_tag_relations")
      .select("book_id")
      .eq("tag_id", selectedTag);

    if (tagError) throw tagError;

    const tagSet = new Set((tagRows ?? []).map((r) => r.book_id));
    filteredIds = filteredIds
      ? filteredIds.filter((id) => tagSet.has(id))
      : Array.from(tagSet);
  }

  if (filteredIds && filteredIds.length === 0) {
    return [];
  }

  let query = supabase
    .from("books")
    .select(
      `
    id,
    title,
    author,
    description,
    cover_url,
    difficulty,
    xp_base,
    estimated_minutes,
    total_pages,
    min_level,
    book_categories ( categories ( id, name, slug ) ),
    book_tag_relations ( book_tags ( id, name, slug ) ),
    user_books ( current_page, progress, status, started_at, completed_at )
  `,
    )
    .eq("user_books.user_id", userId);

  if (filteredIds) {
    query = query.in("id", filteredIds);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;

    return (data || []).map((book: BookWithRelations) => {
    const progress = book.user_books?.[0] ?? null;

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      cover: book.cover_url,
      difficulty: book.difficulty,
      xp: (book.xp_base ?? 10) * (book.difficulty ?? 1),
      minLevel: book.min_level,
      estimatedMinutes: book.estimated_minutes,
      totalPages: book.total_pages,
      categories: book.book_categories?.flatMap((bc) => bc.categories) ?? [],
      tags: book.book_tag_relations?.flatMap((bt) => bt.book_tags) ?? [],
      progress: progress?.progress ?? 0,
      currentPage: progress?.current_page ?? 0,
      status: (progress?.status ?? "new") as BookStatus,
      startedAt: progress?.started_at ?? null,
      completedAt: progress?.completed_at ?? null,
    };
  });
}

export type { BookStatus };

export async function deleteBook(bookId: string) {
  const { data, error } = await supabase
    .from("books")
    .delete()
    .eq("id", bookId)
    .select();

  if (error) {
    console.error("DELETE ERROR:", error);
    throw error;
  }

  return data;
}
