import { supabase } from "./supabase";

type BookStatus = "new" | "reading" | "completed" | "paused";

type BookFilters = {
  tagId?: string | null;
  categoryIds?: string[];
  search?: string;
  bookIds?: string[];
  status?: string;
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
  filters?: BookFilters & { limit?: number },
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

  const bookIds = filters?.bookIds;
  if (bookIds && bookIds.length > 0) {
    filteredIds = filteredIds
      ? filteredIds.filter((id) => bookIds.includes(id))
      : bookIds;
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
    book_tag_relations ( book_tags ( id, name, slug ) )
  `,
    );

  if (filteredIds) {
    query = query.in("id", filteredIds);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
  }

  const limit = filters?.limit;
  if (limit) query = query.range(0, limit - 1);

  const { data, error } = await query;

  if (error) throw error;

  // Fetch user_books separately to avoid LEFT JOIN filter issues
  const fetchedBookIds = (data ?? []).map((b: any) => b.id);
  const { data: userBooks } = await supabase
    .from("user_books")
    .select("book_id, current_page, progress, status, started_at, completed_at")
    .eq("user_id", userId)
    .in("book_id", fetchedBookIds);

  const userBooksMap = new Map(
    (userBooks ?? []).map((ub) => [ub.book_id, ub]),
  );

  const statusFilter = filters?.status;
  const merged = (data ?? []).filter((book: any) => {
    if (!statusFilter) return true;
    const ub = userBooksMap.get(book.id);
    if (statusFilter === "new") return !ub;
    return ub?.status === statusFilter;
  });

  const shuffled = [...merged];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.map((book: any) => {
    const progress = userBooksMap.get(book.id) ?? null;

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
      categories: book.book_categories?.flatMap((bc: any) => bc.categories) ?? [],
      tags: book.book_tag_relations?.flatMap((bt: any) => bt.book_tags) ?? [],
      progress: progress?.progress ?? 0,
      currentPage: progress?.current_page ?? 0,
      status: (progress?.status ?? "new") as BookStatus,
      startedAt: progress?.started_at ?? null,
      completedAt: progress?.completed_at ?? null,
    };
  });
}

export type { BookStatus };

export async function getSimilarBooks(bookId: string, limit = 10) {
  const { data: book } = await supabase
    .from("books")
    .select(`
      id,
      book_categories ( category_id ),
      book_tag_relations ( tag_id )
    `)
    .eq("id", bookId)
    .single();

  if (!book) return [];

  const categoryIds: string[] =
    book.book_categories?.map((bc: any) => bc.category_id) ?? [];
  const tagIds: string[] =
    book.book_tag_relations?.map((bt: any) => bt.tag_id) ?? [];

  if (categoryIds.length === 0 && tagIds.length === 0) return [];

  const { data: matches } = await supabase
    .from("books")
    .select(`
      id,
      title,
      author,
      cover_url,
      difficulty,
      xp_base,
      estimated_minutes,
      total_pages,
      min_level,
      book_categories ( category_id ),
      book_tag_relations ( tag_id )
    `)
    .neq("id", bookId);

  if (!matches) return [];

  const scored = matches
    .map((b: any) => {
      let score = 0;
      const bCatIds: string[] =
        b.book_categories?.map((bc: any) => bc.category_id) ?? [];
      const bTagIds: string[] =
        b.book_tag_relations?.map((bt: any) => bt.tag_id) ?? [];

      categoryIds.forEach((cid) => {
        if (bCatIds.includes(cid)) score += 3;
      });
      tagIds.forEach((tid) => {
        if (bTagIds.includes(tid)) score += 2;
      });

      return { ...b, score };
    })
    .filter((b) => b.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, limit);

  return scored.map((b: any) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    cover: b.cover_url,
    difficulty: b.difficulty,
    xp: (b.xp_base ?? 10) * (b.difficulty ?? 1),
    minLevel: b.min_level,
    estimatedMinutes: b.estimated_minutes,
    totalPages: b.total_pages,
  }));
}

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
