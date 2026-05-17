import { BottomNav } from "@/src/components/BottomNavs";
import { TopBar } from "@/src/components/TopBar";
import { useInitApp } from "@/src/hooks/useInitApp";
import { usePrefsStore } from "@/src/store/prefsStore";
import { useAuthStore } from "@/src/store/authStore";

import { Slot, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import "../../global.css";

export default function Layout() {
  const router = useRouter();
  useInitApp();

  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const nativeLang = usePrefsStore((s) => s.nativeLanguage);
  const targetLang = usePrefsStore((s) => s.targetLanguage);
  const hasPrefs = nativeLang != null && targetLang != null;

  // Mientras carga auth, mostrar spinner
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Sin usuario → redirect a auth
  if (!user) {
    router.replace("/");
    return null;
  }

  // Sin prefs de idioma → redirect a language setup
  if (!hasPrefs) {
    router.replace("/language-setup");
    return null;
  }

  // Todo listo → mostrar app
  return (
    <View style={{ flex: 1 }}>
      <View style={{ zIndex: 2000, elevation: 2000 }}>
        <TopBar name={user.user_metadata?.name ?? "Usuario"} />
      </View>

      <View style={{ flex: 1, zIndex: 1, elevation: 1 }}>
        <Slot />
      </View>

      <BottomNav />
    </View>
  );
}
