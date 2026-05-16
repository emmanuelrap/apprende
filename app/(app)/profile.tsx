import { useAuthStore } from "@/src/store/authStore";
import { useGamificationStore } from "@/src/store/gamificationStore";
import { useReadingStore } from "@/src/store/readingStore";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { profile, xpEvents } = useAuthStore();
  const { userBooks, sessions } = useReadingStore();
  const { userTrophies } = useGamificationStore();

  const booksCompleted = userBooks.filter(
    (b) => b.status === "completed",
  ).length;
  const booksReading = userBooks.filter((b) => b.status === "reading").length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.minutes, 0);
  const totalPages = sessions.reduce((acc, s) => acc + s.pages, 0);

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
            { label: "Completados", value: booksCompleted, emoji: "✅" },
            { label: "Leyendo", value: booksReading, emoji: "📖" },
            { label: "Minutos", value: totalMinutes, emoji: "⏱" },
            { label: "Páginas", value: totalPages, emoji: "📄" },
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

        {/* 🏆 trofeos */}
        <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 10 }}>
          Trofeos
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {userTrophies.length === 0 && (
            <Text style={{ color: "#94A3B8", fontSize: 13 }}>
              Aún no tienes trofeos
            </Text>
          )}
          {userTrophies.map((t) => (
            <View
              key={t.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
                alignItems: "center",
                width: 90,
              }}
            >
              <Text style={{ fontSize: 24 }}>{t.icon}</Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {t.name}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  marginTop: 2,
                  color:
                    t.rarity === "legendary"
                      ? "#F59E0B"
                      : t.rarity === "epic"
                        ? "#8B5CF6"
                        : t.rarity === "rare"
                          ? "#3B82F6"
                          : "#94A3B8",
                }}
              >
                {t.rarity}
              </Text>
            </View>
          ))}
        </View>

        {/* 📚 sesiones */}
        <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 10 }}>
          Sesiones de lectura
        </Text>
        {sessions.length === 0 && (
          <Text style={{ color: "#94A3B8", fontSize: 13, marginBottom: 16 }}>
            Aún no tienes sesiones
          </Text>
        )}
        {sessions.map((s) => (
          <View
            key={s.id}
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
        {xpEvents.length === 0 && (
          <Text style={{ color: "#94A3B8", fontSize: 13 }}>
            Aún no tienes eventos de XP
          </Text>
        )}
        {xpEvents.map((e) => (
          <View
            key={e.id}
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
