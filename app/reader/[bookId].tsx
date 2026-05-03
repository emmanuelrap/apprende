import { useAuth } from "@/src/hooks/useAuth";
import { supabase } from "@/src/services/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Page = {
  id: string;
  pageNumber: number;
  content: string;
};

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [page, setPage] = useState<Page | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🧠 tracking sesión
  const startTimeRef = useRef(Date.now());
  const pagesReadRef = useRef(0);

  // 📄 obtener total páginas
  const getTotalPages = async () => {
    const { count } = await supabase
      .from("book_pages")
      .select("*", { count: "exact", head: true })
      .eq("book_id", bookId);

    setTotalPages(count || 0);
  };

  // 📄 obtener página
  const getPage = async (pageNumber: number) => {
    setLoading(true);

    const { data, error } = await supabase
      .from("book_pages")
      .select(
        `
        id,
        page_number,
        page_content (
          content,
          language
        )
      `,
      )
      .eq("book_id", bookId)
      .eq("page_number", pageNumber)
      .single();

    if (error) {
      console.error("Error loading page:", error);
      return;
    }

    const content =
      data.page_content?.find((c: any) => c.language === "es")?.content ?? "";

    setPage({
      id: data.id,
      pageNumber: data.page_number,
      content,
    });

    setLoading(false);
  };

  // 🟢 guardar progreso
  const saveProgress = async (pageNumber: number) => {
    if (!user) return;

    await supabase
      .from("user_books")
      .update({
        current_page: pageNumber,
      })
      .eq("user_id", user.id)
      .eq("book_id", bookId);
  };

  // 🔵 guardar sesión
  const saveSession = async () => {
    if (!user) return;

    const minutes = Math.floor((Date.now() - startTimeRef.current) / 60000);

    await supabase.from("reading_sessions").insert({
      user_id: user.id,
      book_id: bookId,
      minutes,
      pages: pagesReadRef.current,
      xp: pagesReadRef.current * 5, // ejemplo
    });
  };

  // 🚀 init
  useEffect(() => {
    if (!bookId) return;

    getTotalPages();
    getPage(currentPage);
  }, [bookId]);

  // 🔄 cuando cambia página
  useEffect(() => {
    if (!bookId) return;

    getPage(currentPage);
    saveProgress(currentPage);

    pagesReadRef.current += 1;
  }, [currentPage]);

  // 🔚 salir (guardar sesión)
  useEffect(() => {
    return () => {
      saveSession();
    };
  }, []);

  // 👉 siguiente página
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      finishBook();
    }
  };

  // 👈 página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // 🎉 terminar libro
  const finishBook = async () => {
    if (!user) return;

    await supabase
      .from("user_books")
      .update({
        status: "completed",
      })
      .eq("user_id", user.id)
      .eq("book_id", bookId);

    await supabase.from("xp_events").insert({
      user_id: user.id,
      amount: 100,
      source: "book_completed",
      reference_id: bookId,
    });

    await saveSession();

    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {loading || !page ? (
        <ActivityIndicator />
      ) : (
        <>
          {/* 📄 contenido */}
          <Text style={{ fontSize: 16, lineHeight: 24 }}>{page.content}</Text>

          {/* 📊 footer */}
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={prevPage}>
              <Text>⬅️ Anterior</Text>
            </TouchableOpacity>

            <Text>
              {currentPage} / {totalPages}
            </Text>

            <TouchableOpacity onPress={nextPage}>
              <Text>➡️ Siguiente</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
