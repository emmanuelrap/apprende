import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export function BottomNav() {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#FFFFFF",
      }}
    >
      <NavItem
        label="Libros"
        icon="book-outline"
        onPress={() => router.replace("/home")}
      />
      <NavItem
        label="Videos"
        icon="play-circle-outline"
        onPress={() => router.replace("/videos")}
      />
      <NavItem
        label="Perfil"
        icon="person-outline"
        onPress={() => router.replace("/profile")}
      />
    </View>
  );
}

function NavItem({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, alignItems: "center", paddingVertical: 10 }}
    >
      <Ionicons name={icon} size={22} color="#64748B" />
      <Text style={{ fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );
}
