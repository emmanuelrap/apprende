import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Platform } from "react-native";
import { createClient, processLock } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabaseFetch: typeof fetch = async (input, init) => {
  const getUrl = () => {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.toString();
    return input.url;
  };

  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      console.error("[Supabase HTTP Error]", {
        status: response.status,
        statusText: response.statusText,
        url: getUrl(),
      });
    }

    return response;
  } catch (error) {
    console.error("[Supabase Network Error]", { url: getUrl(), error });
    throw error;
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: supabaseFetch,
  },
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
