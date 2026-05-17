
import { ReadingBar } from "@/src/components/ReadingBar";
import { useAuth } from "@/src/hooks/useAuth";
import { BookCompletedScreen } from "@/src/screens/BookCompletedScreen";
import { supabase } from "@/src/services/supabase";
import { useAuthStore } from "@/src/store/authStore";
import { useGamificationStore } from "@/src/store/gamificationStore";
import { useReadingStore } from "@/src/store/readingStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Page = {
  id: string;
  pageNumber: number;
  contentEs: string;
  contentEn: string;
};

type Language = "es" | "en";

const LANGUAGES: { label: string; value: Language }[] = [
  { label: "Español", value: "es" },
  { label: "English", value: "en" },
];

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const fetchXpEvents = useAuthStore((state) => state.fetchXpEvents);
  const checkTrophies = useGamificationStore((state) => state.checkTrophies);
  const fetchTrophies = useGamificationStore((state) => state.fetchTrophies);
  const fetchUserBooks = useReadingStore((state) => state.fetchUserBooks);
  const fetchSessions = useReadingStore((state) => state.fetchSessions);

  const [page, setPage] = useState<Page | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [bookXp, setBookXp] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [xpBefore, setXpBefore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [langTop, setLangTop] = useState<Language>("es");
  const [langBottom, setLangBottom] = useState<Language>("en");

  const startTimeRef = useRef(Date.now());
  const pagesReadRef = useRef(0);

  const getPage = useCallback(async (pageNumber: number) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("book_pages")
      .select(`id, page_number, page_content (content, language)`)
      .eq("book_id", bookId)
      .eq("page_number", pageNumber)
      .single();

    if (error) return console.error("Error loading page:", error);

    const getContent = (lang: string) =>
      data.page_content?.find((c: any) => c.language === lang)?.content ?? "";

    setPage({
      id: data.id,
      pageNumber: data.page_number,
      contentEs: getContent("es"),
      contentEn: getContent("en"),
    });
    setLoading(false);
  }, [bookId]);

  // 🟢 upsert progreso
  const saveProgress = useCallback(async (pageNumber: number, total?: number) => {
    if (!user) return;
    const pages = total ?? totalPages;
    const { error } = await supabase.from("user_books").upsert(
      {
        user_id: user.id,
        book_id: bookId,
        current_page: pageNumber,
        progress: pages > 0 ? Math.round((pageNumber / pages) * 100) : 0,
        status: "reading",
      },
      { onConflict: "user_id,book_id" },
    );
    if (error) console.error("[Reader] saveProgress error:", error);
  }, [bookId, totalPages, user]);

  // 🚀 init
  useEffect(() => {
    if (!bookId || !user) return;

    const init = async () => {
      const [{ count }, { data: book }, { data: profile }] = await Promise.all([
        supabase
          .from("book_pages")
          .select("*", { count: "exact", head: true })
          .eq("book_id", bookId),
        supabase
          .from("books")
          .select("title, xp_base, difficulty")
          .eq("id", bookId)
          .single(),
        supabase.from("profiles").select("xp").eq("id", user.id).single(),
      ]);

      const total = count || 0;
      const xp = (book?.xp_base ?? 10) * (book?.difficulty ?? 1);

      setTotalPages(total);
      setBookXp(xp);
      setBookTitle(book?.title ?? "");
      setXpBefore(profile?.xp ?? 0);
      getPage(currentPage);
      saveProgress(currentPage, total);
    };

    init();
  }, [bookId, currentPage, getPage, saveProgress, user]);

  // 🔄 cada cambio de página después del mount
  useEffect(() => {
    if (!bookId || !user || currentPage === 1) return;
    getPage(currentPage);
    saveProgress(currentPage);
    pagesReadRef.current += 1;
  }, [bookId, currentPage, getPage, saveProgress, user]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      finishBook();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // 🎉 terminar libro
  const finishBook = async () => {
    if (!user) return;

    const { error: completeError } = await supabase
      .from("user_books")
      .upsert({
        user_id: user.id,
        book_id: bookId,
        current_page: totalPages,
        status: "completed",
        progress: 100,
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,book_id" });
    if (completeError) {
      console.error("[Reader] complete user_books error:", completeError);
      return;
    }

    const { error: sessionError } = await supabase.from("reading_sessions").insert({
      user_id: user.id,
      book_id: bookId,
      minutes: Math.floor((Date.now() - startTimeRef.current) / 60000),
      pages: pagesReadRef.current,
      xp: bookXp,
    });
    if (sessionError) console.error("[Reader] reading_sessions insert error:", sessionError);

    const { error: xpError } = await supabase.from("xp_events").insert({
      user_id: user.id,
      amount: bookXp,
      source: "book_completed",
      reference_id: bookId,
    });
    if (xpError) console.error("[Reader] xp_events insert error:", xpError);

    await checkTrophies(user.id);
    await Promise.all([
      fetchTrophies(user.id),
      fetchUserBooks(user.id),
      fetchSessions(user.id),
      fetchXpEvents(user.id),
    ]);

    setCompleted(true);
  };

  const getContent = (lang: Language) =>
    lang === "es" ? page?.contentEs : page?.contentEn;

  // 🌍 selector de idioma
  const LangSelector = ({
    selected,
    onChange,
  }: {
    selected: Language;
    onChange: (l: Language) => void;
  }) => (
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
      {LANGUAGES.map((l) => (
        <TouchableOpacity
          key={l.value}
          onPress={() => onChange(l.value)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor: selected === l.value ? "#000" : "#eee",
          }}
        >
          <Text
            style={{
              color: selected === l.value ? "#fff" : "#000",
              fontSize: 12,
            }}
          >
            {l.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 🏆 pantalla de celebración
  if (completed) {
    return (
      <BookCompletedScreen
        xpBefore={xpBefore}
        xpGained={bookXp}
        bookTitle={bookTitle}
        onContinue={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ReadingBar
        title={bookTitle}
        currentPage={currentPage}
        totalPages={totalPages}
        onSettings={() => {}}
      />

      {loading || !page ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <View style={{ flex: 1 }}>
          {/* 📖 mitad superior */}
          <View
            style={{
              flex: 1,
              padding: 16,
              borderBottomWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <LangSelector selected={langTop} onChange={setLangTop} />
            <ScrollView>
              <Text style={{ fontSize: 16, lineHeight: 24 }}>
                {getContent(langTop)}
              </Text>
            </ScrollView>
          </View>

          {/* 📖 mitad inferior */}
          <View style={{ flex: 1, padding: 16 }}>
            <LangSelector selected={langBottom} onChange={setLangBottom} />
            <ScrollView>
              <Text style={{ fontSize: 16, lineHeight: 24 }}>
                {getContent(langBottom)}
              </Text>
            </ScrollView>
          </View>
        </View>
      )}

      {/* 📊 footer */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          borderTopWidth: 1,
          borderColor: "#ddd",
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
    </SafeAreaView>
  );
}
