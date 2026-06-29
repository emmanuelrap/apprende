import { colors, shadows } from "@/src/theme";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/src/store/authStore";
import { useRecorridoStore } from "@/src/store/recorridoStore";
import { startRecorrido, updateRecorridoProgress, difficultyLabel, type RecorridoBook } from "@/src/services/recorridos";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  locked: { label: "Bloqueado", bg: "#F1F5F9", text: colors.textMuted, icon: "🔒" },
  new: { label: "Disponible", bg: colors.primaryBg, text: colors.primary, icon: "📖" },
  reading: { label: "Leyendo", bg: colors.readingBg, text: colors.reading, icon: "📖" },
  paused: { label: "Pausado", bg: colors.warningBg, text: "#CA8A04", icon: "⏸" },
  completed: { label: "Completado", bg: colors.successBg, text: colors.success, icon: "✅" },
};

const COLORS = [
  colors.primary, "#6366F1", "#E11D48", "#D97706",
  "#7C3AED", "#0891B2", "#059669", "#DB2777",
];

type RecorridoDetailScreenProps = {
  recorridoId: string;
};

export function RecorridoDetailScreen({ recorridoId }: RecorridoDetailScreenProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { selectedRecorrido, selectRecorrido, isLoading } = useRecorridoStore();
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      let mounted = true;
      (async () => {
        await selectRecorrido(recorridoId);
        if (!mounted) return;
        await updateRecorridoProgress(user.id, recorridoId);
        if (mounted) await selectRecorrido(recorridoId);
      })();
      return () => { mounted = false; };
    }, [user?.id, recorridoId, selectRecorrido]),
  );

  const onRefresh = useCallback(async () => {
    if (!user?.id || refreshing) return;
    setRefreshing(true);
    try {
      await selectRecorrido(recorridoId);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, refreshing, selectRecorrido, recorridoId]);

  const handleStartRecorrido = async () => {
    if (!user?.id || !selectedRecorrido) return;
    setUpdating(true);
    try {
      await startRecorrido(user.id, selectedRecorrido.id);
      await selectRecorrido(recorridoId);
    } finally {
      setUpdating(false);
    }
  };

  const handleBookPress = (book: RecorridoBook, index: number) => {
    const isUnlocked = isBookUnlocked(index, selectedRecorrido?.books ?? []);
    if (!isUnlocked) return;
    if (user?.id && selectedRecorrido) {
      startRecorrido(user.id, selectedRecorrido.id).catch(() => {});
    }
    router.push(`/book/${book.id}`);
  };

  if (isLoading && !selectedRecorrido) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.textMuted }}>Cargando recorrido...</Text>
      </View>
    );
  }

  if (!selectedRecorrido) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.error }}>Recorrido no encontrado</Text>
      </View>
    );
  }

  const recorrido = selectedRecorrido;
  const bgColor = COLORS[recorrido.difficulty % COLORS.length];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Hero cover section */}
        <View style={{ height: 280, backgroundColor: bgColor, position: "relative" }}>
          {/* Cover image as hero */}
          {recorrido.cover ? (
            <Image
              source={{ uri: recorrido.cover }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <>
              <View style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.06)" }} />
              <View style={{ position: "absolute", bottom: -60, left: -30, width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,255,255,0.04)" }} />
              <View style={{ position: "absolute", top: 60, right: 40, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.05)" }} />
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 80 }}>🗺️</Text>
              </View>
            </>
          )}

          {/* Gradient overlay */}
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, backgroundColor: "rgba(0,0,0,0.35)" }} />

          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: 56,
              left: 16,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(0,0,0,0.25)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <Text style={{ fontSize: 22, color: "#fff" }}>←</Text>
          </TouchableOpacity>

          {/* Status badge */}
          <View style={{ position: "absolute", top: 56, right: 16, zIndex: 10 }}>
            <View style={{ backgroundColor: "rgba(0,0,0,0.35)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}>
                {recorrido.status === "completed" ? "🏆 Completado" : recorrido.status === "in_progress" ? "🚀 En curso" : "🗺️ Recorrido"}
              </Text>
            </View>
          </View>

          {/* Title & info overlay */}
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, zIndex: 5 }}>
            <Text style={{ fontSize: 26, fontWeight: "900", color: "#fff", lineHeight: 32 }}>
              {recorrido.title}
            </Text>
            {recorrido.description && (
              <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 6, lineHeight: 18 }} numberOfLines={2}>
                {recorrido.description}
              </Text>
            )}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <HeaderBadge icon="📚" label={`${recorrido.totalBooks} libros`} />
              <HeaderBadge icon="⏱" label={`${recorrido.estimatedMinutes} min`} />
              <HeaderBadge icon="🏆" label={`${recorrido.xpReward} XP`} />
              <HeaderBadge icon="📖" label={difficultyLabel(recorrido.difficulty)} />
            </View>
          </View>

          {/* Bottom rounded edge */}
          <View
            style={{
              position: "absolute",
              bottom: -24,
              left: 0,
              right: 0,
              height: 48,
              backgroundColor: colors.bg,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
            }}
          />
        </View>

        {/* Progress section */}
        {recorrido.status === "completed" && (
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <View
              style={{
                backgroundColor: colors.successBg,
                borderRadius: 16,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                borderLeftWidth: 4,
                borderLeftColor: colors.success,
              }}
            >
              <Text style={{ fontSize: 28 }}>🏆</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#166534" }}>
                  Recorrido completado
                </Text>
                <Text style={{ fontSize: 12, color: colors.success, marginTop: 2 }}>
                  {recorrido.completedBooks} de {recorrido.totalBooks} libros • {recorrido.xpReward} XP ganados
                </Text>
              </View>
            </View>
          </View>
        )}

        {recorrido.status === "in_progress" && (
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <View
              style={{
                backgroundColor: colors.white,
                borderRadius: 16,
                padding: 16,
                ...shadows.card,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }}>Progreso</Text>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary }}>{recorrido.progress}%</Text>
              </View>
              <View style={{ height: 8, backgroundColor: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.primary, width: `${recorrido.progress}%` }} />
              </View>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
                {recorrido.completedBooks} de {recorrido.totalBooks} libros completados
              </Text>
            </View>
          </View>
        )}

        {recorrido.status === "not_started" && (
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <TouchableOpacity
              onPress={handleStartRecorrido}
              disabled={updating}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                opacity: updating ? 0.6 : 1,
                shadowColor: colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 4,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                {updating ? "Iniciando..." : "Comenzar recorrido →"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Book list */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: colors.primary }} />
            <Text style={{ fontSize: 17, fontWeight: "700", color: colors.text }}>
              Ruta de aprendizaje
            </Text>
          </View>

          {/* Timeline */}
          <View style={{ paddingLeft: 8 }}>
            {recorrido.books.map((book, index) => {
              const unlocked = isBookUnlocked(index, recorrido.books);
              const isLast = index === recorrido.books.length - 1;
              const status = unlocked ? book.status : "locked";
              const statusCfg = STATUS_CONFIG[status === "locked" ? "locked" : book.status];

              return (
                <TouchableOpacity
                  key={book.id}
                  onPress={() => handleBookPress(book, index)}
                  activeOpacity={unlocked ? 0.85 : 1}
                  style={{
                    flexDirection: "row",
                    marginBottom: 4,
                    opacity: unlocked ? 1 : 0.6,
                  }}
                >
                  {/* Timeline indicator */}
                  <View style={{ alignItems: "center", width: 40, marginRight: 12 }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor:
                          book.status === "completed"
                            ? colors.success
                            : unlocked
                              ? colors.primary
                              : colors.border,
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1,
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>
                        {book.status === "completed" ? "✓" : unlocked ? `${index + 1}` : "🔒"}
                      </Text>
                    </View>
                    {!isLast && (
                      <View
                        style={{
                          width: 2,
                          flex: 1,
                          minHeight: 20,
                          backgroundColor:
                            book.status === "completed" ? colors.success : colors.border,
                        }}
                      />
                    )}
                  </View>

                  {/* Book card */}
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: colors.white,
                      borderRadius: 16,
                      padding: 14,
                      marginBottom: 12,
                      ...shadows.card,
                      borderLeftWidth: 3,
                      borderLeftColor:
                        book.status === "completed"
                          ? colors.success
                          : unlocked
                            ? colors.primary
                            : colors.border,
                    }}
                  >
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <CoverPlaceholder title={book.title} difficulty={book.difficulty} />
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text
                          style={{ fontWeight: "700", fontSize: 15, color: colors.text }}
                          numberOfLines={1}
                        >
                          {book.title}
                        </Text>

                        {book.categories.length > 0 && (
                          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                            {book.categories.slice(0, 2).map((cat) => (
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

                        <View style={{ flexDirection: "row", gap: 8, marginTop: 2 }}>
                            <Text style={{ fontSize: 10, color: colors.textMuted }}>
                              📄 {book.totalPages ?? "-"} pág
                            </Text>
                            <Text style={{ fontSize: 10, color: colors.textMuted }}>
                              ⏱ {book.estimatedMinutes ?? "-"} min
                            </Text>
                            <Text style={{ fontSize: 10, color: colors.textMuted }}>
                              ⭐ {book.xp} XP
                            </Text>
                        </View>

                        {!unlocked && (
                          <View
                            style={{
                              backgroundColor: "#F1F5F9",
                              borderRadius: 6,
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              alignSelf: "flex-start",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                              marginTop: 4,
                            }}
                          >
                            <Text style={{ fontSize: 10, color: colors.textSecondary, fontWeight: "500" }}>
                              Completa "{recorrido.books[index - 1]?.title}" primero
                            </Text>
                          </View>
                        )}

                        {unlocked && book.status === "new" && (
                          <View
                            style={{
                              backgroundColor: colors.primaryBg,
                              borderRadius: 6,
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              alignSelf: "flex-start",
                              marginTop: 4,
                            }}
                          >
                            <Text style={{ fontSize: 10, color: colors.primary, fontWeight: "600" }}>
                              Disponible
                            </Text>
                          </View>
                        )}

                        {book.status === "reading" && (
                          <View style={{ marginTop: 4 }}>
                            <View
                              style={{
                                height: 4,
                                backgroundColor: "#F1F5F9",
                                borderRadius: 2,
                                overflow: "hidden",
                              }}
                            >
                              <View
                                style={{
                                  height: 4,
                                  borderRadius: 2,
                                  backgroundColor: "#3B82F6",
                                  width: `${book.progress}%`,
                                }}
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function isBookUnlocked(index: number, books: RecorridoBook[]): boolean {
  if (index === 0) return true;
  const prev = books[index - 1];
  return prev.status === "completed";
}

function CoverPlaceholder({ title, difficulty }: { title: string; difficulty: number }) {
  const [top, bottom] = colors.coverColors[difficulty % colors.coverColors.length];
  const initial = title.charAt(0).toUpperCase();

  return (
    <View
      style={{
        width: 52,
        height: 70,
        borderRadius: 12,
        backgroundColor: bottom,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
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
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800", zIndex: 1 }}>
        {initial}
      </Text>
    </View>
  );
}

function HeaderBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255,255,255,0.12)",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <Text style={{ fontSize: 13 }}>{icon}</Text>
      <Text style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}>
        {label}
      </Text>
    </View>
  );
}


