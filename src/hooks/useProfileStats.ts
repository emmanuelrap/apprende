// src/hooks/useProfileStats.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

type Stats = {
  booksCompleted: number;
  booksReading: number;
  totalMinutes: number;
  totalPages: number;
  sessions: any[];
  xpEvents: any[];
};

export function useProfileStats(userId: string | null) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      const [{ data: userBooks }, { data: sessions }, { data: xpEvents }] =
        await Promise.all([
          supabase.from("user_books").select("status").eq("user_id", userId),
          supabase
            .from("reading_sessions")
            .select("minutes, pages, created_at, book_id, books(title)")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
          supabase
            .from("xp_events")
            .select("amount, source, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
        ]);

      setStats({
        booksCompleted:
          userBooks?.filter((b) => b.status === "completed").length ?? 0,
        booksReading:
          userBooks?.filter((b) => b.status === "reading").length ?? 0,
        totalMinutes:
          sessions?.reduce((acc, s) => acc + (s.minutes ?? 0), 0) ?? 0,
        totalPages: sessions?.reduce((acc, s) => acc + (s.pages ?? 0), 0) ?? 0,
        sessions: sessions ?? [],
        xpEvents: xpEvents ?? [],
      });

      setLoading(false);
    };

    load();
  }, [userId]);

  return { stats, loading };
}
