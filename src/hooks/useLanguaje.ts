import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export interface LanguagePrefs {
  nativeLanguage: string; // idioma que habla el usuario, ej: "es"
  targetLanguage: string; // idioma que quiere leer, ej: "en"
}

const STORAGE_KEY = "user_language_prefs";

export function useLanguage() {
  const [prefs, setPrefs] = useState<LanguagePrefs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrefs();
  }, []);

  async function loadPrefs() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPrefs(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error leyendo idiomas:", e);
    } finally {
      setLoading(false);
    }
  }

  async function savePrefs(newPrefs: LanguagePrefs) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
      setPrefs(newPrefs);
    } catch (e) {
      console.error("Error guardando idiomas:", e);
    }
  }

  async function clearPrefs() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setPrefs(null);
  }

  return { prefs, loading, savePrefs, clearPrefs };
}
