import { supabase } from "@/src/services/supabase";
import { deleteUser } from "@/src/services/users";
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
      const ok = window.confirm("Eliminar usuario?");
      if (!ok) return;

      onDelete(userId);
    } else {
      Alert.alert("Eliminar usuario", "Seguro?", [
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
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="mb-4 text-2xl font-bold text-red-700">
          Admin - Usuarios
        </Text>

        <div className="mb-4 h-px bg-gray-300">
          {" "}
          <Text className="font-semibold">JEJEJE</Text>
        </div>

        {users.map((user) => (
          <View key={user.id} className="flex">
            <TouchableOpacity className="mb-2.5 rounded-lg bg-white p-3.5">
              <Text className="font-semibold">{user.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteUser(user.id)}>
              <Text className="font-bold text-red-500">Booorrar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {loading && <ActivityIndicator />}
      </ScrollView>
    </SafeAreaView>
  );
}
