import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  currentPage: number;
  totalPages: number;
  onSettings: () => void;
};

export function ReadingBar({
  title,
  currentPage,
  totalPages,
  onSettings,
}: Props) {
  const router = useRouter();
  const progress =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <View>
      {/* fila */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 12,
        }}
      >
        {/* 🔙 atrás */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>

        {/* 📖 título */}
        <Text
          numberOfLines={1}
          style={{ flex: 1, fontWeight: "600", fontSize: 15 }}
        >
          {title}
        </Text>

        {/* pág */}
        <Text style={{ fontSize: 12, color: "#94A3B8" }}>
          {currentPage} / {totalPages}
        </Text>

        {/* ⚙️ ajustes */}
        <TouchableOpacity onPress={onSettings}>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* barra de progreso */}
      <View style={{ height: 3, backgroundColor: "#E2E8F0" }}>
        <View
          style={{
            height: 3,
            backgroundColor: "#6366F1",
            width: `${progress}%`,
          }}
        />
      </View>
    </View>
  );
}
