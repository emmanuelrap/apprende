import { AppBar } from "@/src/components/AppBar";
import { BookSlider } from "@/src/components/BookSlider";
import { ChipSelector } from "@/src/components/ChipSelector";
import { FilterModal } from "@/src/components/FilterModal";
import { HomeLoading } from "@/src/components/HomeLoading";
import { RecorridoSlider } from "@/src/components/RecorridoSlider";
import { SearchInput } from "@/src/components/SearchInput";
import { TrophyUnlockedScreen } from "@/src/screens/TrophyUnlockedScreen";
import { getBooksWithProgress } from "@/src/services/books";
import { getFavorites } from "@/src/services/favorites";
import { supabase } from "@/src/services/supabase";
import { consumeHomeRefreshSignal } from "@/src/services/refreshSignal";
import { useAuthStore } from "@/src/store/authStore";
import { useFilterStore } from "@/src/store/filterStore";
import { useGamificationStore } from "@/src/store/gamificationStore";
import { useRecorridoStore } from "@/src/store/recorridoStore";
import { colors, typography } from "@/src/theme";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

const FILTROS_LECTURA = [
  { id: "all", name: "Todos" },
  { id: "new", name: "Sin leer" },
  { id: "reading", name: "Leyendo" },
  { id: "completed", name: "Leídos" },
];
const MAX_VISIBLE = 10;

function SkeletonBlock({ width, height, borderRadius = 12 }: { width: number | string; height: number; borderRadius?: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width: width as any,
        height,
        borderRadius,
        backgroundColor: "#D1D5DB",
        opacity,
      }}
    />
  );
}

