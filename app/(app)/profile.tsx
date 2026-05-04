import { useAuth } from "@/src/hooks/useAuth";
import { useProfileStats } from "@/src/hooks/useProfileStats";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, profile } = useAuth();
  const { stats, loading } = useProfileStats(user?.id ?? null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* 👤 cabecera */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "#6366F1",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 28 }}>👤</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "700" }}>
            {profile?.name ?? "—"}
          </Text>
          <Text style={{ color: "#6366F1", fontWeight: "600" }}>
            ⚡ {profile?.xp ?? 0} XP
          </Text>
        </View>

        {/* 📊 stats */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
          {[
            {
              label: "Completados",
              value: stats?.booksCompleted ?? 0,
              emoji: "✅",
            },
            { label: "Leyendo", value: stats?.booksReading ?? 0, emoji: "📖" },
            { label: "Minutos", value: stats?.totalMinutes ?? 0, emoji: "⏱" },
            { label: "Páginas", value: stats?.totalPages ?? 0, emoji: "📄" },
          ].map((s) => (
            <View
              key={s.label}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>{s.emoji}</Text>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>{s.value}</Text>
              <Text style={{ fontSize: 11, color: "#94A3B8" }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* 📚 sesiones */}
        <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 10 }}>
          Sesiones de lectura
        </Text>
        {stats?.sessions.map((s, i) => (
          <View
            key={i}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 12,
              marginBottom: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontWeight: "600" }}>{s.books?.title ?? "—"}</Text>
              <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                {new Date(s.created_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 12, color: "#64748B" }}>
                ⏱ {s.minutes} min
              </Text>
              <Text style={{ fontSize: 12, color: "#64748B" }}>
                📄 {s.pages} págs
              </Text>
            </View>
          </View>
        ))}

        {/* ⚡ xp events */}
        <Text
          style={{
            fontWeight: "700",
            fontSize: 16,
            marginTop: 16,
            marginBottom: 10,
          }}
        >
          Historial de XP
        </Text>
        {stats?.xpEvents.map((e, i) => (
          <View
            key={i}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 12,
              marginBottom: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "#64748B" }}>{e.source}</Text>
            <Text style={{ fontWeight: "700", color: "#6366F1" }}>
              +{e.amount} XP
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
