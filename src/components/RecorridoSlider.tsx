import { useRouter } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { difficultyLabel } from "@/src/services/recorridos";
import { colors } from "@/src/theme";

type Recorrido = {
  id: string;
  title: string;
  cover: string | null;
  difficulty: number;
  progress: number;
  totalBooks: number;
  completedBooks: number;
};

const CARD_HEIGHT = 160;
const CARD_WIDTH = 280;

function StatusBadge({ completed, inProgress }: { completed: boolean; inProgress: boolean }) {
  if (!completed && !inProgress) return null;
  const text = completed ? "Completado" : "En curso";
  const bg = completed ? "#16A34A" : "#3B82F6";
  return (
    <View style={{ position: "absolute", top: 8, left: 8, backgroundColor: bg, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, zIndex: 2 }}>
      <Text style={{ fontSize: 9, fontWeight: "700", color: "#fff" }}>{text}</Text>
    </View>
  );
}

export function RecorridoSlider({ recorridos, onSeeAll }: { recorridos: Recorrido[]; onSeeAll?: () => void }) {
  const router = useRouter();

  return (
    <FlatList
      data={recorridos}
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
              height: CARD_HEIGHT,
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
        const completed = item.progress >= 100;
        const inProgress = item.progress > 0 && !completed;
        const coverColors = colors.coverColors[index % colors.coverColors.length];

        return (
          <TouchableOpacity
            onPress={() => router.push(`/recorrido/${item.id}` as any)}
            activeOpacity={0.85}
            style={{ width: CARD_WIDTH }}
          >
            <View
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                borderRadius: 16,
                backgroundColor: "#fff",
                flexDirection: "row",
                overflow: "hidden",
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
              }}
            >
              {/* Cover image on the left */}
              <View style={{ width: 110, height: CARD_HEIGHT, backgroundColor: coverColors[0] }}>
                {item.cover ? (
                  <Image
                    source={{ uri: item.cover }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 36, opacity: 0.3 }}>🗺️</Text>
                  </View>
                )}
                <StatusBadge completed={completed} inProgress={inProgress} />
              </View>

              {/* Info on the right */}
              <View style={{ flex: 1, padding: 12, justifyContent: "space-between" }}>
                <View>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#0F172A", lineHeight: 16 }} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>
                    📚 {item.completedBooks}/{item.totalBooks} libros · 🗺️ {difficultyLabel(item.difficulty)}
                  </Text>
                </View>

                {inProgress && (
                  <View>
                    <View style={{ height: 4, backgroundColor: "#F1F5F9", borderRadius: 2, overflow: "hidden" }}>
                      <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.primary, width: `${item.progress}%` }} />
                    </View>
                    <Text style={{ fontSize: 9, color: "#94A3B8", marginTop: 3 }}>{item.progress}% completado</Text>
                  </View>
                )}

                {completed && (
                  <View style={{ backgroundColor: "#F0FDF4", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, alignSelf: "flex-start" }}>
                    <Text style={{ fontSize: 10, fontWeight: "600", color: "#16A34A" }}>🏆 Completado</Text>
                  </View>
                )}

                {!completed && !inProgress && (
                  <View style={{ backgroundColor: "#E8F5F3", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, alignSelf: "flex-start" }}>
                    <Text style={{ fontSize: 10, fontWeight: "600", color: colors.primary }}>🗺️ Explorar</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}
