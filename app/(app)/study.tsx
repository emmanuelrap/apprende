import { colors } from "@/src/theme";
import { useVocabularyStore } from "@/src/store/vocabularyStore";
import { useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Filter = "hard" | "pending" | "mastered";
type Mode = "flashcard" | "writing";
type Screen = "setup" | "session" | "results";

const FILTERS: { id: Filter; label: string; emoji: string; desc: string }[] = [
  { id: "hard", label: "Difíciles", emoji: "🔥", desc: "mastery = 0" },
  { id: "pending", label: "Pendientes", emoji: "📚", desc: "mastery < 2" },
  { id: "mastered", label: "Las domino", emoji: "✅", desc: "mastery = 2" },
];

const MODES: { id: Mode; label: string; emoji: string }[] = [
  { id: "flashcard", label: "Flashcards", emoji: "🃏" },
  { id: "writing", label: "Escritura", emoji: "🔤" },
];

export default function Study() {
  const { reviewItems, updateMastery } = useVocabularyStore();

  const [screen, setScreen] = useState<Screen>("setup");
  const [filter, setFilter] = useState<Filter>("pending");
  const [mode, setMode] = useState<Mode>("flashcard");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ bad: 0, ok: 0, good: 0 });
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const flipAnim = useState(new Animated.Value(0))[0];

  // filtrar items según selección
  const filteredItems = reviewItems.filter((item) => {
    if (filter === "hard") return item.mastery === 0;
    if (filter === "pending") return item.mastery < 2;
    if (filter === "mastered") return item.mastery === 2;
    return true;
  });

  const current = filteredItems[currentIndex];

  const flip = () => {
    if (flipped) return;
    Animated.spring(flipAnim, { toValue: 1, useNativeDriver: true }).start();
    setFlipped(true);
  };

  const next = async (mastery: 0 | 1 | 2) => {
    await updateMastery(current.id, mastery);
    setResults((prev) => ({
      bad: mastery === 0 ? prev.bad + 1 : prev.bad,
      ok: mastery === 1 ? prev.ok + 1 : prev.ok,
      good: mastery === 2 ? prev.good + 1 : prev.good,
    }));

    if (currentIndex + 1 >= filteredItems.length) {
      setScreen("results");
    } else {
      flipAnim.setValue(0);
      setFlipped(false);
      setAnswer("");
      setChecked(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const checkAnswer = async () => {
    const correct =
      answer.trim().toLowerCase() === current.content.trim().toLowerCase();
    setIsCorrect(correct);
    setChecked(true);
    await updateMastery(current.id, correct ? 2 : 0);
    setResults((prev) => ({
      ...prev,
      bad: !correct ? prev.bad + 1 : prev.bad,
      good: correct ? prev.good + 1 : prev.good,
    }));
  };

  const nextWriting = () => {
    if (currentIndex + 1 >= filteredItems.length) {
      setScreen("results");
    } else {
      setAnswer("");
      setChecked(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const restart = () => {
    setScreen("setup");
    setCurrentIndex(0);
    setFlipped(false);
    setResults({ bad: 0, ok: 0, good: 0 });
    setAnswer("");
    setChecked(false);
    flipAnim.setValue(0);
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  // =====================
  // SETUP
  // =====================
  if (screen === "setup") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 4 }}>
            📚 Repaso
          </Text>
          <Text style={{ color: colors.textMuted, marginBottom: 32 }}>
            Elige qué estudiar y cómo
          </Text>

          {/* filtro */}
          <Text style={{ fontWeight: "700", fontSize: 15, marginBottom: 12 }}>
            ¿Qué quieres repasar?
          </Text>
          <View style={{ gap: 10, marginBottom: 32 }}>
            {FILTERS.map((f) => {
              const count = reviewItems.filter((item) => {
                if (f.id === "hard") return item.mastery === 0;
                if (f.id === "pending") return item.mastery < 2;
                if (f.id === "mastered") return item.mastery === 2;
                return true;
              }).length;

              const active = filter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setFilter(f.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 16,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: active ? colors.primary : colors.border,
                    backgroundColor: active ? colors.primaryBg : "#fff",
                  }}
                >
                  <Text style={{ fontSize: 24, marginRight: 12 }}>
                    {f.emoji}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "700",
                        color: active ? colors.primary : colors.text,
                      }}
                    >
                      {f.label}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: active ? colors.primary : colors.border,
                      borderRadius: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: active ? "#fff" : colors.textSecondary,
                        fontWeight: "700",
                        fontSize: 13,
                      }}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* modo */}
          <Text style={{ fontWeight: "700", fontSize: 15, marginBottom: 12 }}>
            ¿Cómo quieres estudiar?
          </Text>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 40 }}>
            {MODES.map((m) => {
              const active = mode === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setMode(m.id)}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 14,
                    alignItems: "center",
                    borderWidth: 1.5,
                    borderColor: active ? colors.primary : colors.border,
                    backgroundColor: active ? colors.primaryBg : "#fff",
                  }}
                >
                  <Text style={{ fontSize: 28, marginBottom: 6 }}>
                    {m.emoji}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "700",
                      color: active ? colors.primary : colors.text,
                    }}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* empezar */}
          {filteredItems.length === 0 ? (
            <View style={{ alignItems: "center", padding: 24 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>📭</Text>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>
                No hay palabras en esta categoría
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setCurrentIndex(0);
                setScreen("session");
              }}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Empezar sesión · {filteredItems.length} palabras
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =====================
  // RESULTS
  // =====================
  if (screen === "results") {
    const total = results.bad + results.ok + results.good;
    const accuracy = Math.round((results.good / total) * 100);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <Text style={{ fontSize: 48, marginBottom: 12 }}>
            {accuracy >= 80 ? "🎉" : accuracy >= 50 ? "💪" : "📖"}
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 4 }}>
            ¡Sesión completada!
          </Text>
          <Text style={{ color: colors.textMuted, marginBottom: 32 }}>
            Precisión: {accuracy}%
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 32,
              width: "100%",
            }}
          >
            {[
              {
                label: "No la sé",
                value: results.bad,
                color: colors.error,
                bg: "#FEF2F2",
                border: "#FECACA",
              },
              {
                label: "Más o menos",
                value: results.ok,
                color: colors.warning,
                bg: "#FFFBEB",
                border: "#FDE68A",
              },
              {
                label: "La domino",
                value: results.good,
                color: colors.success,
                bg: "#F0FDF4",
                border: "#BBF7D0",
              },
            ].map((r) => (
              <View
                key={r.label}
                style={{
                  flex: 1,
                  backgroundColor: r.bg,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: r.border,
                }}
              >
                <Text
                  style={{ fontSize: 28, fontWeight: "700", color: r.color }}
                >
                  {r.value}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: r.color,
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  {r.label}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={restart}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 14,
              paddingHorizontal: 32,
              paddingVertical: 14,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Volver al inicio
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!current) {
    setScreen("results");
    return null;
  }
  // =====================
  // SESSION
  // =====================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        {/* header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity onPress={restart}>
            <Text style={{ color: colors.textMuted }}>← Salir</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.textMuted }}>
            {currentIndex + 1} / {filteredItems.length}
          </Text>
        </View>

        {/* progreso */}
        <View
          style={{
            height: 4,
            backgroundColor: colors.border,
            borderRadius: 4,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              height: 4,
              borderRadius: 4,
              backgroundColor: colors.primary,
              width: `${((currentIndex + 1) / filteredItems.length) * 100}%`,
            }}
          />
        </View>

        {/* FLASHCARD */}
        {mode === "flashcard" && (
          <>
            <TouchableOpacity
              onPress={flip}
              activeOpacity={0.9}
              style={{ marginBottom: 24 }}
            >
              <Animated.View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 32,
                  minHeight: 260,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  backfaceVisibility: "hidden",
                  transform: [{ rotateY: frontRotate }],
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.textMuted,
                    marginBottom: 12,
                    letterSpacing: 1,
                  }}
                >
                  {current.type === "word" ? "PALABRA" : "ORACIÓN"}
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: colors.text,
                    textAlign: "center",
                  }}
                >
                  {current.content}
                </Text>
                {!flipped && (
                  <Text
                    style={{ fontSize: 13, color: "#CBD5E1", marginTop: 24 }}
                  >
                    Toca para revelar
                  </Text>
                )}
              </Animated.View>

              <Animated.View
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 20,
                  padding: 32,
                  minHeight: 260,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  backfaceVisibility: "hidden",
                  transform: [{ rotateY: backRotate }],
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: "#A5B4FC",
                    marginBottom: 12,
                    letterSpacing: 1,
                  }}
                >
                  TRADUCCIÓN
                </Text>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "700",
                    color: "#fff",
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  {current.translation ?? "Sin traducción"}
                </Text>
                {current.type === "word" && current.context && (
                  <>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#818CF8",
                        width: "100%",
                        marginBottom: 16,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#A5B4FC",
                        marginBottom: 8,
                        letterSpacing: 1,
                      }}
                    >
                      CONTEXTO
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#E0E7FF",
                        textAlign: "center",
                        lineHeight: 22,
                        fontStyle: "italic",
                      }}
                    >
                      {current.context}
                    </Text>
                  </>
                )}
              </Animated.View>
            </TouchableOpacity>

            {flipped && (
              <View style={{ flexDirection: "row", gap: 10 }}>
                {[
                  {
                    mastery: 0 as const,
                    emoji: "😅",
                    label: "No la sé",
                    bg: "#FEF2F2",
                    border: "#FECACA",
                    color: colors.error,
                  },
                  {
                    mastery: 1 as const,
                    emoji: "🤔",
                    label: "Más o menos",
                    bg: "#FFFBEB",
                    border: "#FDE68A",
                    color: colors.warning,
                  },
                  {
                    mastery: 2 as const,
                    emoji: "✅",
                    label: "La domino",
                    bg: "#F0FDF4",
                    border: "#BBF7D0",
                    color: colors.success,
                  },
                ].map((btn) => (
                  <TouchableOpacity
                    key={btn.mastery}
                    onPress={() => next(btn.mastery)}
                    style={{
                      flex: 1,
                      backgroundColor: btn.bg,
                      borderRadius: 14,
                      padding: 16,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: btn.border,
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{btn.emoji}</Text>
                    <Text
                      style={{
                        color: btn.color,
                        fontWeight: "600",
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      {btn.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* ESCRITURA */}
        {mode === "writing" && (
          <View>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 32,
                minHeight: 180,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textMuted,
                  marginBottom: 12,
                  letterSpacing: 1,
                }}
              >
                TRADUCCIÓN
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: colors.text,
                  textAlign: "center",
                }}
              >
                {current.translation ?? "Sin traducción"}
              </Text>
              {current.context && (
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textMuted,
                    textAlign: "center",
                    marginTop: 12,
                    fontStyle: "italic",
                  }}
                >
                  {current.context}
                </Text>
              )}
            </View>

            <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>
              Escribe la palabra en inglés:
            </Text>

            <TextInput
              value={answer}
              onChangeText={setAnswer}
              placeholder="Tu respuesta..."
              editable={!checked}
              autoCapitalize="none"
              style={{
                borderWidth: 1.5,
                borderColor: checked
                  ? isCorrect
                    ? colors.success
                    : colors.error
                  : colors.border,
                borderRadius: 12,
                padding: 14,
                fontSize: 18,
                marginBottom: 16,
                backgroundColor: checked
                  ? isCorrect
                    ? "#F0FDF4"
                    : "#FEF2F2"
                  : "#fff",
              }}
            />

            {checked && (
              <View
                style={{
                  backgroundColor: isCorrect ? "#F0FDF4" : "#FEF2F2",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: isCorrect ? "#BBF7D0" : "#FECACA",
                }}
              >
                <Text
                  style={{
                    color: isCorrect ? colors.success : colors.error,
                    fontWeight: "700",
                    marginBottom: 4,
                  }}
                >
                  {isCorrect ? "✅ ¡Correcto!" : "❌ Incorrecto"}
                </Text>
                {!isCorrect && (
                  <Text style={{ color: colors.textSecondary }}>
                    La respuesta era:{" "}
                    <Text style={{ fontWeight: "700" }}>{current.content}</Text>
                  </Text>
                )}
              </View>
            )}

            {!checked ? (
              <TouchableOpacity
                onPress={checkAnswer}
                disabled={answer.trim().length === 0}
                style={{
                  backgroundColor:
                    answer.trim().length === 0 ? colors.border : colors.primary,
                  borderRadius: 14,
                  padding: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                >
                  Verificar
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={nextWriting}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 14,
                  padding: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                >
                  {currentIndex + 1 >= filteredItems.length
                    ? "Ver resultados"
                    : "Siguiente →"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
