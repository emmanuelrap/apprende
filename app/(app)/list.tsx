import { BookCard } from "@/src/components/BookCard";
import { RecorridoCard } from "@/src/components/RecorridoCard";
import { useAuthStore } from "@/src/store/authStore";
import { useBookStore } from "@/src/store/bookStore";
import { useRecorridoStore } from "@/src/store/recorridoStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const TEAL = "#078F83";

export default function ListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type: string;
    title: string;
    tagId?: string;
    catId?: string;
  }>();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const books = useBookStore((s) => s.books);
  const { recorridos } = useRecorridoStore();
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const userLevel = profile?.level ?? 1;

  useEffect(() => {
    if (!user?.id) return;
    import("@/src/services/favorites").then(({ getFavorites }) =>
      getFavorites(user.id).then((ids) => setFavIds(new Set(ids))),
    );
  }, [user?.id]);

  const label = useMemo(() => {
    if (params.type === "recorridos") return "recorrido";
    return "libro";
  }, [params.type]);

  const filtered = useMemo(() => {
    if (params.type === "favorites") {
      return books.filter((b) => favIds.has(b.id));
    }
    if (params.type === "tag" && params.tagId) {
      return books.filter((b) => b.tags?.some((t) => t.id === params.tagId));
    }
    if (params.type === "category" && params.catId) {
      return books.filter((b) =>
        b.categories?.some((c) => c.id === params.catId),
      );
    }
    if (params.type === "discover") {
      return books;
    }
    if (params.type === "recorridos") {
      return recorridos;
    }
    return [];
  }, [params.type, params.tagId, books, recorridos, favIds]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (params.type === "recorridos") {
        return (
          <RecorridoCard
            recorrido={item}
            onPress={() => router.push(`/recorrido/${item.id}` as any)}
            userLevel={userLevel}
          />
        );
      }
      const locked = item.minLevel != null && userLevel < item.minLevel;
      return (
        <BookCard
          book={item}
          userLevel={userLevel}
          onPress={() => {
            if (locked) return;
            router.push(`/book/${item.id}`);
          }}
        />
      );
    },
    [params.type, router, userLevel],
  );

  const title = params.title || "Lista";

  return (
    <View style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <View
        style={{
          backgroundColor: TEAL,
          paddingHorizontal: 16,
          paddingTop: 56,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>‹</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: "#fff",
            flex: 1,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
          {filtered.length} {label}{filtered.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              paddingVertical: 48,
            }}
          >
            <Text style={{ fontSize: 36, marginBottom: 12 }}>📭</Text>
            <Text style={{ fontSize: 15, color: "#94A3B8" }}>
              No hay {label}s disponibles
            </Text>
          </View>
        }
      />
    </View>
  );
}
