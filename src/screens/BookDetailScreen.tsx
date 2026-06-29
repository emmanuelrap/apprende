import { borderRadius, colors, shadows, typography } from "@/src/theme";
import * as Speech from "expo-speech";
import {
  getBookVocabulary,
  type BookVocabulary,
} from "@/src/services/vocabulary";
import { useBookStore } from "@/src/store/bookStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { getFavorites, toggleFavorite } from "@/src/services/favorites";
import { getSimilarBooks } from "@/src/services/books";
import { useAuthStore } from "@/src/store/authStore";
import {
  getBookReviews,
  getBookReviewSummary,
  getUserReview,
  upsertReview,
  deleteReview,
  type BookReview,
  type ReviewSummary,
} from "@/src/services/reviews";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  NUEVO: { bg: colors.primary, text: colors.white },
  POPULAR: { bg: colors.warning, text: colors.white },
  TOP: { bg: "#8B5CF6", text: colors.white },
  HOT: { bg: colors.error, text: colors.white },
};

const TABS = ["Detalle", "Reseñas", "Similares"];

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

type SimilarBook = {
  id: string;
  title: string;
  author: string | null;
  cover: string | null;
  difficulty: number;
  xp: number;
  minLevel: number | null;
  estimatedMinutes: number | null;
  totalPages: number | null;
};

function BookCover({
  color,
  title,
  coverUrl,
}: {
  color: string;
  title: string;
  coverUrl?: string | null;
}) {
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
        borderRadius: 16,
      }}
    >
      {coverUrl ? (
        <Image
          source={{ uri: coverUrl }}
          style={{ width: 108, height: 152, borderRadius: 16, flexShrink: 0 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: 108,
            height: 152,
            borderRadius: 16,
            backgroundColor: color,
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            borderWidth: 1.5,
            borderColor: "rgba(255,255,255,0.15)",
          }}
        >
          <Text style={{ fontSize: 36, opacity: 0.45 }}>📖</Text>
          <Text
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.65)",
              textAlign: "center",
              paddingHorizontal: 8,
              marginTop: 6,
              lineHeight: 12,
            }}
            numberOfLines={3}
          >
            {title}
          </Text>
        </View>
      )}
    </View>
  );
}

function StarRow({ rating }: { rating: number }) {
  const r = Math.round(rating);
  return (
    <Text style={{ fontSize: 12, color: colors.warning, fontWeight: "700" }}>
      {"★".repeat(r)}
      {"☆".repeat(5 - r)}
    </Text>
  );
}

