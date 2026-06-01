import { BookCard } from "@/src/components/BookCard";
import { ChipSelector } from "@/src/components/ChipSelector";
import { FilterModal } from "@/src/components/FilterModal";
import { HomeLoading } from "@/src/components/HomeLoading";
import { ProfileCard } from "@/src/components/ProfileCard";
import { SearchInput } from "@/src/components/SearchInput";
import { TagsTabs } from "@/src/components/TagsTabs";
import { TrophyUnlockedScreen } from "@/src/screens/TrophyUnlockedScreen";
import { useAuthStore } from "@/src/store/authStore";
import { useBookStore } from "@/src/store/bookStore";
import { useFilterStore } from "@/src/store/filterStore";
import { useGamificationStore } from "@/src/store/gamificationStore";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

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
        <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: TEAL }} />
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
  const checkTrophies = useGamificationStore((s) => s.checkTrophies);
  const fetchTrophies = useGamificationStore((s) => s.fetchTrophies);

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingTrophy, setPendingTrophy] = useState<any>(null);
  const [selectedFiltroLectura, setSelectedFiltroLectura] =
    useState<string | null>("all");

  useEffect(() => {
    if (!user?.id) return;
    fetchBooks({
      tagId: selectedTag,
      categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
      search,
    });
  }, [fetchBooks, search, selectedCategories, selectedTag, user?.id]);

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
      return () => { mounted = false; };
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

  if (pendingTrophy) {
    return (
      <TrophyUnlockedScreen
        trophy={pendingTrophy}
        onContinue={() => setPendingTrophy(null)}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={{ paddingHorizontal: 16 }}>
          <ProfileCard name={profile?.name ?? "-"} xp={profile?.xp ?? 0} level={profile?.level ?? 1} />
        </View>

        {/* Search + filter */}
        <SearchInput
          value={search}
          onChangeText={setSearch}
          onFilterPress={() => setFilterOpen(true)}
        />

        {/* Tag tabs */}
        <TagsTabs selected={selectedTag} onSelect={setSelectedTag} />

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
              hasFilters={!!(search || selectedCategories.length > 0 || selectedTag)}
            />
          ) : (
            <>
              {/* Continue reading section */}
              {readingBooks.length > 0 && selectedFiltroLectura === "all" && (
                <View style={{ marginBottom: 8 }}>
                  <SectionHeader title="Continue leyendo" count={readingBooks.length} />
                  {readingBooks.map((book) => {
                    const locked = book.minLevel != null && userLevel < book.minLevel;
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
                      : FILTROS_LECTURA.find((f) => f.id === selectedFiltroLectura)?.name ?? "Libros"
                  }
                  count={booksToRender.length}
                />
                {(selectedFiltroLectura !== "all" ? booksToRender : otherBooks).map((book) => {
                  const locked = book.minLevel != null && userLevel < book.minLevel;
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
      </ScrollView>

      {loading && <HomeLoading />}

      <FilterModal
        visible={filterOpen}
        categories={categories}
        selected={selectedCategories}
        onToggle={(id) =>
          setSelectedCategories((prev) =>
            prev.includes(id)
              ? prev.filter((c) => c !== id)
              : [...prev, id],
          )
        }
        onClose={() => setFilterOpen(false)}
      />
    </View>
  );
}
