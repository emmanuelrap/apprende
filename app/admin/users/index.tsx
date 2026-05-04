import { supabase } from "@/src/services/supabase";
import { deleteUser } from "@/src/services/users";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function AdminBooks() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,name, avatar_url");

      if (error) {
        console.error(error);
      } else {
        setUsers(data || []);
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleDeleteUser = (userId: string) => {
    if (Platform.OS === "web") {
      const ok = window.confirm("¿Eliminar usuario?");
      if (!ok) return;

      onDelete(userId);
    } else {
      Alert.alert("Eliminar usuario", "¿Seguro?", [
        { text: "Cancelar" },
        { text: "Eliminar", onPress: () => onDelete(userId) },
      ]);
    }
  };

  const onDelete = async (userId: string) => {
    try {
      await deleteUser(userId);

      setUsers((prev) => prev.filter((u) => u.id !== userId));

      Toast.show({
        type: "success",
        text1: "Usuario eliminado",
      });
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
          📚 Admin - Usuarios
        </Text>

        {/* 📚 Lista */}
        {users.map((user) => (
          <View key={user.id}>
            <TouchableOpacity
              style={{
                padding: 14,
                backgroundColor: "#fff",
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "600" }}>{user.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteUser(user.id)}>
              <Text>Borrar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {loading && <ActivityIndicator />}
      </ScrollView>
    </SafeAreaView>
  );
}
