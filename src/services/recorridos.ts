import { supabase } from "./supabase";

type CategoryInfo = { id: string; name: string; slug: string };
type TagInfo = { id: string; name: string; slug: string };

export type RecorridoBook = {
  id: string;
  bookId: string;
  title: string;
  cover: string | null;
  difficulty: number;
  xp: number;
  estimatedMinutes: number | null;
  totalPages: number | null;
  sortOrder: number;
  required: boolean;
  categories: CategoryInfo[];
  tags: TagInfo[];
  progress: number;
  status: "new" | "reading" | "completed" | "paused";
};

export type Recorrido = {
  id: string;
  title: string;
  description: string | null;
  cover: string | null;
  difficulty: number;
  minLevel: number | null;
  estimatedMinutes: number;
  xpReward: number;
  sortOrder: number;
  progress: number;
  status: "not_started" | "in_progress" | "completed";
  totalBooks: number;
  completedBooks: number;
  books: RecorridoBook[];
  startedAt: string | null;
  completedAt: string | null;
};

const DIFFICULTY_LABEL: Record<number, string> = {
  1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1", 6: "C2",
};

export function difficultyLabel(d: number): string {
  return DIFFICULTY_LABEL[d] ?? "-";
}

// ── helpers ──

async function fetchBookMetadata(bookIds: string[], userId: string) {
  const booksMap = new Map<string, any>();
  const catsByBook = new Map<string, CategoryInfo[]>();
  const tagsByBook = new Map<string, TagInfo[]>();
  const userBookMap = new Map<string, any>();

  if (bookIds.length === 0) return { booksMap, catsByBook, tagsByBook, userBookMap };

  const { data: booksData } = await supabase
    .from("books")
    .select("id, title, cover_url, difficulty, xp_base, estimated_minutes, total_pages")
    .in("id", bookIds);
  for (const b of booksData ?? []) booksMap.set(b.id, b);

  const { data: bookCats } = await supabase
    .from("book_categories")
    .select("book_id, category_id")
    .in("book_id", bookIds);
  if (bookCats?.length) {
    const catIds = [...new Set(bookCats.map((bc: any) => bc.category_id))];
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name, slug")
      .in("id", catIds);
    const catMap = new Map((catData ?? []).map((c: any) => [c.id, c]));
    for (const bc of bookCats) {
      const cat = catMap.get(bc.category_id);
      if (cat) {
        if (!catsByBook.has(bc.book_id)) catsByBook.set(bc.book_id, []);
        catsByBook.get(bc.book_id)!.push(cat);
      }
    }
  }

  const { data: bookTagRels } = await supabase
    .from("book_tag_relations")
    .select("book_id, tag_id")
    .in("book_id", bookIds);
  if (bookTagRels?.length) {
    const tagIds = [...new Set(bookTagRels.map((tr: any) => tr.tag_id))];
    const { data: tagData } = await supabase
      .from("book_tags")
      .select("id, name, slug")
      .in("id", tagIds);
    const tagMap = new Map((tagData ?? []).map((t: any) => [t.id, t]));
    for (const tr of bookTagRels) {
      const tag = tagMap.get(tr.tag_id);
      if (tag) {
        if (!tagsByBook.has(tr.book_id)) tagsByBook.set(tr.book_id, []);
        tagsByBook.get(tr.book_id)!.push(tag);
      }
    }
  }

  const { data: userBooks } = await supabase
    .from("user_books")
    .select("book_id, progress, status")
    .eq("user_id", userId)
    .in("book_id", bookIds);
  for (const ub of userBooks ?? []) userBookMap.set(ub.book_id, ub);

  return { booksMap, catsByBook, tagsByBook, userBookMap };
}

function buildBook(
  rb: any,
  { booksMap, catsByBook, tagsByBook, userBookMap }: Awaited<ReturnType<typeof fetchBookMetadata>>,
): RecorridoBook {
  const book = booksMap.get(rb.book_id);
  const ub = userBookMap.get(rb.book_id);
  const status: RecorridoBook["status"] =
    ub?.status === "completed" ? "completed"
    : ub?.status === "reading" ? "reading"
    : ub?.status === "paused" ? "paused"
    : "new";
  return {
    id: rb.book_id,
    bookId: rb.book_id,
    title: book?.title ?? "",
    cover: book?.cover_url ?? null,
    difficulty: book?.difficulty ?? 1,
    xp: (book?.xp_base ?? 10) * (book?.difficulty ?? 1),
    estimatedMinutes: book?.estimated_minutes ?? null,
    totalPages: book?.total_pages ?? null,
    sortOrder: rb.sort_order,
    required: rb.required,
    categories: catsByBook.get(rb.book_id) ?? [],
    tags: tagsByBook.get(rb.book_id) ?? [],
    progress: ub?.progress ?? 0,
    status,
  };
}

function buildRecorrido(r: any, books: RecorridoBook[], progress: any): Recorrido {
  const completedBooks = books.filter((b) => b.status === "completed").length;
  const totalMinutes = (r.estimated_minutes ?? 0) > 0
    ? r.estimated_minutes
    : books.reduce((sum, b) => sum + (b.estimatedMinutes ?? 0), 0);
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    cover: r.cover_url,
    difficulty: r.difficulty,
    minLevel: r.min_level,
    estimatedMinutes: totalMinutes,
    xpReward: r.xp_reward,
    sortOrder: r.sort_order,
    progress: progress?.progress ?? 0,
    status: (progress?.status ?? "not_started") as Recorrido["status"],
    totalBooks: books.length,
    completedBooks,
    books,
    startedAt: progress?.started_at ?? null,
    completedAt: progress?.completed_at ?? null,
  };
}

