import { BottomNav } from "@/src/components/BottomNavs";
import { TopBar } from "@/src/components/TopBar";
import { useLanguage } from "@/src/hooks/useLanguaje";

import { supabase } from "@/src/services/supabase";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../../global.css";

export default function Layout() {
  const router = useRouter();
  const { prefs, loading: langLoading } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const init = async () => {
      // 1. Verifica auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      // 2. Carga perfil
      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      setName(data?.name ?? "");
      setLoading(false);
    };

    init();
  }, [router]);

  // 3. Cuando termine de cargar auth Y idioma, revisa si falta configurar idioma
  useEffect(() => {
    if (loading || langLoading) return;

    if (!prefs) {
      router.replace("/language-setup");
    }
  }, [loading, langLoading, prefs, router]);

  if (loading || langLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // No renderiza nada si falta el idioma (evita flash antes del redirect)
  if (!prefs) return null;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ zIndex: 2000, elevation: 2000 }}>
        <TopBar name={name} />
      </View>

      <View style={{ flex: 1, zIndex: 1, elevation: 1 }}>
        <Slot />
      </View>

      <BottomNav />
    </View>
  );
}
