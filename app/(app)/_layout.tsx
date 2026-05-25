import { AppLoading } from "@/src/components/AppLoading";
import { BottomNav } from "@/src/components/BottomNavs";
import { TopBar } from "@/src/components/TopBar";
import { useInitApp } from "@/src/hooks/useInitApp";
import { useAuthStore } from "@/src/store/authStore";
import { usePrefsStore } from "@/src/store/prefsStore";

import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

export default function Layout() {
  const router = useRouter();
  useInitApp();

  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const nativeLang = usePrefsStore((s) => s.nativeLanguage);
  const hasPrefs = nativeLang != null;

  useEffect(() => {
    if (isLoading || !user) return;
    if (!hasPrefs) {
      router.replace("/language-setup");
    }
  }, [user, hasPrefs, isLoading]);

  if (isLoading) return <AppLoading />;

  if (!user) return null;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={{ zIndex: 2000, elevation: 2000 }}>
        <TopBar name={user.user_metadata?.name ?? "Usuario"} />
      </View>

      <View style={{ flex: 1, zIndex: 1, elevation: 1 }}>
        <Slot />
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}
