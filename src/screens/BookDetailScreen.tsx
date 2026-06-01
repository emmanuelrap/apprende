import * as Speech from "expo-speech";
import {
  getBookVocabulary,
  type BookVocabulary,
} from "@/src/services/vocabulary";
import { useBookStore } from "@/src/store/bookStore";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TEAL = "#078F83";
const TEAL_LIGHT = "#E1F5EE";
const TEAL_DARK = "#056860";
const BG = "#F4F6F8";

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  NUEVO: { bg: "#078F83", text: "#fff" },
  POPULAR: { bg: "#F59E0B", text: "#fff" },
  TOP: { bg: "#8B5CF6", text: "#fff" },
  HOT: { bg: "#EF4444", text: "#fff" },
};

const TABS = ["Detalle", "Vocabulario", "Reseñas", "Similares"];

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Principiante",
  2: "Básico",
  3: "Intermedio",
  4: "Intermedio+",
  5: "Avanzado",
  6: "Experto",
};

const DIFFICULTY_RANGES: Record<number, string> = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

const MOCK_REVIEWS = [
  {
    id: "r1",
    name: "María G.",
    stars: 5,
    text: "Increíble para practicar inglés. El vocabulario es rico pero accesible con el glosario.",
    realDiff: "Dificultad real: B2",
    date: "hace 3 días",
  },
  {
    id: "r2",
    name: "Carlos M.",
    stars: 4,
    text: "Muy buena narrativa. Algunas partes son densas pero vale la pena. Aprendí muchísimas palabras nuevas.",
    realDiff: "Dificultad real: B1 - B2",
    date: "hace 1 semana",
  },
  {
    id: "r3",
    name: "Ana R.",
    stars: 5,
    text: "La mejor forma de practicar inglés literario. Lo recomiendo para cualquier nivel intermedio.",
    realDiff: "Dificultad real: B1",
    date: "hace 2 semanas",
  },
];

const MOCK_SIMILAR = [
  { id: "s1", title: "The Iliad", color: "#3b2a1a", level: "B2" },
  { id: "s2", title: "Beowulf", color: "#1a2e2a", level: "B2" },
  { id: "s3", title: "Don Quixote", color: "#2a1a3b", level: "C1" },
  { id: "s4", title: "Aeneid", color: "#1a2a3b", level: "B2" },
];

const COVER_COLORS = [
  "#1a1a2e",
  "#3b2a1a",
  "#1a2e2a",
  "#2a1a3b",
  "#1a2a3b",
  "#2e1a1a",
];

function hashColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length];
}

function BookCover({
  color,
  title,
  coverUrl,
}: {
  color: string;
  title: string;
  coverUrl?: string | null;
}) {
  if (coverUrl) {
    return (
      <Image
        source={{ uri: coverUrl }}
        style={{ width: 96, height: 132, borderRadius: 12, flexShrink: 0 }}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={{
        width: 96,
        height: 132,
        borderRadius: 12,
        backgroundColor: color,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.12)",
      }}
    >
      <Text style={{ fontSize: 28, opacity: 0.5 }}>📖</Text>
      <Text
        style={{
          fontSize: 9,
          color: "rgba(255,255,255,0.65)",
          textAlign: "center",
          paddingHorizontal: 6,
          marginTop: 4,
        }}
      >
        {title}
      </Text>
    </View>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <Text style={{ fontSize: 12, color: "#F59E0B", fontWeight: "700" }}>
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </Text>
  );
}