function TabDetalle({
  book,
  vocab,
  vocabLoading,
}: {
  book: ReturnType<typeof useBookStore>["books"][number];
  vocab: BookVocabulary[];
  vocabLoading: boolean;
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
        {/* Sinopsis */}
        <Text style={{ ...typography.h4, color: colors.text, marginBottom: 10 }}>
          Sinopsis
        </Text>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
            ...shadows.card,
          }}
        >
          <Text style={{ ...typography.body, lineHeight: 20, color: colors.text }}>
            {book.description || "Sin descripción disponible."}
          </Text>
        </View>

        {/* Info cards */}
        <Text style={{ ...typography.h4, color: colors.text, marginBottom: 12 }}>
          Información
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          {[
            {
              icon: "🕐",
              label: "Tiempo estimado",
              value: book.estimatedMinutes
                ? `${Math.floor(book.estimatedMinutes / 60)}h ${book.estimatedMinutes % 60}m`
                : timeStr,
              bg: colors.readingBg,
              color: colors.reading,
            },
            {
              icon: "📊",
              label: "Dificultad",
              value: DIFFICULTY_RANGES[book.difficulty] || "N/A",
              bg: colors.warningBg,
              color: colors.warning,
            },
            {
              icon: "📄",
              label: "Páginas totales",
              value: `${book.totalPages || "?"} págs`,
              bg: colors.successBg,
              color: colors.success,
            },
            {
              icon: "⭐",
              label: "XP al completar",
              value: `+${book.xp} XP`,
              bg: colors.primaryBg,
              color: colors.primary,
            },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                width: "47%",
                backgroundColor: item.bg,
                borderRadius: 14,
                padding: 14,
              }}
            >
              <Text style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</Text>
              <Text style={{ ...typography.small, color: colors.textMuted, marginBottom: 4 }}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "800", color: item.color }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        {book.status !== "new" && (
          <>
            <Text style={{ ...typography.h4, color: colors.text, marginBottom: 12 }}>
              Tus estadísticas
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginBottom: 18,
              }}
            >
              {[
                { label: "Páginas leídas", value: book.currentPage, icon: "📖" },
                { label: "Tiempo invertido", value: userTimeStr, icon: "⏱️" },
                { label: "Progreso", value: `${book.progress}%`, icon: "📈" },
              ].map((s) => (
                <View
                  key={s.label}
                  style={{
                    flex: 1,
                    backgroundColor: colors.white,
                    borderRadius: 14,
                    padding: 14,
                    alignItems: "center",
                    ...shadows.card,
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</Text>
                  <Text
                    style={{ fontSize: 20, fontWeight: "800", color: colors.primary }}
                  >
                    {s.value}
                  </Text>
                  <Text
                    style={{
                      ...typography.small,
                      color: colors.textMuted,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Vocabulary */}
        <View style={{ marginTop: 8 }}>
          <Text style={{ ...typography.h4, color: colors.text, marginBottom: 12 }}>
            Vocabulario
          </Text>
          <TabVocabulario vocab={vocab} loading={vocabLoading} />
        </View>
      </View>
    </ScrollView>
  );
}

function TabVocabulario({
  vocab,
  loading,
}: {
  vocab: BookVocabulary[];
  loading: boolean;
}) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const stopAllRef = useRef(false);

  const speak = useCallback(async (id: string, text: string) => {
    setSpeakingId(id);
    await Speech.speak(text, {
      language: "en",
      rate: 0.8,
      onDone: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  }, []);

  const speakAll = useCallback(async () => {
    if (playingAll) {
      stopAllRef.current = true;
      Speech.stop();
      setSpeakingId(null);
      setPlayingAll(false);
      return;
    }

    stopAllRef.current = false;
    setPlayingAll(true);

    for (const v of vocab) {
      if (stopAllRef.current) break;
      setSpeakingId(v.id);
      await new Promise<void>((resolve) => {
        Speech.speak(v.word_en, {
          language: "en",
          rate: 0.8,
          onDone: () => {
            if (!stopAllRef.current) setSpeakingId(null);
            resolve();
          },
          onError: () => {
            setSpeakingId(null);
            resolve();
          },
        });
      });
    }

    setPlayingAll(false);
  }, [vocab, playingAll]);

  const levelColor: Record<string, { bg: string; text: string }> = {
    A1: { bg: colors.readingBg, text: colors.reading },
    A2: { bg: colors.readingBg, text: colors.reading },
    B1: { bg: colors.primaryBg, text: colors.primaryDarkest },
    B2: { bg: colors.warningBg, text: "#92400E" },
    C1: { bg: colors.errorBg, text: "#9D174D" },
    C2: { bg: colors.errorBg, text: "#9D174D" },
  };

  if (loading) {
    return (
      <View style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View>
      {vocab.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 24, gap: 8 }}>
          <Text style={{ fontSize: 28 }}>📭</Text>
          <Text style={{ ...typography.body, color: colors.textMuted, textAlign: "center" }}>
            No hay vocabulario disponible para este libro.
          </Text>
        </View>
      ) : (
        <>
          <Text style={{ ...typography.body, lineHeight: 18, marginBottom: 10 }}>
            Palabras clave que encontrarás en este libro. Repásalas antes de leer
            para avanzar más rápido.
          </Text>
          <TouchableOpacity
            onPress={speakAll}
            activeOpacity={0.7}
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: playingAll ? colors.errorBg : colors.primaryBg,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 7,
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 14 }}>
              {playingAll ? "⏹" : "▶️"}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: playingAll ? colors.error : colors.primaryDarkest,
              }}
            >
              {playingAll ? "Detener" : `Reproducir todo (${vocab.length})`}
            </Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: colors.white, borderRadius: 14, ...shadows.card, overflow: "hidden" }}>
            {vocab.map((v, i) => {
              const lc = levelColor[v.level] ?? levelColor["B1"];
              const isSpeaking = speakingId === v.id;
              return (
                <View
                  key={v.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    borderBottomWidth: i < vocab.length - 1 ? 0.5 : 0,
                    borderBottomColor: colors.border,
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <TouchableOpacity
                      onPress={() => speak(v.id, v.word_en)}
                      disabled={isSpeaking}
                      style={{
                        width: 34, height: 34, borderRadius: 17,
                        backgroundColor: isSpeaking ? colors.primary : colors.primaryBg,
                        justifyContent: "center", alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{isSpeaking ? "🔊" : "🔈"}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: colors.text }}>
                        {v.word_en}
                      </Text>
                      <Text style={{ ...typography.body, marginTop: 2 }}>
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
                    <Text style={{ ...typography.badge, color: lc.text }}>
                      {v.level}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

type TabReseñasProps = {
  bookId: string;
};

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity key={s} onPress={() => onChange(s === value ? 0 : s)} activeOpacity={0.6}>
          <Text style={{ fontSize: 32, color: s <= value ? colors.warning : colors.textVeryMuted, opacity: s <= value ? 1 : 0.3 }}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

function TabReseñas({ bookId }: TabReseñasProps) {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    avgRating: 0,
    totalCount: 0,
    distribution: {},
  });
  const [userReview, setUserReview] = useState<BookReview | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    setReviews(await getBookReviews(bookId));
    setSummary(await getBookReviewSummary(bookId));
    if (user) {
      const ur = await getUserReview(user.id, bookId);
      setUserReview(ur);
      if (ur) {
        setRating(ur.rating);
        setComment(ur.comment ?? "");
      }
    }
  }, [bookId, user]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmit = async () => {
    if (!user || rating === 0) return;
    setSubmitting(true);
    const ok = await upsertReview(user.id, bookId, rating, comment.trim() || undefined);
    if (ok) {
      await loadReviews();
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!user) return;
    setSubmitting(true);
    const ok = await deleteReview(user.id, bookId);
    if (ok) {
      setUserReview(null);
      setRating(0);
      setComment("");
      await loadReviews();
    }
    setSubmitting(false);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      {/* Rating summary */}
      {summary.totalCount > 0 && (
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
            ...shadows.card,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 40, fontWeight: "900", color: colors.text }}>
              {summary.avgRating}
            </Text>
            <StarRow rating={summary.avgRating} />
            <Text style={{ ...typography.caption, marginTop: 2 }}>
              {summary.totalCount} {summary.totalCount === 1 ? "reseña" : "reseñas"}
            </Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = Object.entries(summary.distribution)
                .filter(([k]) => Math.floor(Number(k)) === star)
                .reduce((a, [, c]) => a + c, 0);
              const pct = summary.totalCount > 0 ? (count / summary.totalCount) * 100 : 0;
              return (
                <View
                  key={star}
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Text style={{ ...typography.small, color: colors.textMuted, width: 8 }}>
                    {star}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      height: 5,
                      backgroundColor: colors.border,
                      borderRadius: 4,
                    }}
                  >
                    <View
                      style={{
                        height: 5,
                        borderRadius: 4,
                        backgroundColor: colors.warning,
                        width: `${pct}%`,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Review form */}
      {user && (
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            ...shadows.card,
          }}
        >
          <Text
            style={{
              ...typography.h4,
              color: colors.text,
              marginBottom: 10,
            }}
          >
            {userReview ? "Tu reseña" : "¿Qué te pareció?"}
          </Text>
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <StarSelector value={rating} onChange={setRating} />
          </View>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 12,
              ...typography.body,
              color: colors.text,
              minHeight: 80,
              textAlignVertical: "top",
              marginBottom: 12,
            }}
            placeholder="Escribe un comentario (opcional)..."
            placeholderTextColor={colors.textVeryMuted}
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            {userReview && (
              <TouchableOpacity
                onPress={handleDelete}
                disabled={submitting}
                style={{
                  backgroundColor: colors.errorBg,
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    ...typography.h4,
                    color: colors.error,
                    fontSize: 13,
                  }}
                >
                  Eliminar
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting || rating === 0}
              style={{
                flex: 1,
                backgroundColor: rating === 0 ? colors.border : colors.primary,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  ...typography.h4,
                  color: rating === 0 ? colors.textMuted : colors.white,
                  fontSize: 13,
                }}
              >
                {submitting
                  ? "Guardando..."
                  : userReview
                    ? "Actualizar reseña"
                    : "Enviar reseña"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 32, gap: 8 }}>
          <Text style={{ fontSize: 32 }}>💬</Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textMuted,
              textAlign: "center",
            }}
          >
            {user
              ? "Sé el primero en dejar una reseña"
              : "No hay reseñas aún. Inicia sesión para dejar la tuya."}
          </Text>
        </View>
      ) : (
        reviews.map((r) => {
          const isOwn = user?.id === r.user_id;
          return (
            <View
              key={r.id}
              style={{
                backgroundColor: colors.white,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                ...(isOwn ? { borderWidth: 1.5, borderColor: colors.primary } : {}),
                ...shadows.card,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: colors.primaryBg,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 12, color: colors.primaryDarkest, fontWeight: "700" }}>
                      {(r.profile?.name?.[0] || "U").toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>
                    {r.profile?.name || "Usuario"}
                    {isOwn && (
                      <Text style={{ color: colors.primary, fontWeight: "600" }}> (tú)</Text>
                    )}
                  </Text>
                </View>
                <StarRow rating={r.rating} />
              </View>
              {r.comment && (
                <Text style={{ ...typography.body, lineHeight: 18, marginBottom: 8 }}>
                  {r.comment}
                </Text>
              )}
              <Text style={{ ...typography.caption }}>
                {formatRelativeTime(r.created_at)}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

function TabSimilares({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [similar, setSimilar] = useState<SimilarBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSimilarBooks(bookId)
      .then(setSimilar)
      .catch(() => setSimilar([]))
      .finally(() => setLoading(false));
  }, [bookId]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      <Text style={{ ...typography.body, marginBottom: 16 }}>
        Libros con nivel y estilo similares que podrían gustarte.
      </Text>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 48 }} size="large" color={colors.primary} />
      ) : similar.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 48, gap: 8 }}>
          <Text style={{ fontSize: 32 }}>📚</Text>
          <Text style={{ ...typography.body, color: colors.textMuted, textAlign: "center" }}>
            Pronto tendremos recomendaciones para ti.
          </Text>
        </View>
      ) : (
        similar.map((book) => (
          <TouchableOpacity
            key={book.id}
            onPress={() => router.push(`/book/${book.id}`)}
            style={{
              backgroundColor: colors.white,
              borderRadius: 14,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              marginBottom: 10,
              ...shadows.card,
            }}
          >
            <View
              style={{
                width: 54,
                height: 72,
                borderRadius: 10,
                backgroundColor: colors.coverColors[
                  book.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
                    colors.coverColors.length
                ][0],
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, opacity: 0.6 }}>📖</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
                {book.title}
              </Text>
              {book.author && (
                <Text style={{ ...typography.caption, marginBottom: 4 }}>{book.author}</Text>
              )}
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: colors.primaryBg,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ ...typography.badge, color: colors.primaryDarkest }}>
                  Nivel {DIFFICULTY_LABELS[book.difficulty] ?? book.difficulty}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 20, color: colors.textVeryMuted }}>›</Text>
          </TouchableOpacity>
        ))
      )}
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
  const [vocab, setVocab] = useState<BookVocabulary[]>([]);
  const [vocabLoading, setVocabLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      getFavorites(user.id).then((ids) => setIsFav(ids.includes(bookId)));
    }
    getBookVocabulary(bookId)
      .then(setVocab)
      .finally(() => setVocabLoading(false));
  }, [user, bookId]);

  const handleFavToggle = async () => {
    if (!user) return;
    const optimistic = !isFav;
    setIsFav(optimistic);
    try {
      await toggleFavorite(user.id, bookId);
    } catch {
      setIsFav(!optimistic);
    }
  };

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 48 }}>📖</Text>
          <Text style={{ ...typography.h3, color: colors.textMuted, textAlign: "center" }}>
            Libro no encontrado
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingHorizontal: 24,
              paddingVertical: 12,
              marginTop: 4,
            }}
          >
            <Text style={{ ...typography.h4, color: colors.white }}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const coverIndex = book.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const coverColor = colors.coverColors[coverIndex % colors.coverColors.length][0];
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            marginTop: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 24, color: colors.white, lineHeight: 26, marginLeft: -2 }}>‹</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={handleFavToggle}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 18 }}>{isFav ? "❤️" : "🤍"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 18, paddingBottom: 18 }}>
          <BookCover
            color={coverColor}
            title={book.title}
            coverUrl={book.cover}
          />
          <View style={{ flex: 1, justifyContent: "center" }}>
            {badge && badgeColor && (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: badgeColor.bg,
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  marginBottom: 8,
                }}
              >
                <Text style={{ ...typography.badge, color: badgeColor.text, fontSize: 11 }}>
                  {badge}
                </Text>
              </View>
            )}
            <Text
              style={{
                fontSize: 22,
                fontWeight: "900",
                color: colors.white,
                marginBottom: 3,
                lineHeight: 26,
              }}
            >
              {book.title}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 12,
                fontWeight: "500",
              }}
            >
              {book.author}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  borderRadius: 20,
                  paddingLeft: 8,
                  paddingRight: 12,
                  paddingVertical: 6,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 11 }}>📊</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.white }}>
                    {DIFFICULTY_RANGES[book.difficulty] || "N/A"}
                  </Text>
                  <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", marginTop: -1 }}>
                    {DIFFICULTY_LABELS[book.difficulty] || ""}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  borderRadius: 20,
                  paddingLeft: 8,
                  paddingRight: 12,
                  paddingVertical: 6,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 11 }}>📄</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.white }}>
                    {book.totalPages}
                  </Text>
                  <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", marginTop: -1 }}>
                    páginas
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: "rgba(252,211,77,0.15)",
                  borderRadius: 20,
                  paddingLeft: 8,
                  paddingRight: 12,
                  paddingVertical: 6,
                  borderWidth: 0.5,
                  borderColor: "rgba(252,211,77,0.25)",
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: "rgba(252,211,77,0.2)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 11 }}>⭐</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 11, fontWeight: "800", color: "#FCD34D" }}>
                    +{book.xp}
                  </Text>
                  <Text style={{ fontSize: 8, color: "rgba(252,211,77,0.7)", marginTop: -1 }}>
                    XP
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {book.status !== "new" && (
          <View style={{ paddingBottom: 18, paddingHorizontal: 2 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 7,
              }}
            >
              <Text style={{ ...typography.small, color: "rgba(255,255,255,0.65)", fontSize: 11 }}>
                Tu progreso
              </Text>
              <Text style={{ ...typography.small, color: colors.white, fontWeight: "700", fontSize: 11 }}>
                {book.progress}% · pág {book.currentPage}
              </Text>
            </View>
            <View
              style={{
                height: 6,
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.white,
                  width: `${book.progress}%`,
                }}
              />
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Pill tabs */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.white,
          paddingVertical: 12,
          paddingHorizontal: 16,
          gap: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
        }}
      >
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(i)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              backgroundColor: activeTab === i ? colors.primary : colors.primaryBg,
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: activeTab === i ? "700" : "600",
                color: activeTab === i ? colors.white : colors.primaryDarkest,
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        {activeTab === 0 && (
          <TabDetalle book={book} vocab={vocab} vocabLoading={vocabLoading} />
        )}
        {activeTab === 1 && <TabReseñas bookId={bookId} />}
        {activeTab === 2 && <TabSimilares bookId={bookId} />}
      </View>

      {/* Bottom CTA */}
      <View
        style={{
          backgroundColor: colors.white,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          padding: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: colors.primaryBg,
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 14,
            alignItems: "center",
            minWidth: 64,
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "800", color: colors.primary }}>
            +{book.xp}
          </Text>
          <Text style={{ fontSize: 9, fontWeight: "700", color: colors.primaryDarkest, marginTop: 1 }}>
            XP
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/reader/${book.id}`)}
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 14,
            paddingVertical: 15,
            alignItems: "center",
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", color: colors.white }}>
            {btnLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