function LoadingBar() {
  const slide = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(slide, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(slide, { toValue: -1, duration: 1000, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View style={{ height: 3, marginHorizontal: 16, borderRadius: 2, overflow: "hidden", backgroundColor: colors.primaryBg }}>
      <Animated.View
        style={{
          width: "30%",
          height: "100%",
          backgroundColor: colors.primary,
          borderRadius: 2,
          transform: [
            {
              translateX: slide.interpolate({
                inputRange: [-1, 1],
                outputRange: [-100, 300],
              }),
            },
          ],
        }}
      />
    </View>
  );
}

function FilterSkeleton() {
  return (
    <View style={{ gap: 20, marginTop: 16 }}>
      <View style={{ paddingHorizontal: 16 }}>
        <SkeletonBlock width={100} height={16} borderRadius={4} />
        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <SkeletonBlock width={120} height={180} />
          <SkeletonBlock width={120} height={180} />
          <SkeletonBlock width={120} height={180} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <SkeletonBlock width={90} height={16} borderRadius={4} />
        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <SkeletonBlock width={280} height={160} borderRadius={16} />
          <SkeletonBlock width={280} height={160} borderRadius={16} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <SkeletonBlock width={110} height={16} borderRadius={4} />
        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <SkeletonBlock width={120} height={160} />
          <SkeletonBlock width={120} height={160} />
          <SkeletonBlock width={120} height={160} />
        </View>
      </View>
    </View>
  );
}

function EmptyFilterState({ filter }: { filter: string }) {
  const config = {
    new: { icon: "📖", title: "Sin libros nuevos", subtitle: "No hay libros o recorridos sin empezar con estos filtros." },
    reading: { icon: "📚", title: "Nada en curso", subtitle: "No tienes libros o recorridos en lectura con estos filtros." },
    completed: { icon: "✅", title: "Nada completado", subtitle: "No hay libros o recorridos completados con estos filtros." },
  };
  const { icon, title, subtitle } = config[filter as keyof typeof config] ?? config.new;
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 40, alignItems: "center", gap: 12 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryBg, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 36 }}>{icon}</Text>
      </View>
      <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text, textAlign: "center" }}>{title}</Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center", lineHeight: 20, maxWidth: 280 }}>{subtitle}</Text>
    </View>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        marginTop: 4,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View
          style={{
            width: 4,
            height: 20,
            borderRadius: 2,
            backgroundColor: colors.primary,
          }}
        />
        <Text style={{ fontSize: 17, fontWeight: "700", color: colors.text, letterSpacing: -0.3 }}>
          {title}
        </Text>
      </View>
      {count !== undefined && (
        <View
          style={{
            backgroundColor: colors.primaryBg,
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "600", color: colors.primaryDarkest }}>
            {count}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  const { profile, isLoading: authLoading, user } = useAuthStore();
  const { recorridos, fetchRecorridos } = useRecorridoStore();
  const categories = useFilterStore((s) => s.categories);
  const tags = useFilterStore((s) => s.tags);
  const checkTrophies = useGamificationStore((s) => s.checkTrophies);
  const fetchTrophies = useGamificationStore((s) => s.fetchTrophies);

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOpening, setFilterOpening] = useState(false);
  const [pendingTrophy, setPendingTrophy] = useState<any>(null);
  const [selectedFiltroLectura, setSelectedFiltroLectura] = useState<string | null>("all");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [discoverBooks, setDiscoverBooks] = useState<any[]>([]);
  const [categoryBooksMap, setCategoryBooksMap] = useState<Record<string, any[]>>({});
  const [tagBooksMap, setTagBooksMap] = useState<Record<string, any[]>>({});
  const [favoriteBooks, setFavoriteBooks] = useState<any[]>([]);
  const [readingBooks, setReadingBooks] = useState<any[]>([]);

  const fetchSectionData = useCallback(async () => {
    if (!user?.id) return;
    setFetchError(null);
    const isFirstLoad = isLoading;
    if (!isFirstLoad) setIsFiltering(true);

    const catFilter = selectedCategories.length > 0 ? selectedCategories : undefined;
    const tagFilter = selectedTag || undefined;
    const searchFilter = search || undefined;
    const statusFilter = selectedFiltroLectura === "all" ? undefined : (selectedFiltroLectura ?? undefined);
    const baseFilters = { search: searchFilter, tagId: tagFilter, status: statusFilter };

    // Descubrir
    const discoverP = getBooksWithProgress(user.id, {
      ...baseFilters,
      categoryIds: catFilter,
      limit: MAX_VISIBLE,
    });

    // Category sliders: each fetches its own books + applies tag/search filters
    const catPromises = categories
      .filter((cat) => !catFilter || catFilter.includes(cat.id))
      .map((cat) =>
        getBooksWithProgress(user.id, {
          ...baseFilters,
          categoryIds: [cat.id],
          limit: MAX_VISIBLE + 1,
        }).then((books) => ({ catId: cat.id, books })),
      );

    // Tag sliders: each fetches its own books + applies category/search filters
    const tagPromises = tags
      .filter((tag) => !tagFilter || tagFilter === tag.id)
      .map((tag) =>
        getBooksWithProgress(user.id, {
          search: searchFilter,
          categoryIds: catFilter,
          tagId: tag.id,
          status: statusFilter,
          limit: MAX_VISIBLE + 1,
        }).then((books) => ({ tagId: tag.id, books })),
      );

    // Favorites: get IDs first, then fetch books
    const favIds = await getFavorites(user.id);
    setFavoriteIds(new Set(favIds));

    const favP =
      favIds.length > 0
        ? getBooksWithProgress(user.id, {
            ...baseFilters,
            bookIds: favIds,
            limit: MAX_VISIBLE,
          })
        : Promise.resolve([]);

    const readingP = getBooksWithProgress(user.id, {
      ...baseFilters,
      status: "reading",
      limit: MAX_VISIBLE,
    });

    let discovered: any[], catResults: any[], tagResults: any[], favBooks: any[], reading: any[];
    try {
      [discovered, catResults, tagResults, favBooks, reading] = await Promise.all([
        discoverP,
        Promise.all(catPromises),
        Promise.all(tagPromises),
        favP,
        readingP,
      ]);
    } catch (e) {
      setFetchError("Error al cargar datos. Intenta de nuevo.");
      setIsLoading(false);
      setIsFiltering(false);
      return;
    }

    setDiscoverBooks(discovered);
    setFavoriteBooks(favBooks);
    setReadingBooks(reading);

    const catMap: Record<string, any[]> = {};
    catResults.forEach((r: any) => {
      catMap[r.catId] = r.books;
    });
    setCategoryBooksMap(catMap);

    const tagMap: Record<string, any[]> = {};
    tagResults.forEach((r: any) => {
      tagMap[r.tagId] = r.books;
    });
    setTagBooksMap(tagMap);

    setIsLoading(false);
    setIsFiltering(false);
  }, [user?.id, categories, tags, search, selectedTag, selectedCategories, selectedFiltroLectura]);

  const lastFetchTime = useRef(0);
  const FETCH_COOLDOWN = 30_000;

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      const needsRefresh = consumeHomeRefreshSignal() > 0;
      const isStale = Date.now() - lastFetchTime.current > FETCH_COOLDOWN;
      const isEmpty = discoverBooks.length === 0 && readingBooks.length === 0;
      if (!needsRefresh && !isEmpty && !isStale) return;
      lastFetchTime.current = Date.now();
      fetchSectionData();
      fetchRecorridos();
    }, [fetchSectionData, fetchRecorridos, user?.id, discoverBooks.length, readingBooks.length]),
  );

  const onRefresh = useCallback(async () => {
    if (!user?.id || refreshing) return;
    setRefreshing(true);
    try {
      await Promise.all([fetchSectionData(), fetchRecorridos()]);
    } finally {
      setRefreshing(false);
    }
  }, [user, refreshing, fetchSectionData, fetchRecorridos]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      let mounted = true;
      (async () => {
        const newTrophies = await checkTrophies(user.id);
        if (newTrophies.length > 0) {
          await fetchTrophies(user.id);
          if (mounted) setPendingTrophy(newTrophies[0]);
        }
      })();
      return () => {
        mounted = false;
      };
    }, [user?.id, checkTrophies, fetchTrophies]),
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user]);

  const loading = authLoading || isLoading || refreshing;
  const userLevel = profile?.level ?? 1;

  const filteredRecorridos = useMemo(() =>
    recorridos.filter((r) => {
      if (selectedFiltroLectura === "all") return true;
      if (selectedFiltroLectura === "new") return r.status === "not_started";
      if (selectedFiltroLectura === "reading") return r.status === "in_progress";
      if (selectedFiltroLectura === "completed") return r.status === "completed";
      return true;
    }),
    [recorridos, selectedFiltroLectura],
  );

  const hasContent = readingBooks.length > 0 || favoriteBooks.length > 0 ||
    filteredRecorridos.length > 0 || discoverBooks.length > 0 ||
    categories.some((cat) => (categoryBooksMap[cat.id] ?? []).length > 0) ||
    tags.some((tag) => (tagBooksMap[tag.id] ?? []).length > 0);

  const toggleFav = useCallback((bookId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
    setFavoriteBooks((prev) => {
      const exists = prev.some((b) => b.id === bookId);
      if (exists) return prev.filter((b) => b.id !== bookId);
      const fromDiscover = discoverBooks.find((b) => b.id === bookId);
      if (fromDiscover) return [...prev, fromDiscover];
      for (const list of Object.values(categoryBooksMap)) {
        const found = (list as any[]).find((b: any) => b.id === bookId);
        if (found) return [...prev, found];
      }
      for (const list of Object.values(tagBooksMap)) {
        const found = (list as any[]).find((b: any) => b.id === bookId);
        if (found) return [...prev, found];
      }
      return prev;
    });
  }, [discoverBooks, categoryBooksMap, tagBooksMap]);

  if (pendingTrophy) {
    return (
      <TrophyUnlockedScreen
        trophy={pendingTrophy}
        onContinue={() => setPendingTrophy(null)}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar />
      {fetchError ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 12 }}>
          <Text style={{ fontSize: 40 }}>⚠️</Text>
          <Text style={{ ...typography.body, textAlign: "center", color: colors.textSecondary }}>
            {fetchError}
          </Text>
          <TouchableOpacity
            onPress={() => { setIsLoading(true); fetchSectionData(); }}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingHorizontal: 24,
              paddingVertical: 12,
              marginTop: 4,
            }}
          >
            <Text style={{ fontWeight: "700", color: "#fff" }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 0,
          paddingTop: 4,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        bounces
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Search + filter */}
        <SearchInput
          value={search}
          onChangeText={setSearch}
          onFilterPress={() => {
            setFilterOpening(true);
            requestAnimationFrame(() => {
              setFilterOpen(true);
              setFilterOpening(false);
            });
          }}
          filterLoading={filterOpening}
        />

        {/* Status filter chips */}
        <View style={{ paddingHorizontal: 16 }}>
          <ChipSelector
            chips={FILTROS_LECTURA}
            selected={selectedFiltroLectura}
            onSelect={setSelectedFiltroLectura}
            showAll={false}
          />
        </View>

        {isFiltering && <LoadingBar />}

        {isFiltering ? (
          <FilterSkeleton />
        ) : (
          <>
            {/* Continue reading slider */}
            {readingBooks.length > 0 && (
              <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                <SectionHeader title="Continue leyendo" count={readingBooks.length} />
                <BookSlider
                  books={readingBooks.slice(0, MAX_VISIBLE).map((b) => ({
                    id: b.id,
                    title: b.title,
                    cover: b.cover,
                    difficulty: b.difficulty,
                    progress: b.progress,
                    status: b.status,
                  }))}
                  favoriteIds={favoriteIds}
                  userId={user?.id ?? ""}
                  onToggleFavorite={toggleFav}
                  onSeeAll={readingBooks.length > MAX_VISIBLE ? () =>
                    router.push(
                      `/list?type=reading&title=${encodeURIComponent("Continue leyendo")}` as any,
                    )
                  : undefined}
                />
              </View>
            )}

            {/* Favorites slider */}
            {favoriteBooks.length > 0 && (
              <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                <SectionHeader title="Mis favoritos" />
                <BookSlider
                  books={favoriteBooks.slice(0, MAX_VISIBLE).map((b) => ({
                    id: b.id,
                    title: b.title,
                    cover: b.cover,
                    difficulty: b.difficulty,
                    progress: b.progress,
                    status: b.status,
                  }))}
                  favoriteIds={favoriteIds}
                  userId={user?.id ?? ""}
                  onToggleFavorite={toggleFav}
                  onSeeAll={favoriteIds.size > MAX_VISIBLE ? () =>
                    router.push(
                      `/list?type=favorites&title=${encodeURIComponent("Mis favoritos")}` as any,
                    )
                  : undefined}
                />
              </View>
            )}

            {/* Recorridos — filtrados por estado de lectura */}
            {filteredRecorridos.length > 0 && (
              <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
                <SectionHeader title="Recorridos" />
                <RecorridoSlider
                  recorridos={filteredRecorridos}
                  onSeeAll={filteredRecorridos.length > MAX_VISIBLE ? () =>
                    router.push(
                      `/list?type=recorridos&title=${encodeURIComponent("Recorridos")}` as any,
                    )
                  : undefined}
                />
              </View>
            )}

            {/* Discover slider */}
            {discoverBooks.length > 0 && (
              <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
                <SectionHeader title="Descubrir" />
                <BookSlider
                  books={discoverBooks.slice(0, MAX_VISIBLE).map((b) => ({
                    id: b.id,
                    title: b.title,
                    cover: b.cover,
                    difficulty: b.difficulty,
                    progress: b.progress,
                    status: b.status,
                  }))}
                  favoriteIds={favoriteIds}
                  userId={user?.id ?? ""}
                  onToggleFavorite={toggleFav}
                  onSeeAll={discoverBooks.length > MAX_VISIBLE ? () =>
                    router.push(
                      `/list?type=discover&title=${encodeURIComponent("Descubrir")}` as any,
                    )
                  : undefined}
                />
              </View>
            )}

            {/* Category sliders */}
            {categories.map((cat) => {
              const catBooks = categoryBooksMap[cat.id] ?? [];
              if (catBooks.length === 0) return null;
              const visible = catBooks.slice(0, MAX_VISIBLE);
              return (
                <View key={cat.id} style={{ paddingHorizontal: 16, marginTop: 16 }}>
                  <SectionHeader title={cat.name} />
                  <BookSlider
                    books={visible.map((b) => ({
                      id: b.id,
                      title: b.title,
                      cover: b.cover,
                      difficulty: b.difficulty,
                      progress: b.progress,
                      status: b.status,
                    }))}
                    favoriteIds={favoriteIds}
                    userId={user?.id ?? ""}
                    onToggleFavorite={toggleFav}
                    onSeeAll={catBooks.length > MAX_VISIBLE ? () =>
                      router.push(
                        `/list?type=category&catId=${cat.id}&title=${encodeURIComponent(cat.name)}` as any,
                      )
                    : undefined}
                  />
                </View>
              );
            })}

            {/* Tag sliders */}
            {tags.map((tag) => {
              const tagBooks = tagBooksMap[tag.id] ?? [];
              if (tagBooks.length === 0) return null;
              const visible = tagBooks.slice(0, MAX_VISIBLE);
              return (
                <View key={tag.id} style={{ paddingHorizontal: 16, marginTop: 16 }}>
                  <SectionHeader title={tag.name} />
                  <BookSlider
                    books={visible.map((b) => ({
                      id: b.id,
                      title: b.title,
                      cover: b.cover,
                      difficulty: b.difficulty,
                      progress: b.progress,
                      status: b.status,
                    }))}
                    favoriteIds={favoriteIds}
                    userId={user?.id ?? ""}
                    onToggleFavorite={toggleFav}
                    onSeeAll={tagBooks.length > MAX_VISIBLE ? () =>
                      router.push(
                        `/list?type=tag&tagId=${tag.id}&title=${encodeURIComponent(tag.name)}` as any,
                      )
                    : undefined}
                  />
                </View>
              );
            })}

            {selectedFiltroLectura !== "all" && !hasContent && (
              <EmptyFilterState filter={selectedFiltroLectura ?? "new"} />
            )}
          </>
        )}

      </ScrollView>
      )}

      {loading && <HomeLoading />}

      <FilterModal
        visible={filterOpen}
        categories={categories}
        selected={selectedCategories}
        onApply={(ids) => setSelectedCategories(ids)}
        onClose={() => setFilterOpen(false)}
      />
    </View>
  );
}
