import { BottomNav } from "@/src/components/BottomNavs";
import { Slot } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>

      <BottomNav />
    </View>
  );
}
