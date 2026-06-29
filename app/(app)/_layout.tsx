import { BottomNav } from "@/src/components/BottomNavs";
import { useAuthStore } from "@/src/store/authStore";
import { usePrefsStore } from "@/src/store/prefsStore";

import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const nativeLang = usePrefsStore((s) => s.nativeLanguage);
  const hasPrefs = nativeLang != null;

  useEffect(() => {
    if (!user) return;
    if (!hasPrefs) {
      router.replace("/language-setup");
    }
  }, [user, hasPrefs]);

  if (!user) return null;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, zIndex: 1, elevation: 1 }}>
        <Slot />
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}
