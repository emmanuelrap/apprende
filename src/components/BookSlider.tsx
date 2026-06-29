import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { toggleFavorite } from "@/src/services/favorites";
import { colors } from "@/src/theme";

type Book = {
  id: string;
  title: string;
  cover: string | null;
  difficulty: number;
  progress: number;
  status: string;
};

function ProgressBar({ progress }: { progress: number }) {
  const pct = Math.min(progress, 100);
  return (
    <View
      style={{
        height: 4, borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginTop: 4, overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${pct}%` as unknown as number,
          height: 4, borderRadius: 2,
          backgroundColor: "#fff",
        }}
      />
    </View>
  );
}

function CoverImage({ book, index }: { book: Book; index: number }) {
  const isCompleted = book.status === "completed";

  if (book.cover) {
    return (
      <View style={{ width: 120, height: 160, borderRadius: 12, overflow: "hidden" }}>
        <Image
          source={{ uri: book.cover }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        {isCompleted && (
          <View
            style={{
              position: "absolute", top: 6, left: 6,
              backgroundColor: colors.success + "E0",
              paddingHorizontal: 6, paddingVertical: 2,
              borderRadius: 100,
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: "700", color: "#fff" }}>Leído</Text>
          </View>
        )}
        {!isCompleted && book.status === "reading" && (
          <View
            style={{
              position: "absolute", top: 6, left: 6,
              backgroundColor: colors.reading + "E0",
              paddingHorizontal: 6, paddingVertical: 2,
              borderRadius: 100,
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: "700", color: "#fff" }}>Leyendo</Text>
          </View>
        )}
        {isCompleted && (
          <View
            style={{
              position: "absolute", bottom: 6, right: 6,
              width: 22, height: 22, borderRadius: 11,
              backgroundColor: colors.success,
              justifyContent: "center", alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 12, color: "#fff", fontWeight: "800" }}>✓</Text>
          </View>
        )}
        {!isCompleted && book.progress > 0 && (
          <View style={{ position: "absolute", bottom: 8, left: 8, right: 8 }}>
            <ProgressBar progress={book.progress} />
          </View>
        )}
      </View>
    );
  }

  const coverColors = colors.coverColors[index % colors.coverColors.length];
  return (
    <View
      style={{
        width: 120, height: 160, borderRadius: 12,
        backgroundColor: coverColors[0],
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
      {isCompleted && (
        <View
          style={{
            position: "absolute", top: 6, left: 6,
            backgroundColor: colors.success + "E0",
            paddingHorizontal: 6, paddingVertical: 2,
            borderRadius: 100,
          }}
        >
          <Text style={{ fontSize: 9, fontWeight: "700", color: "#fff" }}>Leído</Text>
        </View>
      )}
      {!isCompleted && book.status === "reading" && (
        <View
          style={{
            position: "absolute", top: 6, left: 6,
            backgroundColor: colors.reading + "E0",
            paddingHorizontal: 6, paddingVertical: 2,
            borderRadius: 100,
          }}
        >
          <Text style={{ fontSize: 9, fontWeight: "700", color: "#fff" }}>Leyendo</Text>
        </View>
      )}
      {isCompleted && (
        <View
          style={{
            position: "absolute", bottom: 6, right: 6,
            width: 22, height: 22, borderRadius: 11,
            backgroundColor: colors.success,
            justifyContent: "center", alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12, color: "#fff", fontWeight: "800" }}>✓</Text>
        </View>
      )}
      {!isCompleted && book.progress > 0 && (
        <View style={{ position: "absolute", bottom: 8, left: 8, right: 8 }}>
          <ProgressBar progress={book.progress} />
        </View>
      )}
    </View>
  );
}

type Props = {
  books: Book[];
  favoriteIds: Set<string>;
  userId: string;
  onToggleFavorite: (bookId: string) => void;
  onSeeAll?: () => void;
};

export function BookSlider({ books, favoriteIds, userId, onToggleFavorite, onSeeAll }: Props) {
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
      ListFooterComponent={
        onSeeAll ? (
          <TouchableOpacity
            onPress={onSeeAll}
            activeOpacity={0.7}
            style={{
              width: 100,
              height: 160,
              borderRadius: 16,
              backgroundColor: colors.primary + "0A",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary + "18",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 18, color: colors.primary, fontWeight: "700" }}>
                →
              </Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.primary }}>
              Ver más
            </Text>
          </TouchableOpacity>
        ) : null
      }
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
                fontSize: 11, fontWeight: "600",         color: colors.text,
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
