import { Text, View } from "react-native";

const TEAL = "#078F83";
const TEAL_DARK = "#056860";

function getLevel(xp: number) {
  if (xp >= 5000) return { level: 10, label: "Políglota" };
  if (xp >= 3000) return { level: 8, label: "Avanzado" };
  if (xp >= 2000) return { level: 6, label: "Intermedio" };
  if (xp >= 1000) return { level: 4, label: "Aprendiz" };
  if (xp >= 500) return { level: 2, label: "Novato" };
  return { level: 1, label: "Principiante" };
}

function getNextLevelXp(xp: number) {
  const thresholds = [0, 500, 1000, 2000, 3000, 5000];
  for (let i = 0; i < thresholds.length; i++) {
    if (xp < thresholds[i]) return thresholds[i];
  }
  return thresholds[thresholds.length - 1];
}

function getPrevLevelXp(xp: number) {
  const thresholds = [0, 500, 1000, 2000, 3000, 5000];
  let prev = 0;
  for (const t of thresholds) {
    if (xp >= t) prev = t;
    else break;
  }
  return prev;
}

export function ProfileCard({
  name,
  xp,
}: {
  name: string;
  xp: number;
}) {
  const { level, label } = getLevel(xp);
  const nextXp = getNextLevelXp(xp);
  const prevXp = getPrevLevelXp(xp);
  const progress = nextXp > prevXp ? ((xp - prevXp) / (nextXp - prevXp)) * 100 : 100;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        marginBottom: 20,
        shadowColor: TEAL,
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          {/* Avatar with ring */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: TEAL,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderColor: "#E1F5EE",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800" }}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#0F172A" }}>
              ¡Hola, {name}!
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
              <View
                style={{
                  backgroundColor: "#E8F5F3",
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "700", color: TEAL }}>
                  Nv. {level} · {label}
                </Text>
              </View>
            </View>
          </View>

          {/* XP badge */}
          <View
            style={{
              backgroundColor: "#FFFBEB",
              borderRadius: 16,
              paddingHorizontal: 14,
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "800", color: "#F59E0B" }}>
              {xp}
            </Text>
            <Text style={{ fontSize: 9, fontWeight: "600", color: "#D97706", marginTop: -2 }}>
              XP
            </Text>
          </View>
        </View>

        {/* Level progress bar */}
        {xp < 5000 && (
          <View style={{ marginTop: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 11, color: "#94A3B8", fontWeight: "500" }}>
                Próximo nivel
              </Text>
              <Text style={{ fontSize: 11, color: "#94A3B8", fontWeight: "500" }}>
                {xp - prevXp} / {nextXp - prevXp} XP
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#F1F5F9",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: TEAL,
                  width: `${Math.min(progress, 100)}%`,
                }}
              />
            </View>
          </View>
        )}

        {/* Max level badge */}
        {xp >= 5000 && (
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <View style={{ backgroundColor: "#F0FDF4", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#16A34A" }}>
                🏆 ¡Nivel máximo alcanzado!
              </Text>
            </View>
          </View>
        )}

        {/* Quick stats row */}
        <View style={{ flexDirection: "row", marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F1F5F9", gap: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontSize: 14 }}>🔥</Text>
            <Text style={{ fontSize: 12, color: "#64748B" }}>Racha: <Text style={{ fontWeight: "700", color: "#0F172A" }}>0</Text></Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontSize: 14 }}>📚</Text>
            <Text style={{ fontSize: 12, color: "#64748B" }}>Nivel: <Text style={{ fontWeight: "700", color: TEAL }}>{level}</Text></Text>
          </View>
        </View>
      </View>
    </View>
  );
}
