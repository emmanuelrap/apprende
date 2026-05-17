import { ActivityIndicator, Text, View } from "react-native";

export function HomeLoading() {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(247,250,252,0.92)",
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 260,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          paddingVertical: 20,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          alignItems: "center",
          gap: 12,
        }}
      >
        <ActivityIndicator size="large" color="#1A7A6E" />
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#0F172A" }}>
          Cargando inicio
        </Text>
        <Text style={{ fontSize: 13, color: "#64748B", textAlign: "center" }}>
          Estamos preparando tus libros y progreso.
        </Text>
      </View>
    </View>
  );
}
