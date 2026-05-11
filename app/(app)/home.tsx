import { SearchInput } from "@/src/components/SearchInput";
import { TagsTabs } from "@/src/components/TagsTabs";
import { useInitApp } from "@/src/hooks/useInitApp";
import { useAuthStore } from "@/src/store/authStore";
import { useBookStore } from "@/src/store/bookStore";
import { useFilterStore } from "@/src/store/filterStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function HomeScreen() {
  const router = useRouter();

  useInitApp(); //cargar datos iniciales (usuario, libros, gamification...) en estado global

  const { profile, isLoading: authLoading } = useAuthStore();
  const { books, isLoading: booksLoading } = useBookStore();
  const { categories, tags } = useFilterStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    console.log("profile", profile);
    console.log("books", books);
    console.log("categories", categories);
    console.log("tags", tags);
  }, [profile, books, categories, tags]);

  //Si hay usuario logueado, muestra la pantalla principal. Si no, redirige al login.
  const user = useAuthStore((state) => state.user);
  if (!authLoading && !user) {
    router.replace("/");
    return null;
  }

  const loading = authLoading || booksLoading;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          onFilterPress={() => console.log("abrir filtros")}
        />

        <TagsTabs selected={selectedCategory} onSelect={setSelectedCategory} />
        {/* 👤 Datos perfil */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "700" }}>
            Hola, {profile?.name ?? "👋"}
          </Text>
          <Text style={{ color: "#64748B" }}>⚡ {profile?.xp ?? 0} XP</Text>
        </View>

        {/* 📚 libros */}
        {books.map((book) => (
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

            {/* categorías */}
            {book.categories.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 4,
                  marginBottom: 8,
                }}
              >
                {book.categories.map((cat: any) => (
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

            {/* tags */}
            {book.tags.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 4,
                  marginBottom: 8,
                }}
              >
                {book.tags.map((tag: any) => (
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

            {/* meta */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 10 }}>
              <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                📄 {book.totalPages} págs
              </Text>
              <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                ⏱ {book.estimatedMinutes} min
              </Text>
              <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                💪 {DIFFICULTY[book.difficulty] ?? "-"}
              </Text>
              <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                ⚡ {book.xp} XP
              </Text>
            </View>

            {/* progreso */}
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
                ? "✅ Completado"
                : `${book.progress}% • pág ${book.currentPage}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.6)",
          }}
        >
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
}
