import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";
import { useGamificationStore } from "../store/gamificationStore";

const TEAL = "#078F83";

export function TopBar({ name }: { name: string }) {
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
        console.log("[Profile] Datos del usuario eliminados correctamente.");
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
    <View
      style={{
        position: "relative",
        zIndex: 3000,
        elevation: 3000,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
      }}
    >
      {/* Level & XP */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
        <View
          style={{
            backgroundColor: TEAL,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>
            Nv.{level}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#0F172A" }} numberOfLines={1}>
              {profile?.name ?? name}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#F59E0B" }}>
              {xp} XP
            </Text>
          </View>
          {nextLevel && (
            <View style={{ marginTop: 2, flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View style={{ flex: 1, height: 4, backgroundColor: "#F1F5F9", borderRadius: 2, overflow: "hidden" }}>
                <View
                  style={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: TEAL,
                    width: `${Math.min(xpProgress, 100)}%`,
                  }}
                />
              </View>
              <Text style={{ fontSize: 9, color: "#94A3B8" }}>
                {xp - currentLevel!.xp_required}/{nextLevel.xp_required - currentLevel!.xp_required}
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={() => setOpenMenu((prev) => !prev)}>
        <Ionicons name="person-circle-outline" size={28} color="#64748B" />
      </TouchableOpacity>

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
              top: 58,
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
                console.log("[Menu] Settings pendiente.");
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
                  <Text style={{ color: "#6366F1", fontWeight: "600" }}>
                    Admin Usuarios
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setOpenMenu(false);
                    router.push("/admin/books");
                  }}
                  style={{ paddingHorizontal: 12, paddingVertical: 10 }}
                >
                  <Text style={{ color: "#6366F1", fontWeight: "600" }}>
                    Admin Libros
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={handleClearData}
              style={{ paddingHorizontal: 12, paddingVertical: 10 }}
            >
              <Text style={{ color: "#B91C1C", fontWeight: "600" }}>
                Borrar mis datos
              </Text>
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
