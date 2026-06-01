import { useAuthStore } from "@/src/store/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const user = useAuthStore((s) => s.user);

  if (user) return <Redirect href="/(app)/home" />;
  return <Redirect href="/(auth)" />;
}
