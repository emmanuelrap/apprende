import { Image, Text, TouchableOpacity, View } from "react-native";
import { difficultyLabel } from "@/src/services/recorridos";

type Recorrido = {
  id: string;
  title: string;
  description: string | null;
  cover: string | null;
  difficulty: number;
  minLevel: number | null;
  estimatedMinutes: number;
  xpReward: number;
  progress: number;
  status: "not_started" | "in_progress" | "completed";
  totalBooks: number;
  completedBooks: number;
};

const TEAL = "#078F83";

const STATUS_CONFIG = {
  not_started: { label: "Sin empezar", bg: "#F1F5F9", text: "#64748B", icon: "🗺️" },
  in_progress: { label: "En curso", bg: "#EFF6FF", text: "#3B82F6", icon: "🚀" },
  completed: { label: "Completado", bg: "#F0FDF4", text: "#16A34A", icon: "🏆" },
} as const;

export function RecorridoCard({
  recorrido,
  onPress,
  userLevel,
}: {
  recorrido: Recorrido;
  onPress: () => void;
  userLevel?: number;
}) {
  const statusCfg = STATUS_CONFIG[recorrido.status];
  const locked = userLevel != null && recorrido.minLevel != null && userLevel < recorrido.minLevel;

  return (
    <TouchableOpacity
      onPress={locked ? undefined : onPress}
      activeOpacity={locked ? 1 : 0.85}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        opacity: locked ? 0.6 : 1,
        overflow: "hidden",
      }}
    >
      {/* Cover hero image */}
      <View style={{ height: 100, backgroundColor: "#E8F5F3", position: "relative", overflow: "hidden" }}>
        {recorrido.cover ? (
          <Image
            source={{ uri: recorrido.cover }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 36 }}>🗺️</Text>
          </View>
        )}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        />
      </View>

      {/* Content */}
      <View style={{ padding: 14, gap: 6 }}>
        {/* Title + status */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Text
            style={{ fontWeight: "700", fontSize: 15, color: "#0F172A", flex: 1, marginRight: 8 }}
            numberOfLines={1}
          >
            {recorrido.title}
          </Text>
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

        {recorrido.description && (
          <Text
            style={{ fontSize: 12, color: "#64748B", lineHeight: 16 }}
            numberOfLines={2}
          >
            {recorrido.description}
          </Text>
        )}

        <View style={{ flexDirection: "row", gap: 12, marginTop: 2 }}>
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>
            📚 {recorrido.completedBooks}/{recorrido.totalBooks} libros
          </Text>
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>
            ⏱ {recorrido.estimatedMinutes} min
          </Text>
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>
            📖 {difficultyLabel(recorrido.difficulty)}
          </Text>
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>
            🏆 {recorrido.xpReward} XP
          </Text>
        </View>

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
            <Text style={{ fontSize: 11, color: "#DC2626", fontWeight: "600" }}>
              Necesitas nivel {recorrido.minLevel}+
            </Text>
          </View>
        )}

        {!locked && recorrido.status !== "not_started" && (
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
                    recorrido.status === "completed" ? "#16A34A" : TEAL,
                  width: `${recorrido.progress}%`,
                }}
              />
            </View>
            <Text style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}>
              {recorrido.status === "completed"
                ? "Recorrido completado"
                : `${recorrido.progress}% completado`}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
