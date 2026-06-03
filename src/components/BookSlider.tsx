import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { toggleFavorite } from "@/src/services/favorites";

type Book = {
  id: string;
  title: string;
  cover: string | null;
  difficulty: number;
};

const TEAL = "#078F83";
const TEAL_LIGHT = "#E1F5EE";

const COVER_COLORS = [
  ["#078F83", "#056860"],
  ["#6366F1", "#4F46E5"],
  ["#E11D48", "#BE123C"],
  ["#D97706", "#B45309"],
  ["#7C3AED", "#6D28D9"],
  ["#0891B2", "#0E7490"],
  ["#059669", "#047857"],
  ["#DB2777", "#BE185D"],
];

function CoverImage({ book, index }: { book: Book; index: number }) {
  if (book.cover) {
    return (
      <Image
        source={{ uri: book.cover }}
        style={{ width: 120, height: 160, borderRadius: 12 }}
        resizeMode="cover"
      />
    );
  }

  const colors = COVER_COLORS[index % COVER_COLORS.length];
  return (
    <View
      style={{
        width: 120, height: 160, borderRadius: 12,
        backgroundColor: colors[0],
        justifyContent: "center", alignItems: "center",
        padding: 8,
      }}
    >
      <Text style={{ fontSize: 32, opacity: 0.3 }}>📖</Text>
      <Text
        style={{
          fontSize: 10, color: "rgba(255,255,255,0.7)",
          textAlign: "center", marginTop: 4,
        }}
        numberOfLines={3}
      >
        {book.title}
      </Text>
    </View>
  );
}

type Props = {
  books: Book[];
  favoriteIds: Set<string>;
  userId: string;
  onToggleFavorite: (bookId: string) => void;
};

export function BookSlider({ books, favoriteIds, userId, onToggleFavorite }: Props) {
  const router = useRouter();

  const handleFavorite = useCallback(
    async (bookId: string) => {
      if (!userId) return;
      await toggleFavorite(userId, bookId);
      onToggleFavorite(bookId);
    },
    [userId, onToggleFavorite],
  );

  return (
    <FlatList
      data={books}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingVertical: 8 }}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        const isFav = favoriteIds.has(item.id);
        return (
          <TouchableOpacity
            onPress={() => router.push(`/book/${item.id}`)}
            activeOpacity={0.8}
            style={{ width: 120 }}
          >
            <CoverImage book={item} index={index} />
            <Text
              style={{
                fontSize: 11, fontWeight: "600", color: "#0F172A",
                marginTop: 6, lineHeight: 14,
              }}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <TouchableOpacity
              onPress={() => handleFavorite(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                position: "absolute", top: 6, right: 6,
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center", alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14 }}>{isFav ? "❤️" : "🤍"}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      }}
    />
  );
}
