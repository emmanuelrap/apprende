import { DualPanelReader } from "@/src/components/DualPanelReader";
import { InterleavedReader } from "@/src/components/InterleavedReader";
import { SingleReader } from "@/src/components/SingleReader";
import { ReadingBar } from "@/src/components/ReadingBar";
import { BookCompletedScreen } from "@/src/screens/BookCompletedScreen";
import { TrophyUnlockedScreen } from "@/src/screens/TrophyUnlockedScreen";
import { useAuthStore } from "@/src/store/authStore";
import { useGamificationStore } from "@/src/store/gamificationStore";
import { usePrefsStore } from "@/src/store/prefsStore";
import { useReadingStore } from "@/src/store/readingStore";
import { colors, THEME_COLORS, shadows, borderRadius, typography } from "@/src/theme";
import * as Speech from "expo-speech";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { parseSentences, type SentenceInfo } from "@/src/services/sentences";

type Page = {
  id: string;
  pageNumber: number;
  contentEs: string;
  contentEn: string;
  contentFr: string;
};

type Language = "es" | "en" | "fr";

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const fetchXpEvents = useAuthStore((state) => state.fetchXpEvents);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const checkTrophies = useGamificationStore((state) => state.checkTrophies);
  const fetchTrophies = useGamificationStore((state) => state.fetchTrophies);
  const fetchUserBooks = useReadingStore((state) => state.fetchUserBooks);
  const fetchSessions = useReadingStore((state) => state.fetchSessions);
  const initReader = useReadingStore((state) => state.initReader);
  const saveProgress = useReadingStore((state) => state.saveProgress);
  const finishBook = useReadingStore((state) => state.finishBook);
  const getPage = useReadingStore((state) => state.getPage);
  const getBookLanguages = useReadingStore((state) => state.getBookLanguages);

  const fontSize = usePrefsStore((state) => state.appSettings.fontSize);
  const theme = usePrefsStore((state) => state.appSettings.theme);
  const readerMode = usePrefsStore((state) => state.appSettings.readerMode);
  const boldEnabled = usePrefsStore((state) => state.appSettings.boldEnabled);
  const lineSpacing = usePrefsStore((state) => state.appSettings.lineSpacing);
  const sideMargin = usePrefsStore((state) => state.appSettings.sideMargin);
  const fontFamily = usePrefsStore((state) => state.appSettings.fontFamily);
  const setAppSettings = usePrefsStore((state) => state.setAppSettings);
  const textAlign = usePrefsStore((state) => state.appSettings.textAlign);

  const [page, setPage] = useState<Page | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [bookXp, setBookXp] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [xpBefore, setXpBefore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [pendingTrophy, setPendingTrophy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [langTop, setLangTop] = useState<Language>("en");
  const [langBottom, setLangBottom] = useState<Language>("es");
  const [availableLangs, setAvailableLangs] = useState<string[]>([]);
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);
  const toggleParagraph = (index: number | null) =>
    setActiveParagraph((prev) => (prev === index ? null : index));

  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const sentenceQueueRef = useRef<SentenceInfo[]>([]);
  const sentenceIdxRef = useRef(0);
  const navigatingRef = useRef(false);
  const autoPlayNextRef = useRef(false);

  // Refs to always have fresh values in callbacks without recreating them
  const pageRef = useRef(page);
  pageRef.current = page;
  const langTopRef = useRef(langTop);
  langTopRef.current = langTop;
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;
  const totalPagesRef = useRef(totalPages);
  totalPagesRef.current = totalPages;

  const stopAll = useCallback(() => {
    Speech.stop();
    setActiveSentenceIndex(null);
    setPlaying(false);
    autoPlayNextRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  // Stable function that reads latest values from refs
  const startAudio = useCallback((startFromIndex: number | null) => {
    const p = pageRef.current;
    const lang = langTopRef.current;
    if (!p) return;

    const content = lang === "es" ? p.contentEs : lang === "en" ? p.contentEn : p.contentFr;
    if (!content) return;

    const paragraphs = content
      .split(/\n\s*\n/)
      .map((para) => para.trim())
      .filter((para) => para.length > 0);
    const sentences = parseSentences(paragraphs);
    if (sentences.length === 0) return;

    let startIdx = 0;
    if (startFromIndex != null) {
      const found = sentences.findIndex((s) => s.globalIndex === startFromIndex);
      if (found >= 0) startIdx = found;
    }

    sentenceQueueRef.current = sentences;
    sentenceIdxRef.current = startIdx;
    setPlaying(true);

    const speakNext = () => {
      const idx = sentenceIdxRef.current;
      if (idx >= sentenceQueueRef.current.length) {
        setPlaying(false);
        setActiveSentenceIndex(null);
        if (currentPageRef.current < totalPagesRef.current) {
          autoPlayNextRef.current = true;
          goTo(currentPageRef.current + 1);
        }
        return;
      }
      setActiveSentenceIndex(sentenceQueueRef.current[idx].globalIndex);
      Speech.speak(sentenceQueueRef.current[idx].text, {
        language: langTopRef.current,
        rate: 0.8,
        onDone: () => {
          sentenceIdxRef.current++;
          speakNext();
        },
        onError: () => {
          sentenceIdxRef.current++;
          speakNext();
        },
      });
    };

    speakNext();
  }, []);

  const playAudio = useCallback(() => {
    if (playing) {
      stopAll();
      return;
    }
    startAudio(activeSentenceIndex);
  }, [playing, stopAll, activeSentenceIndex, startAudio]);

  // Auto-play next page when it loads
  useEffect(() => {
    if (autoPlayNextRef.current && page && !loading) {
      autoPlayNextRef.current = false;
      setActiveSentenceIndex(null);
      startAudio(null);
    }
  }, [page, loading]);

  const handleSentencePress = useCallback((sentenceGlobalIndex: number) => {
    setActiveSentenceIndex((prev) => (prev === sentenceGlobalIndex ? null : sentenceGlobalIndex));
  }, []);

  const startTimeRef = useRef(Date.now());
  const pagesReadRef = useRef(0);
  const initialLoadDone = useRef(false);

  // caché de páginas: { [pageNumber]: Page }
  // evita fetchear de Supabase si ya se visitó
  const pageCache = useRef<Record<number, Page>>({});

  const loadPage = useCallback(
    async (pageNumber: number) => {
      // si ya está en caché, lo muestra al instante sin spinner
      const cached = pageCache.current[pageNumber];
      if (cached) {
        setPage(cached);
        return cached;
      }
      // si no está en caché, fetch con spinner
      setLoading(true);
      const data = await getPage(bookId, pageNumber);
      if (data) {
        pageCache.current[pageNumber] = data;
        setPage(data);
      }
      setLoading(false);
      return data;
    },
    [bookId, getPage],
  );

  // precarga la página siguiente en background
  const prefetchNext = useCallback(
    async (fromPage: number) => {
      const next = fromPage + 1;
      if (next > totalPages || pageCache.current[next]) return;
      const data = await getPage(bookId, next);
      if (data) pageCache.current[next] = data;
    },
    [bookId, getPage, totalPages],
  );

  // init: carga metadata + páginas 1 y 2 en paralelo
  useEffect(() => {
    if (!bookId || !user) return;
    const init = async () => {
      const [{ totalPages, bookXp, bookTitle, xpBefore }, langs] = await Promise.all([
        initReader(bookId, user.id),
        getBookLanguages(bookId),
      ]);
      setTotalPages(totalPages);
      setBookXp(bookXp);
      setBookTitle(bookTitle);
      setXpBefore(xpBefore);
      if (langs.length > 0) {
        setAvailableLangs(langs);
        if (!langs.includes(langTop)) setLangTop(langs[0] as Language);
        if (!langs.includes(langBottom) && langs.length > 1) setLangBottom(langs[1] as Language);
      }

      // fetchea pág 1 y pág 2 al mismo tiempo
      const [page1, page2] = await Promise.all([
        getPage(bookId, 1),
        totalPages >= 2 ? getPage(bookId, 2) : Promise.resolve(null),
      ]);
      // guarda ambas en caché, pero muestra solo la pág 1
      if (page1) {
        pageCache.current[1] = page1;
        setPage(page1);
      }
      if (page2) pageCache.current[2] = page2;

      // oculta el spinner solo cuando ambas están listas
      setLoading(false);
      await saveProgress(user.id, bookId, 1, totalPages);
      initialLoadDone.current = true;
      // precarga la pág 3 en background
      if (totalPages >= 3) prefetchNext(2);
    };
    init();
  }, [bookId, user]);

  // cambio de página
  useEffect(() => {
    setActiveParagraph(null);
    if (!bookId || !user || !initialLoadDone.current) return;
    loadPage(currentPage);
    saveProgress(user.id, bookId, currentPage, totalPages);
    pagesReadRef.current += 1;
    prefetchNext(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!autoPlayNextRef.current) {
      stopAll();
    }
  }, [currentPage]);

  const goTo = (page: number) => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setCurrentPage(page);
    setTimeout(() => { navigatingRef.current = false; }, 1000);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goTo(currentPage + 1);
    } else {
      handleFinish();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) goTo(currentPage - 1);
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

    const newTrophies = await checkTrophies(user.id);

    await Promise.all([
      fetchTrophies(user.id),
      fetchUserBooks(user.id),
      fetchSessions(user.id),
      fetchXpEvents(user.id),
      refreshProfile(user.id),
    ]);

    if (newTrophies.length > 0) {
      setPendingTrophy(newTrophies[0]);
    } else {
      setCompleted(true);
    }
  };

  const getContent = (lang: Language) => {
    if (lang === "es") return page?.contentEs;
    if (lang === "en") return page?.contentEn;
    return page?.contentFr;
  };

  const pageParagraphs = useMemo(() => {
    const content = getContent(langTop);
    if (!content) return [];
    return content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [page, langTop]);

  const pageSentences = useMemo(() => parseSentences(pageParagraphs), [pageParagraphs]);

  if (pendingTrophy) {
    return (
      <TrophyUnlockedScreen
        trophy={pendingTrophy}
        onContinue={() => {
          setPendingTrophy(null);
          setCompleted(true);
        }}
      />
    );
  }

  if (completed) {
    return (
      <BookCompletedScreen
        xpBefore={xpBefore}
        xpGained={bookXp}
        bookTitle={bookTitle}
        onContinue={() => router.push("/(app)/home")}
      />
    );
  }

  const readerColors = THEME_COLORS[theme];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: readerColors.bg }}>
      <ReadingBar
        title={bookTitle}
        currentPage={currentPage}
        totalPages={totalPages}
        langTop={langTop}
        langBottom={langBottom}
        onLangTopChange={(lang) => setLangTop(lang as Language)}
        onLangBottomChange={(lang) => setLangBottom(lang as Language)}
        availableLangs={availableLangs}
        fontSize={fontSize}
        onFontSizeChange={(s) => setAppSettings({ fontSize: s })}
        theme={theme}
        onThemeChange={(t) => setAppSettings({ theme: t })}
        readerMode={readerMode}
        onReaderModeChange={(m) => setAppSettings({ readerMode: m })}
        boldEnabled={boldEnabled}
        onBoldEnabledChange={(v) => setAppSettings({ boldEnabled: v })}
        lineSpacing={lineSpacing}
        onLineSpacingChange={(v) => setAppSettings({ lineSpacing: v })}
        sideMargin={sideMargin}
        onSideMarginChange={(v) => setAppSettings({ sideMargin: v })}
        fontFamily={fontFamily}
        onFontFamilyChange={(v) => setAppSettings({ fontFamily: v })}
        textAlign={textAlign}
        onTextAlignChange={(v) => setAppSettings({ textAlign: v })}
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
          onParagraphPress={toggleParagraph}
          onSentencePress={handleSentencePress}
          fontSize={fontSize}
          theme={theme}
          boldEnabled={boldEnabled}
          lineSpacing={lineSpacing}
          sideMargin={sideMargin}
          fontFamily={fontFamily}
          textAlign={textAlign}
          sentences={pageSentences}
          activeSentenceIndex={activeSentenceIndex}
        />
      ) : readerMode === "interleaved" ? (
        <InterleavedReader
          contentTop={getContent(langTop) ?? ""}
          contentBottom={getContent(langBottom) ?? ""}
          langTop={langTop}
          langBottom={langBottom}
          bookId={bookId}
          pageId={page?.id ?? ""}
          activeParagraph={activeParagraph}
          onParagraphPress={toggleParagraph}
          onSentencePress={handleSentencePress}
          fontSize={fontSize}
          theme={theme}
          boldEnabled={boldEnabled}
          lineSpacing={lineSpacing}
          sideMargin={sideMargin}
          fontFamily={fontFamily}
          textAlign={textAlign}
          sentences={pageSentences}
          activeSentenceIndex={activeSentenceIndex}
        />
      ) : (
        <SingleReader
          content={getContent(langTop) ?? ""}
          language={langTop}
          bookId={bookId}
          pageId={page?.id ?? ""}
          activeParagraph={activeParagraph}
          onParagraphPress={toggleParagraph}
          onSentencePress={handleSentencePress}
          fontSize={fontSize}
          theme={theme}
          boldEnabled={boldEnabled}
          lineSpacing={lineSpacing}
          sideMargin={sideMargin}
          fontFamily={fontFamily}
          textAlign={textAlign}
          sentences={pageSentences}
          activeSentenceIndex={activeSentenceIndex}
        />
      )}

      {/* footer */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopWidth: 0.5,
          borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : colors.border,
          backgroundColor: readerColors.bg,
        }}
      >
        <TouchableOpacity
          onPress={prevPage}
          activeOpacity={0.7}
          disabled={currentPage <= 1}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: currentPage <= 1 ? (theme === "dark" ? "rgba(255,255,255,0.05)" : colors.border) : colors.primary,
            opacity: currentPage <= 1 ? 0.35 : 1,
          }}
        >
          <Text style={{ fontSize: 16, color: currentPage <= 1 ? readerColors.text : colors.white }}>‹</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: currentPage <= 1 ? readerColors.text : colors.white }}>
            Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={playAudio}
          activeOpacity={0.7}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: playing ? colors.primary : (theme === "dark" ? "rgba(255,255,255,0.12)" : colors.border),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: playing ? colors.white : readerColors.text }}>
            {playing ? "⏸" : "▶️"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={nextPage}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: colors.primary,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.white }}>
            {currentPage === totalPages ? "Terminar" : "Siguiente"}
          </Text>
          <Text style={{ fontSize: 16, color: colors.white }}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
