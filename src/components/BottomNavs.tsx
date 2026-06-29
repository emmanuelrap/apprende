import { colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const TABS = [
  { label: "Libros", icon: "book-outline", activeIcon: "book", route: "/home" },
  { label: "Videos", icon: "videocam-outline", activeIcon: "videocam", route: "/videos" },
  { label: "Vocabulario", icon: "library-outline", activeIcon: "library", route: "/study" },
  { label: "Perfil", icon: "person-outline", activeIcon: "person", route: "/profile" },
] as const;

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View
      style={{
        flexDirection: "row",
        borderTopWidth: 1,
        borderColor: colors.borderAlt,
        backgroundColor: colors.white,
      }}
    >
      {TABS.map((tab) => {
        const isActive = pathname === tab.route;
        return (
          <NavItem
            key={tab.route}
            label={tab.label}
            icon={isActive ? tab.activeIcon : tab.icon}
            isActive={isActive}
            onPress={() => router.replace(tab.route)}
          />
        );
      })}
    </View>
  );
}

function NavItem({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: any;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, alignItems: "center", paddingVertical: 10, paddingTop: 8 }}
    >
      <Ionicons
        name={icon}
        size={22}
        color={isActive ? colors.primary : colors.textSecondary}
      />
      <Text
        style={{
          fontSize: 11,
          fontWeight: isActive ? "700" : "500",
          color: isActive ? colors.primary : colors.textMuted,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