// ── public API ──

export async function getRecorridos(userId: string) {
  const { data: recorridos, error } = await supabase
    .from("recorridos")
    .select("id, title, description, cover_url, difficulty, min_level, estimated_minutes, xp_reward, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  if (!recorridos?.length) return [];

  const recorridoIds = recorridos.map((r: any) => r.id);

  const { data: userProgress } = await supabase
    .from("user_recorridos")
    .select("recorrido_id, status, progress, started_at, completed_at")
    .eq("user_id", userId)
    .in("recorrido_id", recorridoIds);
  const progressMap = new Map((userProgress ?? []).map((p: any) => [p.recorrido_id, p]));

  const { data: recorridoBooks } = await supabase
    .from("recorrido_books")
    .select("recorrido_id, book_id, sort_order, required")
    .in("recorrido_id", recorridoIds)
    .order("sort_order", { ascending: true });

  const bookIds = [...new Set((recorridoBooks ?? []).map((rb: any) => rb.book_id))];
  const metadata = await fetchBookMetadata(bookIds, userId);

  const booksByRecorrido = new Map<string, any[]>();
  for (const rb of recorridoBooks ?? []) {
    if (!booksByRecorrido.has(rb.recorrido_id)) booksByRecorrido.set(rb.recorrido_id, []);
    booksByRecorrido.get(rb.recorrido_id)!.push(rb);
  }

  return recorridos.map((r: any) => {
    const books = (booksByRecorrido.get(r.id) ?? []).map((rb) => buildBook(rb, metadata));
    return buildRecorrido(r, books, progressMap.get(r.id));
  });
}

export async function getRecorridoById(recorridoId: string, userId: string) {
  const { data: recorrido, error } = await supabase
    .from("recorridos")
    .select("id, title, description, cover_url, difficulty, min_level, estimated_minutes, xp_reward, sort_order")
    .eq("id", recorridoId)
    .eq("is_published", true)
    .single();
  if (error) throw error;

  const { data: userProgress } = await supabase
    .from("user_recorridos")
    .select("recorrido_id, status, progress, started_at, completed_at")
    .eq("user_id", userId)
    .eq("recorrido_id", recorridoId)
    .maybeSingle();

  const { data: recorridoBooks } = await supabase
    .from("recorrido_books")
    .select("book_id, sort_order, required")
    .eq("recorrido_id", recorridoId)
    .order("sort_order", { ascending: true });

  const bookIds = (recorridoBooks ?? []).map((rb: any) => rb.book_id);
  const metadata = await fetchBookMetadata(bookIds, userId);
  const books = (recorridoBooks ?? []).map((rb) => buildBook(rb, metadata));

  return buildRecorrido(recorrido, books, userProgress);
}

async function ensureUserRecorrido(userId: string, recorridoId: string) {
  const { data: existing } = await supabase
    .from("user_recorridos")
    .select("id")
    .eq("user_id", userId)
    .eq("recorrido_id", recorridoId)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("user_recorridos")
    .insert({ user_id: userId, recorrido_id: recorridoId, status: "in_progress", progress: 0 })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function startRecorrido(userId: string, recorridoId: string) {
  return ensureUserRecorrido(userId, recorridoId);
}

export async function updateRecorridoProgress(userId: string, recorridoId: string) {
  // Only update if the user has actually started the recorrido
  const { data: existing } = await supabase
    .from("user_recorridos")
    .select("id, status")
    .eq("user_id", userId)
    .eq("recorrido_id", recorridoId)
    .maybeSingle();

  if (!existing) return { progress: 0, status: "not_started" };

  const { data: recorrido } = await supabase
    .from("recorridos")
    .select("id, xp_reward")
    .eq("id", recorridoId)
    .single();

  if (!recorrido) throw new Error("Recorrido no encontrado");

  const { data: rBooks } = await supabase
    .from("recorrido_books")
    .select("book_id, required")
    .eq("recorrido_id", recorridoId);

  const bookIds = (rBooks ?? []).map((rb: any) => rb.book_id);

  const { data: userBooks } = await supabase
    .from("user_books")
    .select("book_id, status")
    .eq("user_id", userId)
    .in("book_id", bookIds);

  const userBooksMap = new Map((userBooks ?? []).map((ub: any) => [ub.book_id, ub]));

  const totalRequired = (rBooks ?? []).filter((rb: any) => rb.required).length;
  let completedRequired = 0;

  for (const rb of rBooks ?? []) {
    if (rb.required) {
      const ub = userBooksMap.get(rb.book_id);
      if (ub && ub.status === "completed") completedRequired++;
    }
  }

  const progress = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;
  const newStatus = progress >= 100 ? "completed" : "in_progress";
  const completedAt = newStatus === "completed" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("user_recorridos")
    .update({ status: newStatus, progress, completed_at: completedAt })
    .eq("user_id", userId)
    .eq("recorrido_id", recorridoId);

  if (error) throw error;

  if (newStatus === "completed") {
    const xpReward = (recorrido as any).xp_reward ?? 0;
    if (xpReward > 0 && existing.status !== "completed") {
      await supabase.from("xp_events").insert({
        user_id: userId,
        amount: xpReward,
        source: "recorrido_completed",
        reference_id: recorridoId,
      });

      const { data: profile } = await supabase
        .from("profiles")
        .select("xp")
        .eq("id", userId)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ xp: (profile as any).xp + xpReward })
          .eq("id", userId);
      }
    }
  }

  return { progress, status: newStatus };
}
