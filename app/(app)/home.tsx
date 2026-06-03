import { BookCard } from "@/src/components/BookCard";
import { BookSlider } from "@/src/components/BookSlider";
import { ChipSelector } from "@/src/components/ChipSelector";
import { FilterModal } from "@/src/components/FilterModal";
import { HomeLoading } from "@/src/components/HomeLoading";
import { ProfileCard } from "@/src/components/ProfileCard";
import { SearchInput } from "@/src/components/SearchInput";
import { TrophyUnlockedScreen } from "@/src/screens/TrophyUnlockedScreen";
import { getFavorites } from "@/src/services/favorites";
import { useAuthStore } from "@/src/store/authStore";
import { useBookStore } from "@/src/store/bookStore";
import { useFilterStore } from "@/src/store/filterStore";
import { useGamificationStore } from "@/src/store/gamificationStore";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, RefreshControl, Text, View } from "react-native";

const TEAL = "#078F83";

const FILTROS_LECTURA = [
  { id: "all", name: "Todos" },
  { id: "new", name: "Sin leer" },
  { id: "reading", name: "Leyendo" },
  { id: "completed", name: "Leídos" },
];

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 12,
        marginTop: 4,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 3,
            height: 16,
            borderRadius: 2,
            backgroundColor: TEAL,
          }}
        />
        <Text style={{ fontSize: 17, fontWeight: "700", color: "#0F172A" }}>
          {title}
        </Text>
      </View>
      {count !== undefined && (
        <Text style={{ fontSize: 12, color: "#94A3B8" }}>
          {count} libro{count !== 1 ? "s" : ""}
        </Text>
      )}
    </View>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 48, gap: 12 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#E8F5F3",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 36 }}>📚</Text>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#64748B",
          textAlign: "center",
        }}
      >
        {hasFilters
          ? "No hay libros con esos filtros"
          : "Aún no hay libros disponibles"}
      </Text>
      {hasFilters && (
        <Text style={{ fontSize: 13, color: "#94A3B8", textAlign: "center" }}>
          Probá con otros términos o categorías
        </Text>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  const { profile, isLoading: authLoading, user } = useAuthStore();
  const { books, isLoading: booksLoading, fetchBooks } = useBookStore();
  const categories = useFilterStore((s) => s.categories);
  const tags = useFilterStore((s) => s.tags);
  const checkTrophies = useGamificationStore((s) => s.checkTrophies);
  const fetchTrophies = useGamificationStore((s) => s.fetchTrophies);

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingTrophy, setPendingTrophy] = useState<any>(null);
  const [selectedFiltroLectura, setSelectedFiltroLectura] = useState<
    string | null
  >("all");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user?.id) return;
    fetchBooks({
      tagId: selectedTag,
      categoryIds:
        selectedCategories.length > 0 ? selectedCategories : undefined,
      search,
    });
    getFavorites(user.id).then((ids) => setFavoriteIds(new Set(ids)));
  }, [fetchBooks, search, selectedCategories, selectedTag, user?.id]);

  const onRefresh = useCallback(async () => {
    if (!user?.id || refreshing) return;
    setRefreshing(true);
    try {
      await fetchBooks({
        tagId: selectedTag,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        search,
      });
      const ids = await getFavorites(user.id);
      setFavoriteIds(new Set(ids));
    } finally {
      setRefreshing(false);
    }
  }, [user, refreshing, fetchBooks, selectedTag, selectedCategories, search]);

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

  const loading = authLoading || booksLoading;
  const userLevel = profile?.level ?? 1;
  const booksToRender = books.filter((book) => {
    if (!selectedFiltroLectura || selectedFiltroLectura === "all") return true;
    return book.status === selectedFiltroLectura;
  });
  const readingBooks = booksToRender.filter((b) => b.status === "reading");
  const otherBooks = booksToRender.filter((b) => b.status !== "reading");
  const favoriteBooks = books.filter((b) => favoriteIds.has(b.id));

  const toggleFav = useCallback((bookId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  }, []);

  if (pendingTrophy) {
    return (
      <TrophyUnlockedScreen
        trophy={pendingTrophy}
        onContinue={() => setPendingTrophy(null)}
      />
    );
  }

  const spin = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: ['360deg', '0deg'],
    extrapolate: 'clamp',
  });
  const pullOpacity = scrollY.interpolate({
    inputRange: [-100, -20, 0],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        bounces
        overScrollMode="always"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#078F83" />
        }
      >
        {/* Pull indicator */}
        <View style={{ alignItems: 'center', height: 24, justifyContent: 'center', marginBottom: -24, overflow: 'visible' }}>
          <Animated.Text
            style={{
              fontSize: 20,
              transform: [{ rotate: spin }],
              opacity: pullOpacity,
              color: '#078F83',
            }}
          >
            ↻
          </Animated.Text>
        </View>

        {/* Profile card */}
        <View style={{ paddingHorizontal: 16 }}>
          <ProfileCard
            name={profile?.name ?? "-"}
            xp={profile?.xp ?? 0}
            level={profile?.level ?? 1}
          />
        </View>

        {/* Book slider */}
        {books.length > 0 && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 16,
                marginTop: 8,
              }}
            >
              <View
                style={{
                  width: 3,
                  height: 16,
                  borderRadius: 2,
                  backgroundColor: "#078F83",
                }}
              />
              <Text
                style={{ fontSize: 17, fontWeight: "700", color: "#0F172A" }}
              >
                Descubrir
              </Text>
            </View>
            <BookSlider
              books={books.map((b) => ({
                id: b.id,
                title: b.title,
                cover: b.cover,
                difficulty: b.difficulty,
              }))}
              favoriteIds={favoriteIds}
              userId={user?.id ?? ""}
              onToggleFavorite={toggleFav}
            />
          </>
        )}

        {/* Favorites slider */}
        {favoriteIds.size > 0 && (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, marginTop: 16 }}>
              <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: "#078F83" }} />
              <Text style={{ fontSize: 17, fontWeight: "700", color: "#0F172A" }}>Mis favoritos</Text>
            </View>
            <BookSlider
              books={favoriteBooks.map((b) => ({ id: b.id, title: b.title, cover: b.cover, difficulty: b.difficulty }))}
              favoriteIds={favoriteIds}
              userId={user?.id ?? ""}
              onToggleFavorite={toggleFav}
            />
          </View>
        )}

        {/* Continue reading slider */}
        {readingBooks.length > 0 && (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, marginTop: 16 }}>
              <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: "#078F83" }} />
              <Text style={{ fontSize: 17, fontWeight: "700", color: "#0F172A" }}>Continue leyendo</Text>
            </View>
            <BookSlider
              books={readingBooks.map((b) => ({ id: b.id, title: b.title, cover: b.cover, difficulty: b.difficulty }))}
              favoriteIds={favoriteIds}
              userId={user?.id ?? ""}
              onToggleFavorite={toggleFav}
            />
          </View>
        )}

        {/* Tag sliders */}
        {tags.map((tag) => {
          const tagBooks = books.filter((b) =>
            b.tags?.some((t) => t.id === tag.id),
          );
          if (tagBooks.length === 0) return null;
          return (
            <View key={tag.id}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 16,
                  marginTop: 16,
                }}
              >
                <View
                  style={{
                    width: 3,
                    height: 16,
                    borderRadius: 2,
                    backgroundColor: "#078F83",
                  }}
                />
                <Text
                  style={{ fontSize: 17, fontWeight: "700", color: "#0F172A" }}
                >
                  {tag.name}
                </Text>
              </View>
              <BookSlider
                books={tagBooks.map((b) => ({
                  id: b.id,
                  title: b.title,
                  cover: b.cover,
                  difficulty: b.difficulty,
                }))}
                favoriteIds={favoriteIds}
                userId={user?.id ?? ""}
                onToggleFavorite={toggleFav}
              />
            </View>
          );
        })}

        {/* Search + filter */}
        <SearchInput
          value={search}
          onChangeText={setSearch}
          onFilterPress={() => setFilterOpen(true)}
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

        {/* Content */}
        <View style={{ paddingHorizontal: 16 }}>
          {booksToRender.length === 0 && !loading ? (
            <EmptyState
              hasFilters={
                !!(search || selectedCategories.length > 0 || selectedTag)
              }
            />
          ) : (
            <>
              {/* Continue reading section */}
              {readingBooks.length > 0 && selectedFiltroLectura === "all" && (
                <View style={{ marginBottom: 8 }}>
                  <SectionHeader
                    title="Continue leyendo"
                    count={readingBooks.length}
                  />
                  {readingBooks.map((book) => {
                    const locked =
                      book.minLevel != null && userLevel < book.minLevel;
                    return (
                      <BookCard
                        key={book.id}
                        book={book}
                        userLevel={userLevel}
                        onPress={() => {
                          if (locked) return;
                          router.push(`/book/${book.id}`);
                        }}
                      />
                    );
                  })}
                </View>
              )}

              {/* All books section */}
              <View style={{ marginBottom: 8 }}>
                <SectionHeader
                  title={
                    selectedFiltroLectura === "all"
                      ? "Todos los libros"
                      : (FILTROS_LECTURA.find(
                          (f) => f.id === selectedFiltroLectura,
                        )?.name ?? "Libros")
                  }
                  count={booksToRender.length}
                />
                {(selectedFiltroLectura !== "all"
                  ? booksToRender
                  : otherBooks
                ).map((book) => {
                  const locked =
                    book.minLevel != null && userLevel < book.minLevel;
                  return (
                    <BookCard
                      key={book.id}
                      book={book}
                      userLevel={userLevel}
                      onPress={() => {
                        if (locked) return;
                        router.push(`/book/${book.id}`);
                      }}
                    />
                  );
                })}
              </View>
            </>
          )}
        </View>
      </Animated.ScrollView>

      {loading && <HomeLoading />}

      <FilterModal
        visible={filterOpen}
        categories={categories}
        selected={selectedCategories}
        onToggle={(id) =>
          setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
          )
        }
        onClose={() => setFilterOpen(false)}
      />
    </View>
  );
}
