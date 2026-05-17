import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";

export function TopBar({ name }: { name: string }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const clearMyData = useAuthStore((state) => state.clearMyData);

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
      <Text style={{ fontSize: 18, fontWeight: "700" }}>ReadApp</Text>

      <TouchableOpacity onPress={() => setOpenMenu((prev) => !prev)}>
        <Ionicons name="person-circle-outline" size={28} />
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
