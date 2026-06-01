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
import { THEME_COLORS } from "@/src/theme";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
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
  audioEs: string | null;
  audioEn: string | null;
};

type Language = "es" | "en";

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

  const fontSize = usePrefsStore((state) => state.appSettings.fontSize);
  const theme = usePrefsStore((state) => state.appSettings.theme);
  const readerMode = usePrefsStore((state) => state.appSettings.readerMode);
  const boldEnabled = usePrefsStore((state) => state.appSettings.boldEnabled);
  const lineSpacing = usePrefsStore((state) => state.appSettings.lineSpacing);
  const sideMargin = usePrefsStore((state) => state.appSettings.sideMargin);
  const fontFamily = usePrefsStore((state) => state.appSettings.fontFamily);
  const setAppSettings = usePrefsStore((state) => state.setAppSettings);

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
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);
  const toggleParagraph = (index: number | null) =>
    setActiveParagraph((prev) => (prev === index ? null : index));

  const [playing, setPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isTTS = useRef(false);
  const navigatingRef = useRef(false);

  const stopAll = useCallback(async () => {
    if (soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.stopAsync();
      }
    }
    Speech.stop();
    setPlaying(false);
  }, []);

  const playAudio = async () => {
    const content = langTop === "en" ? page?.contentEn : page?.contentEs;
    const url = langTop === "en" ? page?.audioEn : page?.audioEs;
    if (!content) return;

    if (playing) {
      await stopAll();
      return;
    }

    if (url) {
      try {
        isTTS.current = false;
        const { sound } = await Audio.Sound.createAsync({ uri: url });
        soundRef.current = sound;
        setPlaying(true);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying) setPlaying(false);
        });
        await sound.playAsync();
      } catch {
        setPlaying(false);
      }
    } else {
      isTTS.current = true;
      setPlaying(true);
      Speech.speak(content, {
        language: langTop === "en" ? "en" : "es",
        rate: 0.8,
        onDone: () => setPlaying(false),
        onError: () => setPlaying(false),
      });
    }
  };

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      Speech.stop();
    };
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
      const { totalPages, bookXp, bookTitle, xpBefore } = await initReader(
        bookId,
        user.id,
      );
      setTotalPages(totalPages);
      setBookXp(bookXp);
      setBookTitle(bookTitle);
      setXpBefore(xpBefore);

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
    stopAll();
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

  const getContent = (lang: Language) =>
    lang === "es" ? page?.contentEs : page?.contentEn;

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
        boldEnabled={boldEnabled}
        onBoldEnabledChange={(v) => setAppSettings({ boldEnabled: v })}
        lineSpacing={lineSpacing}
        onLineSpacingChange={(v) => setAppSettings({ lineSpacing: v })}
        sideMargin={sideMargin}
        onSideMarginChange={(v) => setAppSettings({ sideMargin: v })}
        fontFamily={fontFamily}
        onFontFamilyChange={(v) => setAppSettings({ fontFamily: v })}
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
          fontSize={fontSize}
          theme={theme}
          boldEnabled={boldEnabled}
          lineSpacing={lineSpacing}
          sideMargin={sideMargin}
          fontFamily={fontFamily}
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
          fontSize={fontSize}
          theme={theme}
          boldEnabled={boldEnabled}
          lineSpacing={lineSpacing}
          sideMargin={sideMargin}
          fontFamily={fontFamily}
        />
      ) : (
        <SingleReader
          content={getContent(langTop) ?? ""}
          language={langTop}
          bookId={bookId}
          pageId={page?.id ?? ""}
          activeParagraph={activeParagraph}
          onParagraphPress={toggleParagraph}
          fontSize={fontSize}
          theme={theme}
          boldEnabled={boldEnabled}
          lineSpacing={lineSpacing}
          sideMargin={sideMargin}
          fontFamily={fontFamily}
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
          alignItems: "center",
          borderTopWidth: 1,
          borderColor: theme === "dark" ? "#333" : "#ddd",
          backgroundColor: colors.bg,
        }}
      >
        <TouchableOpacity onPress={prevPage}>
          <Text style={{ color: colors.text }}>⬅️ Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={playAudio}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: playing ? "#078F83" : "#CBD5E1",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "#fff" }}>
            {playing ? "⏸" : "▶️"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextPage}>
          <Text style={{ color: colors.text }}>
            ➡️ {currentPage === totalPages ? "Terminar" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
