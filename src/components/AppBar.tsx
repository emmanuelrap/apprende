import { Ionicons } from "@expo/vector-icons";
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
        colors={["#0F766E", "#14B8A6", "#34D399"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          marginHorizontal: 12,
          marginTop: 8,
          marginBottom: 4,
          paddingHorizontal: 16,
          paddingVertical: 12,
          shadowColor: "#0F766E",
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
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
            backgroundColor: "rgba(255,255,255,0.08)",
            borderTopLeftRadius: 16,
          }}
        />

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
              AprendeLibros
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
                  <Ionicons name="hexagon-outline" size={14} color="#FCD34D" />
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
          <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center", gap: 6 }}>
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
              width: 210,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              paddingVertical: 8,
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4000,
              zIndex: 4000,
            }}
          >
            <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: "#E5E7EB" }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#0F172A" }}>{name}</Text>
              <Text style={{ fontSize: 11, color: "#64748B" }}>Nivel {level} · {xp} XP</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setOpenMenu(false);
                router.push("/profile");
              }}
              style={{ paddingHorizontal: 12, paddingVertical: 10 }}
            >
              <Text>Ver mi perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setOpenMenu(false);
              }}
              style={{ paddingHorizontal: 12, paddingVertical: 10 }}
            >
              <Text>Settings</Text>
            </TouchableOpacity>

            {isAdmin && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setOpenMenu(false);
                    router.push("/admin/users");
                  }}
                  style={{ paddingHorizontal: 12, paddingVertical: 10 }}
                >
                  <Text style={{ color: "#6366F1", fontWeight: "600" }}>Admin Usuarios</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setOpenMenu(false);
                    router.push("/admin/books");
                  }}
                  style={{ paddingHorizontal: 12, paddingVertical: 10 }}
                >
                  <Text style={{ color: "#6366F1", fontWeight: "600" }}>Admin Libros</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={handleClearData}
              style={{ paddingHorizontal: 12, paddingVertical: 10 }}
            >
              <Text style={{ color: "#B91C1C", fontWeight: "600" }}>Borrar mis datos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={{ paddingHorizontal: 12, paddingVertical: 10 }}
            >
              <Text style={{ fontWeight: "600" }}>Cerrar sesion</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