function TabDetalle({
  book,
}: {
  book: ReturnType<typeof useBookStore>["books"][number];
}) {
  const hours = book.totalPages ? Math.floor((book.totalPages * 1.5) / 60) : 0;
  const mins = book.totalPages ? Math.round((book.totalPages * 1.5) % 60) : 0;
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  const userMinutes = book.currentPage ? Math.round(book.currentPage * 1.5) : 0;
  const userHours = Math.floor(userMinutes / 60);
  const userMins = userMinutes % 60;
  const userTimeStr =
    userHours > 0 ? `${userHours}h ${userMins}m` : `${userMins}m`;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "800",
            color: "#1C1C1E",
            marginBottom: 8,
          }}
        >
          Sinopsis
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "#64748B",
            lineHeight: 20,
            marginBottom: 18,
          }}
        >
          {book.description || "Sin descripción disponible."}
        </Text>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "800",
            color: "#1C1C1E",
            marginBottom: 10,
          }}
        >
          Información
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 18,
          }}
        >
          {[
            {
              icon: "🕐",
              label: "Tiempo estimado",
              value: book.estimatedMinutes
                ? `${Math.floor(book.estimatedMinutes / 60)}h ${book.estimatedMinutes % 60}m`
                : timeStr,
            },
            {
              icon: "📊",
              label: "Dificultad",
              value: DIFFICULTY_RANGES[book.difficulty] || "N/A",
              accent: true,
            },
            {
              icon: "📄",
              label: "Páginas totales",
              value: `${book.totalPages || "?"} págs`,
            },
            { icon: "⭐", label: "XP al completar", value: `+${book.xp} XP` },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                width: "47%",
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 12,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</Text>
              <Text style={{ fontSize: 10, color: "#94A3B8", marginBottom: 3 }}>
                {item.label}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: item.accent ? "#F59E0B" : "#1C1C1E",
                }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {book.status !== "new" && (
          <>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "800",
                color: "#1C1C1E",
                marginBottom: 10,
              }}
            >
              Tus estadísticas en este libro
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 18 }}>
              {[
                { label: "Páginas leídas", value: book.currentPage },
                { label: "Tiempo invertido", value: userTimeStr },
                { label: "Progreso", value: `${book.progress}%` },
              ].map((s) => (
                <View
                  key={s.label}
                  style={{
                    flex: 1,
                    backgroundColor: TEAL_LIGHT,
                    borderRadius: 14,
                    padding: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "800", color: TEAL }}
                  >
                    {s.value}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: TEAL_DARK,
                      textAlign: "center",
                      marginTop: 2,
                    }}
                  >
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function TabVocabulario({ bookId }: { bookId: string }) {
  const [vocab, setVocab] = useState<BookVocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    getBookVocabulary(bookId)
      .then(setVocab)
      .finally(() => setLoading(false));
  }, [bookId]);

  const speak = useCallback(async (id: string, text: string) => {
    setSpeakingId(id);
    await Speech.speak(text, {
      language: "en",
      rate: 0.8,
      onDone: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  }, []);

  const levelColor: Record<string, { bg: string; text: string }> = {
    A1: { bg: "#EEF2FF", text: "#4338CA" },
    A2: { bg: "#EEF2FF", text: "#4338CA" },
    B1: { bg: TEAL_LIGHT, text: TEAL_DARK },
    B2: { bg: "#FEF3C7", text: "#92400E" },
    C1: { bg: "#FCE7F3", text: "#9D174D" },
    C2: { bg: "#FCE7F3", text: "#9D174D" },
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      <Text
        style={{
          fontSize: 13,
          color: "#64748B",
          marginBottom: 14,
          lineHeight: 18,
        }}
      >
        Palabras clave que encontrarás en este libro. Repásalas antes de leer
        para avanzar más rápido.
      </Text>
      {vocab.length === 0 ? (
        <Text
          style={{
            fontSize: 13,
            color: "#94A3B8",
            textAlign: "center",
            marginTop: 32,
          }}
        >
          No hay vocabulario disponible para este libro.
        </Text>
      ) : (
        vocab.map((v, i) => {
          const lc = levelColor[v.level] ?? levelColor["B1"];
          const isSpeaking = speakingId === v.id;
          return (
            <View
              key={v.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                borderBottomWidth: i < vocab.length - 1 ? 0.5 : 0,
                borderBottomColor: "#E2E8F0",
              }}
            >
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                <TouchableOpacity
                  onPress={() => speak(v.id, v.word_en)}
                  disabled={isSpeaking}
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: isSpeaking ? TEAL : TEAL_LIGHT,
                    justifyContent: "center", alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{isSpeaking ? "🔊" : "🔈"}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#1C1C1E" }}>
                    {v.word_en}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                    {v.word_es}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: lc.bg,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "700", color: lc.text }}>
                  {v.level}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

function TabReseñas() {
  const [userRating, setUserRating] = useState(0);
  const avgRating = 4.7;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 40, fontWeight: "900", color: "#1C1C1E" }}>
            {avgRating}
          </Text>
          <StarRow rating={avgRating} />
          <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
            892 reseñas
          </Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const pct =
              star === 5
                ? 70
                : star === 4
                  ? 20
                  : star === 3
                    ? 7
                    : star === 2
                      ? 2
                      : 1;
            return (
              <View
                key={star}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Text style={{ fontSize: 10, color: "#94A3B8", width: 8 }}>
                  {star}
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 5,
                    backgroundColor: "#E2E8F0",
                    borderRadius: 4,
                  }}
                >
                  <View
                    style={{
                      height: 5,
                      borderRadius: 4,
                      backgroundColor: "#F59E0B",
                      width: `${pct}%`,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View
        style={{
          backgroundColor: TEAL_LIGHT,
          borderRadius: 14,
          padding: 14,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: TEAL_DARK,
            marginBottom: 8,
          }}
        >
          ¿Qué te pareció?
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <TouchableOpacity key={s} onPress={() => setUserRating(s)}>
              <Text
                style={{ fontSize: 28, opacity: s <= userRating ? 1 : 0.3 }}
              >
                ⭐
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {MOCK_REVIEWS.map((r) => (
        <View
          key={r.id}
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 14,
            marginBottom: 10,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1C1C1E" }}>
              {r.name}
            </Text>
            <StarRow rating={r.stars} />
          </View>
          <Text
            style={{
              fontSize: 12,
              color: "#64748B",
              lineHeight: 18,
              marginBottom: 6,
            }}
          >
            {r.text}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: TEAL }}>
              {r.realDiff}
            </Text>
            <Text style={{ fontSize: 11, color: "#94A3B8" }}>{r.date}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function TabSimilares() {
  const router = useRouter();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      <Text style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>
        Libros con nivel y estilo similares que podrían gustarte.
      </Text>
      {MOCK_SIMILAR.map((book) => (
        <TouchableOpacity
          key={book.id}
          onPress={() => router.push(`/book/${book.id}`)}
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            marginBottom: 10,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <View
            style={{
              width: 54,
              height: 72,
              borderRadius: 8,
              backgroundColor: book.color,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, opacity: 0.6 }}>📖</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#1C1C1E",
                marginBottom: 4,
              }}
            >
              {book.title}
            </Text>
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: TEAL_LIGHT,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              <Text
                style={{ fontSize: 11, fontWeight: "700", color: TEAL_DARK }}
              >
                {book.level}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 20, color: "#CBD5E1" }}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

type Props = {
  bookId: string;
};

export function BookDetailScreen({ bookId }: Props) {
  const router = useRouter();
  const books = useBookStore((state) => state.books);
  const [activeTab, setActiveTab] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <Text style={{ fontSize: 16, color: "#94A3B8" }}>
            Libro no encontrado
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          >
            <Text style={{ color: TEAL, fontWeight: "700" }}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const coverColor = hashColor(book.id);
  const badge =
    book.status === "new"
      ? "NUEVO"
      : book.status === "reading"
        ? "POPULAR"
        : null;
  const badgeColor = badge ? BADGE_COLORS[badge] : null;
  const isCompleted = book.status === "completed";
  const btnLabel = isCompleted
    ? "Leer de nuevo"
    : book.status === "reading"
      ? "Continuar leyendo"
      : "Empezar a leer";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL} />

      <View
        style={{
          backgroundColor: TEAL,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
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
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => setIsFav(!isFav)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18 }}>{isFav ? "❤️" : "🤍"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18 }}>⬆️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 16, paddingBottom: 16 }}>
          <BookCover
            color={coverColor}
            title={book.title}
            coverUrl={book.cover}
          />
          <View style={{ flex: 1 }}>
            {badge && badgeColor && (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: badgeColor.bg,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: "800",
                    color: badgeColor.text,
                  }}
                >
                  {badge}
                </Text>
              </View>
            )}
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: "#fff",
                marginBottom: 2,
                lineHeight: 24,
              }}
            >
              {book.title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 10,
              }}
            >
              {book.author}
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 10, color: "#fff" }}>
                  {DIFFICULTY_LABELS[book.difficulty] || "Desconocido"}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.8)" }}>
                  {DIFFICULTY_RANGES[book.difficulty] || "N/A"}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.8)" }}>
                  {book.totalPages} págs
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, color: "#FCD34D", fontWeight: "700" }}>
              +{book.xp} XP
            </Text>
          </View>
        </View>

        {book.status !== "new" && (
          <View style={{ paddingBottom: 14 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>
                Tu progreso
              </Text>
              <Text style={{ fontSize: 10, color: "#fff", fontWeight: "700" }}>
                {book.progress}% · pág {book.currentPage}
              </Text>
            </View>
            <View
              style={{
                height: 5,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 4,
              }}
            >
              <View
                style={{
                  height: 5,
                  borderRadius: 4,
                  backgroundColor: "#fff",
                  width: `${book.progress}%`,
                }}
              />
            </View>
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          borderBottomWidth: 0.5,
          borderBottomColor: "#E2E8F0",
        }}
      >
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(i)}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: "center",
              borderBottomWidth: activeTab === i ? 2 : 0,
              borderBottomColor: TEAL,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: activeTab === i ? "700" : "400",
                color: activeTab === i ? TEAL : "#94A3B8",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1, backgroundColor: BG }}>
        {activeTab === 0 && <TabDetalle book={book} />}
        {activeTab === 1 && <TabVocabulario bookId={book.id} />}
        {activeTab === 2 && <TabReseñas />}
        {activeTab === 3 && <TabSimilares />}
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#E2E8F0",
          padding: 14,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: TEAL_LIGHT,
            borderRadius: 12,
            padding: 10,
            alignItems: "center",
            minWidth: 60,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", color: TEAL }}>
            +{book.xp}
          </Text>
          <Text style={{ fontSize: 9, color: TEAL_DARK, fontWeight: "600" }}>
            XP
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/reader/${book.id}`)}
          style={{
            flex: 1,
            backgroundColor: TEAL,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "800", color: "#fff" }}>
            {btnLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
