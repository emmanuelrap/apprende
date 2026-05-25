import { ChipSelector } from "@/src/components/ChipSelector";
import { HomeLoading } from "@/src/components/HomeLoading";
import { SearchInput } from "@/src/components/SearchInput";
import { TagsTabs } from "@/src/components/TagsTabs";
import { TrophyUnlockedScreen } from "@/src/screens/TrophyUnlockedScreen";
import { useAuthStore } from "@/src/store/authStore";
import { useBookStore } from "@/src/store/bookStore";
import { useFilterStore } from "@/src/store/filterStore";
import { useGamificationStore } from "@/src/store/gamificationStore";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DIFFICULTY: Record<number, string> = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

const FILTROS_LECTURA = [
  { id: "all", name: "Todos" },
  { id: "new", name: "Sin leer" },
  { id: "reading", name: "Leyendo" },
  { id: "completed", name: "Leidos" },
];

export default function HomeScreen() {
  const router = useRouter();

  const { profile, isLoading: authLoading, user } = useAuthStore();
  const { books, isLoading: booksLoading, fetchBooks } = useBookStore();
  const { categories } = useFilterStore();
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
      categoryIds: selectedCategories,
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
  const booksToRender = books.filter((book) => {
    if (!selectedFiltroLectura || selectedFiltroLectura === "all") return true;
    return book.status === selectedFiltroLectura;
  });

  if (pendingTrophy) {
    return (
      <TrophyUnlockedScreen
        trophy={pendingTrophy}
        onContinue={() => setPendingTrophy(null)}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          onFilterPress={() => setFilterOpen(true)}
        />

        <TagsTabs selected={selectedTag} onSelect={setSelectedTag} />

        {/* Filtro de lectura */}
        <ChipSelector
          chips={FILTROS_LECTURA}
          selected={selectedFiltroLectura}
          onSelect={setSelectedFiltroLectura}
          showAll={false}
        />

        <View style={{ marginBottom: 20 }}>
          <Text className="font-extrabold">Hola, {profile?.name ?? "-"}</Text>
          <Text style={{ color: "#64748B" }}>{profile?.xp ?? 0} XP</Text>
        </View>

        {booksToRender.map((book) => (
          <TouchableOpacity
            key={book.id}
            onPress={() => router.push(`/reader/${book.id}`)}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16 }}>
              {book.title}
            </Text>
            <Text style={{ color: "#64748B", marginBottom: 8 }}>
              {book.author}
            </Text>

            {book.categories.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 4,
                  marginBottom: 8,
                }}
              >
                {book.categories.map((cat) => (
                  <View
                    key={cat.id}
                    style={{
                      backgroundColor: "#EEF2FF",
                      borderRadius: 20,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: "#6366F1" }}>
                      {cat.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {book.tags.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 4,
                  marginBottom: 8,
                }}
              >
                {book.tags.map((tag) => (
                  <View
                    key={tag.id}
                    style={{
                      backgroundColor: "#F0FDF4",
                      borderRadius: 20,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: "#16A34A" }}>
                      {tag.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 12, marginBottom: 10 }}>
              <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                {book.totalPages} pags
              </Text>
              <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                {book.estimatedMinutes ?? 0} min
              </Text>
              <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                {DIFFICULTY[book.difficulty] ?? "-"}
              </Text>
              <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                {book.xp} XP
              </Text>
            </View>

            <View
              style={{ height: 6, backgroundColor: "#E2E8F0", borderRadius: 4 }}
            >
              <View
                style={{
                  height: 6,
                  borderRadius: 4,
                  backgroundColor:
                    book.status === "completed" ? "#16A34A" : "#6366F1",
                  width: `${book.progress}%`,
                }}
              />
            </View>
            <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>
              {book.status === "completed"
                ? "Completado"
                : `${book.progress}% - pag ${book.currentPage}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && (
        <HomeLoading />
      )}

      <Modal visible={filterOpen} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" }}
          onPress={() => setFilterOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              width: "80%",
              maxHeight: "70%",
            }}
            onPress={() => {}}
          >
            <Text style={{ fontSize: 17, fontWeight: "700", textAlign: "center", marginBottom: 16 }}>
              Categorías
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {categories.map((cat) => {
                const checked = selectedCategories.includes(cat.id);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(cat.id)
                          ? prev.filter((c) => c !== cat.id)
                          : [...prev, cat.id],
                      )
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      borderRadius: 10,
                      marginBottom: 4,
                      backgroundColor: checked ? "#E8F5F3" : "transparent",
                    }}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: checked ? "#078F83" : "#CBD5E1",
                        backgroundColor: checked ? "#078F83" : "transparent",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 12,
                      }}
                    >
                      {checked && <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>✓</Text>}
                    </View>
                    <Text style={{ fontSize: 15, color: "#1C1C1E", fontWeight: checked ? "600" : "400" }}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setFilterOpen(false)}
              style={{
                marginTop: 16,
                backgroundColor: "#078F83",
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Aplicar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
