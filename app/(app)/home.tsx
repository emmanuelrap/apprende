import { ChipSelector } from "@/src/components/ChipSelector";
import { HomeLoading } from "@/src/components/HomeLoading";
import { SearchInput } from "@/src/components/SearchInput";
import { TagsTabs } from "@/src/components/TagsTabs";
import { useInitApp } from "@/src/hooks/useInitApp";
import { useAuthStore } from "@/src/store/authStore";
import { useBookStore } from "@/src/store/bookStore";
import { useFilterStore } from "@/src/store/filterStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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

  useInitApp();

  const { profile, isLoading: authLoading, user } = useAuthStore();
  const { books, isLoading: booksLoading, fetchBooks } = useBookStore();
  const { categories } = useFilterStore();

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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

  if (!authLoading && !user) {
    router.replace("/");
    return null;
  }

  const loading = authLoading || booksLoading;
  const booksToRender = books.filter((book) => {
    if (!selectedFiltroLectura || selectedFiltroLectura === "all") return true;
    return book.status === selectedFiltroLectura;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          onFilterPress={() => console.log("abrir filtros")}
        />

        <TagsTabs selected={selectedTag} onSelect={setSelectedTag} />

        {/* Categorias */}
        <ChipSelector
          multiselect={true}
          chips={categories}
          selected={selectedCategories}
          onSelect={setSelectedCategories}
        />

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
    </SafeAreaView>
  );
}
