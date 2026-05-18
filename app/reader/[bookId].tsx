import { DualPanelReader } from "@/src/components/DualPanelReader";
import { InterleavedReader } from "@/src/components/InterleavedReader";
import { ReadingBar } from "@/src/components/ReadingBar";
import { BookCompletedScreen } from "@/src/screens/BookCompletedScreen";
import { useAuthStore } from "@/src/store/authStore";
import { usePrefsStore } from "@/src/store/prefsStore";
import { useGamificationStore } from "@/src/store/gamificationStore";
import { useReadingStore } from "@/src/store/readingStore";
import { THEME_COLORS } from "@/src/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

  const fontSize = usePrefsStore((state) => state.appSettings.fontSize);
  const theme = usePrefsStore((state) => state.appSettings.theme);
  const readerMode = usePrefsStore((state) => state.appSettings.readerMode);
  const setAppSettings = usePrefsStore((state) => state.setAppSettings);

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

  const colors = THEME_COLORS[theme];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ReadingBar
        title={bookTitle}
        currentPage={currentPage}
        totalPages={totalPages}
        langTop={langTop}
        langBottom={langBottom}
        onLangTopChange={(lang) => setLangTop(lang as Language)}
        onLangBottomChange={(lang) => setLangBottom(lang as Language)}
        fontSize={fontSize}
        onFontSizeChange={(s) => setAppSettings({ fontSize: s })}
        theme={theme}
        onThemeChange={(t) => setAppSettings({ theme: t })}
        readerMode={readerMode}
        onReaderModeChange={(m) => setAppSettings({ readerMode: m })}
      />

      {loading || !page ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : readerMode === "dual" ? (
        <DualPanelReader
          contentTop={getContent(langTop) ?? ""}
          contentBottom={getContent(langBottom) ?? ""}
          langTop={langTop}
          langBottom={langBottom}
          bookId={bookId}
          pageId={page?.id ?? ""}
          activeParagraph={activeParagraph}
          onParagraphPress={setActiveParagraph}
          fontSize={fontSize}
          theme={theme}
        />
      ) : (
        <InterleavedReader
          contentTop={getContent(langTop) ?? ""}
          contentBottom={getContent(langBottom) ?? ""}
          langTop={langTop}
          langBottom={langBottom}
          bookId={bookId}
          pageId={page?.id ?? ""}
          activeParagraph={activeParagraph}
          onParagraphPress={setActiveParagraph}
          fontSize={fontSize}
          theme={theme}
        />
      )}

      {/* footer */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          paddingTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          borderTopWidth: 1,
          borderColor: theme === "dark" ? "#333" : "#ddd",
          backgroundColor: colors.bg,
        }}
      >
        <TouchableOpacity onPress={prevPage}>
          <Text style={{ color: colors.text }}>⬅️ Anterior</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text }}>
          {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity onPress={nextPage}>
          <Text style={{ color: colors.text }}>
            ➡️ {currentPage === totalPages ? "Terminar" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
