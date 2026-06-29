import { colors, shadows } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
type IoniconsName = keyof typeof Ionicons.glyphMap;
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";
import { useGamificationStore } from "../store/gamificationStore";

function MenuItem({
  icon,
  label,
  onPress,
  labelColor,
  fontWeight,
}: {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  labelColor?: string;
  fontWeight?: "300" | "400" | "500" | "600" | "700" | "800" | "bold";
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          backgroundColor: colors.bg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name={icon} size={16} color={labelColor || colors.textSecondary} />
      </View>
      <Text
        style={{
          fontSize: 13,
          fontWeight: fontWeight || "500",
          color: labelColor || colors.text,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function AppBar() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((state) => state.logout);
  const clearMyData = useAuthStore((state) => state.clearMyData);
  const levels = useGamificationStore((s) => s.levels);
  const fetchLevels = useGamificationStore((s) => s.fetchLevels);
  const computeLevel = useGamificationStore((s) => s.computeLevel);
  const currentLevel = useGamificationStore((s) => s.currentLevel);
  const nextLevel = useGamificationStore((s) => s.nextLevel);

  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const levelTitle = currentLevel?.title ?? "";
  const avatarUrl = profile?.avatar_url;
  const name = profile?.name ?? user?.user_metadata?.name ?? "Usuario";

  useEffect(() => {
    if (levels.length === 0) fetchLevels();
  }, []);

  useEffect(() => {
    computeLevel(xp);
  }, [xp, levels]);

  const isAdmin = user?.email === "emmanuelzzz123@gmail.com";

  const xpProgress =
    currentLevel && nextLevel
      ? ((xp - currentLevel.xp_required) /
          (nextLevel.xp_required - currentLevel.xp_required)) *
        100
      : 100;

  const handleLogout = async () => {
    await logout();
    setOpenMenu(false);
    router.replace("/");
  };

  const handleClearData = () => {
    const run = async () => {
      try {
        await clearMyData();
        setOpenMenu(false);
      } catch (error) {
        console.error("[Profile] Error borrando datos del usuario:", error);
      }
    };

    if (Platform.OS === "web") {
      const ok = window.confirm(
        "Esto borrara tus trofeos, progreso, sesiones, vocabulario y eventos XP. Deseas continuar?",
      );
      if (ok) run();
      return;
    }

    Alert.alert(
      "Borrar mis datos",
      "Esto borrara tus trofeos, progreso, sesiones, vocabulario y eventos XP.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Borrar", style: "destructive", onPress: run },
      ],
    );
  };

  return (
    <View style={{ position: "relative", zIndex: 3000, elevation: 3000 }}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primaryMedium, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 12,
          paddingBottom: 14,
          paddingHorizontal: 0,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        />

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
          {/* Logo + App name */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.15)",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.25)",
              }}
            >
              <Ionicons name="book-outline" size={18} color="#fff" />
            </View>
            <Text
              style={{ fontSize: 18, fontWeight: "600", letterSpacing: -0.3, color: "#fff" }}
            >
              Apprende
            </Text>
          </View>

          {/* XP + Avatar */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity onPress={() => setOpenMenu((prev) => !prev)}>
              <View style={{ alignItems: "flex-end" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.25)",
                  }}
                >
                  <Ionicons name="star-outline" size={14} color="#FCD34D" />
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#FEF3C7" }}>
                    {xp} XP
                  </Text>
                </View>
                <Text style={{ marginTop: 2, fontSize: 10, fontWeight: "500", color: "rgba(255,255,255,0.85)" }}>
                  Nivel {level}{levelTitle ? ` · ${levelTitle}` : ""}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOpenMenu((prev) => !prev)}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  overflow: "hidden",
                  borderWidth: 2,
                  borderColor: "rgba(255,255,255,0.4)",
                }}
              >
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="person-outline" size={22} color="#fff" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress bar to next level */}
        {nextLevel && (
          <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16 }}>
            <View
              style={{
                flex: 1,
                height: 4,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  width: `${Math.min(xpProgress, 100)}%`,
                }}
              />
            </View>
            <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>
              {xp - currentLevel!.xp_required}/{nextLevel.xp_required - currentLevel!.xp_required} XP
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Menu dropdown */}
      {openMenu && (
        <>
          <Pressable
            onPress={() => setOpenMenu(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: -2000,
              zIndex: 3999,
              elevation: 3999,
            }}
          />
          <View
            style={{
              position: "absolute",
              right: 12,
              top: 64,
              width: 220,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              paddingVertical: 6,
              ...shadows.dropdown,
              zIndex: 4000,
            }}
          >
            {/* Profile card */}
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.primaryBg,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {avatarUrl ? (
                    <Image
                      source={{ uri: avatarUrl }}
                      style={{ width: 36, height: 36, borderRadius: 18 }}
                    />
                  ) : (
                    <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primaryDarkest }}>
                      {name[0]?.toUpperCase() || "U"}
                    </Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "700", color: colors.text }}
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                    Nivel {level} · {xp} XP
                  </Text>
                </View>
              </View>
              {/* Mini level progress */}
              <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View
                  style={{
                    flex: 1,
                    height: 3,
                    backgroundColor: colors.border,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: colors.primary,
                      width: `${Math.min(xpProgress, 100)}%`,
                    }}
                  />
                </View>
                <Text style={{ fontSize: 9, color: colors.textMuted }}>
                  {nextLevel ? `${xp - currentLevel!.xp_required}/${nextLevel.xp_required - currentLevel!.xp_required}` : ""}
                </Text>
              </View>
            </View>

            {/* Menu items */}
            <MenuItem
              icon="person-outline"
              label="Ver mi perfil"
              onPress={() => {
                setOpenMenu(false);
                router.push("/profile");
              }}
            />
            <MenuItem
              icon="settings-outline"
              label="Configuración"
              onPress={() => setOpenMenu(false)}
            />
            <View style={{ height: 6 }} />
            {isAdmin && (
              <>
                <View style={{ paddingHorizontal: 14, paddingBottom: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: "600", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Admin
                  </Text>
                </View>
                <MenuItem
                  icon="people-outline"
                  label="Usuarios"
                  labelColor="#6366F1"
                  onPress={() => {
                    setOpenMenu(false);
                    router.push("/admin/users");
                  }}
                />
                <MenuItem
                  icon="book-outline"
                  label="Libros"
                  labelColor="#6366F1"
                  onPress={() => {
                    setOpenMenu(false);
                    router.push("/admin/books");
                  }}
                />
                <View style={{ height: 6 }} />
              </>
            )}
            <MenuItem
              icon="trash-outline"
              label="Borrar mis datos"
              labelColor={colors.error}
              onPress={handleClearData}
            />
            <View style={{ height: 4 }} />
            <MenuItem
              icon="log-out-outline"
              label="Cerrar sesión"
              labelColor={colors.text}
              fontWeight="600"
              onPress={handleLogout}
            />
          </View>
        </>
      )}
    </View>
  );
}
