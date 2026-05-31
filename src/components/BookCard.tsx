import { Text, TouchableOpacity, View } from "react-native";

type BookCategory = { id: string; name: string };
type BookTag = { id: string; name: string };

type Book = {
  id: string;
  title: string;
  author: string | null;
  difficulty: number;
  xp: number;
  estimatedMinutes: number | null;
  totalPages: number | null;
  categories: BookCategory[];
  tags: BookTag[];
  progress: number;
  currentPage: number;
  status: "new" | "reading" | "completed" | "paused";
};

const TEAL = "#078F83";

const DIFFICULTY: Record<number, string> = {
  1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1", 6: "C2",
};

const STATUS_CONFIG = {
  new: { label: "Nuevo", bg: "#E8F5F3", text: TEAL, icon: "✨" },
  reading: { label: "Leyendo", bg: "#EFF6FF", text: "#3B82F6", icon: "📖" },
  completed: { label: "Completado", bg: "#F0FDF4", text: "#16A34A", icon: "✅" },
  paused: { label: "Pausado", bg: "#FEF9C3", text: "#CA8A04", icon: "⏸" },
} as const;

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

function CoverPlaceholder({
  title,
  difficulty,
}: {
  title: string;
  difficulty: number;
}) {
  const [top, bottom] = COVER_COLORS[difficulty % COVER_COLORS.length];
  const initial = title.charAt(0).toUpperCase();

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
      {/* Subtle overlay */}
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
}: {
  book: Book;
  onPress: () => void;
}) {
  const statusCfg = STATUS_CONFIG[book.status];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        gap: 14,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <CoverPlaceholder title={book.title} difficulty={book.difficulty} />

      <View style={{ flex: 1, gap: 6 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text
              style={{ fontWeight: "700", fontSize: 15, color: "#0F172A" }}
              numberOfLines={1}
            >
              {book.title}
            </Text>
            {book.author && (
              <Text
                style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}
                numberOfLines={1}
              >
                {book.author}
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
                  backgroundColor: "#F0FDF4",
                  borderRadius: 6,
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ fontSize: 10, color: "#16A34A", fontWeight: "600" }}>
                  {tag.name}
                </Text>
              </View>
            ))}
            {book.categories.map((cat) => (
              <View
                key={cat.id}
                style={{
                  backgroundColor: "#EEF2FF",
                  borderRadius: 6,
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ fontSize: 10, color: "#6366F1", fontWeight: "600" }}>
                  {cat.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Meta row */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>
            📄 {book.totalPages ?? "-"} pág
          </Text>
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>
            ⏱ {book.estimatedMinutes ?? "-"} min
          </Text>
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>
            📖 {DIFFICULTY[book.difficulty] ?? "-"}
          </Text>
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>
            ⭐ {book.xp} XP
          </Text>
        </View>

        {/* Progress bar */}
        {book.status !== "new" && (
          <View style={{ marginTop: 2 }}>
            <View
              style={{
                height: 6,
                backgroundColor: "#F1F5F9",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor:
                    book.status === "completed" ? "#16A34A" : TEAL,
                  width: `${book.progress}%`,
                }}
              />
            </View>
            <Text style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}>
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
