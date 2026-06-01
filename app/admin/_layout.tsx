import { BottomNav } from "@/src/components/BottomNavs";
import { useAuthStore } from "@/src/store/authStore";
import { Redirect, Slot } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.email === "emmanuelzzz123@gmail.com";

  if (!isAdmin) return <Redirect href="/home" />;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <BottomNav />
    </View>
  );
}
