import { PageContent } from "@/src/components/PageContent";
import { ReadingBar } from "@/src/components/ReadingBar";
import { BookCompletedScreen } from "@/src/screens/BookCompletedScreen";
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

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const fetchXpEvents = useAuthStore((state) => state.fetchXpEvents);
  const checkTrophies = useGamificationStore((state) => state.checkTrophies);
  const fetchTrophies = useGamificationStore((state) => state.fetchTrophies);
  const fetchUserBooks = useReadingStore((state) => state.fetchUserBooks);
  const fetchSessions = useReadingStore((state) => state.fetchSessions);
  const initReader = useReadingStore((state) => state.initReader);
  const saveProgress = useReadingStore((state) => state.saveProgress);
  const finishBook = useReadingStore((state) => state.finishBook);
  const getPage = useReadingStore((state) => state.getPage);

  const [page, setPage] = useState<Page | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [bookXp, setBookXp] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [xpBefore, setXpBefore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [langTop, setLangTop] = useState<Language>("en");
  const [langBottom, setLangBottom] = useState<Language>("es");
  const [fontSize, setFontSize] = useState(16);
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);

  const startTimeRef = useRef(Date.now());
  const pagesReadRef = useRef(0);

  const loadPage = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      const data = await getPage(bookId, pageNumber);
      if (data) setPage(data);
      setLoading(false);
    },
    [bookId, getPage],
  );

  // init
  useEffect(() => {
    if (!bookId || !user) return;
    const init = async () => {
      const { totalPages, bookXp, bookTitle, xpBefore } = await initReader(
        bookId,
        user.id,
      );
      setTotalPages(totalPages);
      setBookXp(bookXp);
      setBookTitle(bookTitle);
      setXpBefore(xpBefore);
      await loadPage(1);
      await saveProgress(user.id, bookId, 1, totalPages);
    };
    init();
  }, [bookId, user]);

  // cambio de página
  useEffect(() => {
    setActiveParagraph(null);
    if (!bookId || !user || currentPage === 1) return;
    loadPage(currentPage);
    saveProgress(user.id, bookId, currentPage, totalPages);
    pagesReadRef.current += 1;
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleFinish = async () => {
    if (!user) return;

    await finishBook(
      user.id,
      bookId,
      bookXp,
      startTimeRef.current,
      pagesReadRef.current,
    );

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
        langTop={langTop}
        langBottom={langBottom}
        onLangTopChange={(lang) => setLangTop(lang as Language)}
        onLangBottomChange={(lang) => setLangBottom(lang as Language)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      {loading || !page ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <View style={{ flex: 1 }}>
          {/* mitad superior */}
          <View
            style={{
              flex: 1,
              padding: 16,
              borderBottomWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <ScrollView>
              <PageContent
                content={getContent(langTop) ?? ""}
                language={langTop}
                bookId={bookId}
                pageId={page?.id ?? ""}
                activeParagraph={activeParagraph}
                onParagraphPress={setActiveParagraph}
                fontSize={fontSize}
              />
            </ScrollView>
          </View>

          {/* mitad inferior */}
          <View style={{ flex: 1, padding: 16 }}>
            <ScrollView>
              <PageContent
                content={getContent(langBottom) ?? ""}
                language={langBottom}
                bookId={bookId}
                pageId={page?.id ?? ""}
                readonly
                activeParagraph={activeParagraph}
                onParagraphPress={setActiveParagraph}
                fontSize={fontSize}
              />
            </ScrollView>
          </View>
        </View>
      )}

      {/* footer */}
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
          <Text>
            ➡️ {currentPage === totalPages ? "Terminar" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
