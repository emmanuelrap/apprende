import { colors, borderRadius, shadows, typography } from "@/src/theme";
import { Image, Text, TouchableOpacity, View } from "react-native";

type BookCategory = { id: string; name: string };
type BookTag = { id: string; name: string };

type Book = {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  cover: string | null;
  difficulty: number;
  xp: number;
  minLevel: number | null;
  estimatedMinutes: number | null;
  totalPages: number | null;
  categories: BookCategory[];
  tags: BookTag[];
  progress: number;
  currentPage: number;
  status: "new" | "reading" | "completed" | "paused";
};

const DIFFICULTY: Record<number, string> = {
  1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1", 6: "C2",
};

const STATUS_CONFIG = {
  new: { label: "Nuevo", bg: colors.primaryBg, text: colors.primary, icon: "✨" },
  reading: { label: "Leyendo", bg: colors.readingBg, text: colors.reading, icon: "📖" },
  completed: { label: "Completado", bg: colors.successBg, text: colors.success, icon: "✅" },
  paused: { label: "Pausado", bg: colors.warningBg, text: "#CA8A04", icon: "⏸" },
} as const;

function CoverPlaceholder({
  title,
  difficulty,
  cover,
}: {
  title: string;
  difficulty: number;
  cover?: string | null;
}) {
  const [top, bottom] = colors.coverColors[difficulty % colors.coverColors.length];
  const initial = title.charAt(0).toUpperCase();

  if (cover) {
    return (
      <Image
        source={{ uri: cover }}
        style={{ width: 56, height: 80, borderRadius: 12 }}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={{
        width: 56,
        height: 80,
        borderRadius: 12,
        backgroundColor: bottom,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          backgroundColor: top,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          opacity: 0.6,
        }}
      />
      <Text
        style={{
          color: "#fff",
          fontSize: 28,
          fontWeight: "800",
          zIndex: 1,
        }}
      >
        {initial}
      </Text>
    </View>
  );
}

export function BookCard({
  book,
  onPress,
  userLevel,
}: {
  book: Book;
  onPress: () => void;
  userLevel?: number;
}) {
  const statusCfg = STATUS_CONFIG[book.status];
  const locked = userLevel != null && book.minLevel != null && userLevel < book.minLevel;

  return (
    <TouchableOpacity
      onPress={locked ? undefined : onPress}
      activeOpacity={locked ? 1 : 0.85}
        style={{
          backgroundColor: locked ? colors.bg : colors.white,
          borderRadius: 20,
          padding: 14,
          marginBottom: 12,
          flexDirection: "row",
          gap: 14,
          ...shadows.card,
          opacity: locked ? 0.65 : 1,
        }}
    >
      <CoverPlaceholder title={book.title} difficulty={book.difficulty} cover={book.cover} />

      <View style={{ flex: 1, gap: 6 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text
              style={{ fontWeight: "700", fontSize: 15, color: colors.text }}
              numberOfLines={1}
            >
              {book.title}
            </Text>
            {book.author && (
              <Text
                style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}
                numberOfLines={1}
              >
                {book.author}
              </Text>
            )}
            {book.description && (
              <Text
                style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 16 }}
                numberOfLines={2}
              >
                {book.description}
              </Text>
            )}
          </View>

          <View
            style={{
              backgroundColor: statusCfg.bg,
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 4,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 10 }}>{statusCfg.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: "600", color: statusCfg.text }}>
              {statusCfg.label}
            </Text>
          </View>
        </View>

        {/* Tags and categories */}
        {book.tags.length + book.categories.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
            {book.tags.map((tag) => (
              <View
                key={tag.id}
                style={{
                  backgroundColor: colors.successBg,
                  borderRadius: 6,
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ fontSize: 10, color: colors.success, fontWeight: "600" }}>
                  {tag.name}
                </Text>
              </View>
            ))}
            {book.categories.map((cat) => (
              <View
                key={cat.id}
                style={{
                  backgroundColor: colors.readingBg,
                  borderRadius: 6,
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ fontSize: 10, color: colors.reading, fontWeight: "600" }}>
                  {cat.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Meta row */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Text style={{ fontSize: 11, color: colors.textMuted }}>
            📄 {book.totalPages ?? "-"} pág
          </Text>
          <Text style={{ fontSize: 11, color: colors.textMuted }}>
            ⏱ {book.estimatedMinutes ?? "-"} min
          </Text>
          <Text style={{ fontSize: 11, color: colors.textMuted }}>
            📖 {DIFFICULTY[book.difficulty] ?? "-"}
          </Text>
          <Text style={{ fontSize: 11, color: colors.textMuted }}>
            ⭐ {book.xp} XP
          </Text>
        </View>

        {/* Locked badge */}
        {locked && (
          <View
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 12 }}>🔒</Text>
            <Text style={{ fontSize: 11, color: colors.error, fontWeight: "600" }}>
              Necesitas nivel {book.minLevel}+
            </Text>
          </View>
        )}

        {/* Progress bar */}
        {book.status !== "new" && !locked && (
          <View style={{ marginTop: 2 }}>
            <View
              style={{
                height: 6,
                backgroundColor: colors.border,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor:
                    book.status === "completed" ? "#16A34A" : colors.primary,
                  width: `${book.progress}%`,
                }}
              />
            </View>
            <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>
              {book.status === "completed"
                ? "Completado"
                : `${book.progress}% · página ${book.currentPage}`}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
