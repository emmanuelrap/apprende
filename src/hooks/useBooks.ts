import { useEffect, useState } from "react";
import { getBooksWithProgress } from "../services/books";

export function useBooks(userId: string | null) {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const data = await getBooksWithProgress(userId);
        setBooks(data);
      } catch (e) {
        console.error("Error loading books:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  return { books, loading };
}
