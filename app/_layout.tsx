import { AppLoading } from "@/src/components/AppLoading";
import { useAuthStore } from "@/src/store/authStore";
import { useInitApp } from "@/src/hooks/useInitApp";
import { Slot } from "expo-router";
import "react-native-gesture-handler";
import "../global.css";

export default function RootLayout() {
  useInitApp();
  if (useAuthStore((s) => s.isLoading)) return <AppLoading />;
  return <Slot />;
}
