import { supabase } from "@/src/services/supabase";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const TEAL = "#078F83";
const TEAL_DARK = "#056860";

type LevelRow = { level: number; xp_required: number; title: string };

export function ProfileCard({
  name,
  xp,
  level: currentLevel,
}: {
  name: string;
  xp: number;
  level: number;
}) {
  const [levels, setLevels] = useState<LevelRow[]>([]);

  useEffect(() => {
    supabase
      .from("levels")
      .select("level, xp_required, title")
      .order("level")
      .then(({ data }) => {
        if (data) setLevels(data);
      });
  }, []);

  const levelRow = levels.find((l) => l.level === currentLevel);
  const nextRow = levelRow
    ? levels.find((l) => l.level === currentLevel + 1)
    : null;
  const label = levelRow?.title ?? `Nivel ${currentLevel}`;
  const progress =
    levelRow && nextRow
      ? Math.min(
          ((xp - levelRow.xp_required) /
            (nextRow.xp_required - levelRow.xp_required)) *
            100,
          100,
        )
      : 100;

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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: "#E8F5F3",
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "700", color: TEAL }}>
                  Nv. {currentLevel} · {label}
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
            <Text
              style={{
                fontSize: 9,
                fontWeight: "600",
                color: "#D97706",
                marginTop: -2,
              }}
            >
              XP
            </Text>
          </View>
        </View>

        {/* Level progress bar */}
        {nextRow && (
          <View style={{ marginTop: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text
                style={{ fontSize: 11, color: "#94A3B8", fontWeight: "500" }}
              >
                Próximo nivel
              </Text>
              <Text
                style={{ fontSize: 11, color: "#94A3B8", fontWeight: "500" }}
              >
                {xp - levelRow!.xp_required} /{" "}
                {nextRow.xp_required - levelRow!.xp_required} XP
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
        {!nextRow && levels.length > 0 && (
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "#F0FDF4",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{ fontSize: 12, fontWeight: "700", color: "#16A34A" }}
              >
                🏆 ¡Nivel máximo alcanzado!
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
