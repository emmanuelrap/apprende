import { BookSlider } from "@/src/components/BookSlider";
import { ChipSelector } from "@/src/components/ChipSelector";
import { FilterModal } from "@/src/components/FilterModal";
import { HomeLoading } from "@/src/components/HomeLoading";
import { RecorridoSlider } from "@/src/components/RecorridoSlider";
import { SearchInput } from "@/src/components/SearchInput";
import { TrophyUnlockedScreen } from "@/src/screens/TrophyUnlockedScreen";
import { getFavorites } from "@/src/services/favorites";
import { useAuthStore } from "@/src/store/authStore";
import { useBookStore } from "@/src/store/bookStore";
import { useFilterStore } from "@/src/store/filterStore";
import { useGamificationStore } from "@/src/store/gamificationStore";
import { useRecorridoStore } from "@/src/store/recorridoStore";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, RefreshControl, Text, TouchableOpacity, View } from "react-native";
// test para git

const TEAL = "#078F83";

const FILTROS_LECTURA = [
  { id: "all", name: "Todos" },
  { id: "new", name: "Sin leer" },
  { id: "reading", name: "Leyendo" },
  { id: "completed", name: "Leídos" },
];

function SectionHeader({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: TEAL }}>
            Ver más ›
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  const { profile, isLoading: authLoading, user } = useAuthStore();
  const { books, isLoading: booksLoading, fetchBooks } = useBookStore();
  const { recorridos, fetchRecorridos } = useRecorridoStore();
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
    fetchRecorridos();
    getFavorites(user.id).then((ids) => setFavoriteIds(new Set(ids)));
  }, [
    fetchBooks,
    fetchRecorridos,
    search,
    selectedCategories,
    selectedTag,
    user?.id,
  ]);

  const onRefresh = useCallback(async () => {
    if (!user?.id || refreshing) return;
    setRefreshing(true);
    try {
      await fetchBooks({
        tagId: selectedTag,
        categoryIds:
          selectedCategories.length > 0 ? selectedCategories : undefined,
        search,
      });
      await fetchRecorridos();
      const ids = await getFavorites(user.id);
      setFavoriteIds(new Set(ids));
    } finally {
      setRefreshing(false);
    }
  }, [
    user,
    refreshing,
    fetchBooks,
    fetchRecorridos,
    selectedTag,
    selectedCategories,
    search,
  ]);

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
    outputRange: ["360deg", "0deg"],
    extrapolate: "clamp",
  });
  const pullOpacity = scrollY.interpolate({
    inputRange: [-100, -20, 0],
    outputRange: [1, 0.4, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingHorizontal: 0,
          paddingTop: 12,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        bounces
        overScrollMode="always"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#078F83"
          />
        }
      >
        {/* Pull indicator */}
        <View
          style={{
            alignItems: "center",
            height: 24,
            justifyContent: "center",
            marginBottom: -24,
            overflow: "visible",
          }}
        >
          <Animated.Text
            style={{
              fontSize: 20,
              transform: [{ rotate: spin }],
              opacity: pullOpacity,
              color: "#078F83",
            }}
          >
            ↻
          </Animated.Text>
        </View>

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

        {/* Favorites slider */}
        {favoriteIds.size > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <SectionHeader
              title="Mis favoritos"
              onSeeAll={() =>
                router.push(
                  `/list?type=favorites&title=${encodeURIComponent("Mis favoritos")}` as any,
                )
              }
            />
            <BookSlider
              books={favoriteBooks.map((b) => ({
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
        )}

        {/* Recorridos */}
        {recorridos.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <SectionHeader
              title="Recorridos"
              onSeeAll={() =>
                router.push(
                  `/list?type=recorridos&title=${encodeURIComponent("Recorridos")}` as any,
                )
              }
            />
            <RecorridoSlider recorridos={recorridos} />
          </View>
        )}

        {/* Book slider */}
        {books.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <SectionHeader
              title="Descubrir"
              onSeeAll={() =>
                router.push(
                  `/list?type=discover&title=${encodeURIComponent("Descubrir")}` as any,
                )
              }
            />
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
          </View>
        )}

        {/* Category sliders */}
        {categories.map((cat) => {
          const catBooks = books.filter((b) =>
            b.categories?.some((c) => c.id === cat.id),
          );
          if (catBooks.length === 0) return null;
          return (
            <View key={cat.id} style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <SectionHeader
                title={cat.name}
                onSeeAll={() =>
                  router.push(
                    `/list?type=category&catId=${cat.id}&title=${encodeURIComponent(cat.name)}` as any,
                  )
                }
              />
              <BookSlider
                books={catBooks.map((b) => ({
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

        {/* Tag sliders */}
        {tags.map((tag) => {
          const tagBooks = books.filter((b) =>
            b.tags?.some((t) => t.id === tag.id),
          );
          if (tagBooks.length === 0) return null;
          return (
            <View key={tag.id} style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <SectionHeader
                title={tag.name}
                onSeeAll={() =>
                  router.push(
                    `/list?type=tag&tagId=${tag.id}&title=${encodeURIComponent(tag.name)}` as any,
                  )
                }
              />
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
