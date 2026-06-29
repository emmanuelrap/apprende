import { supabase } from "./supabase";

export type BookReview = {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string | null;
  profile?: {
    name: string | null;
    avatar_url: string | null;
  };
};

export type ReviewSummary = {
  avgRating: number;
  totalCount: number;
  distribution: Record<number, number>;
};

export async function getBookReviews(bookId: string): Promise<BookReview[]> {
  const { data } = await supabase
    .from("book_reviews")
    .select(`
      *,
      profile:profiles!inner(name, avatar_url)
    `)
    .eq("book_id", bookId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r: any) => ({
    ...r,
    rating: Number(r.rating),
  }));
}

export async function getBookReviewSummary(
  bookId: string,
): Promise<ReviewSummary> {
  const { data } = await supabase
    .from("book_reviews")
    .select("rating")
    .eq("book_id", bookId);

  const ratings = (data ?? []).map((r) => Number(r.rating));
  const totalCount = ratings.length;

  if (totalCount === 0) {
    return { avgRating: 0, totalCount: 0, distribution: {} };
  }

  const sum = ratings.reduce((a, b) => a + b, 0);
  const avgRating = Math.round((sum / totalCount) * 10) / 10;

  const distribution: Record<number, number> = {};
  for (let i = 1; i <= 5; i++) {
    distribution[i] = ratings.filter((r) => Math.floor(r) === i).length;
  }

  return { avgRating, totalCount, distribution };
}

export async function getUserReview(
  userId: string,
  bookId: string,
): Promise<BookReview | null> {
  const { data } = await supabase
    .from("book_reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .maybeSingle();

  return data ? { ...data, rating: Number(data.rating) } : null;
}

export async function upsertReview(
  userId: string,
  bookId: string,
  rating: number,
  comment?: string,
): Promise<boolean> {
  const existing = await getUserReview(userId, bookId);

  if (existing) {
    const { error } = await supabase
      .from("book_reviews")
      .update({
        rating,
        comment: comment || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) console.error("update review error", error);
    return !error;
  }

  const { error } = await supabase.from("book_reviews").insert({
    user_id: userId,
    book_id: bookId,
    rating,
    comment: comment || null,
  });

  if (error) console.error("insert review error", error);
  return !error;
}

export async function deleteReview(
  userId: string,
  bookId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("book_reviews")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId);

  return !error;
}
