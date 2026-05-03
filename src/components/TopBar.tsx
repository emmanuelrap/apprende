import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export function TopBar({ name }: { name: string }) {
  const router = useRouter();

  return (
    <View
      style={{
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

      <TouchableOpacity onPress={() => router.push("/profile")}>
        <Ionicons name="person-circle-outline" size={28} />
      </TouchableOpacity>
    </View>
  );
}
