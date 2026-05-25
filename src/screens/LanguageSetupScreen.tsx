import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePrefsStore } from "../store/prefsStore";

type Lang = { code: string; label: string; flag: string; enabled: boolean };

const LANGUAGES: Lang[] = [
  { code: "es", label: "Español", flag: "🇲🇽", enabled: true },
  { code: "en", label: "English", flag: "🇺🇸", enabled: false },
  { code: "fr", label: "Français", flag: "🇫🇷", enabled: false },
  { code: "de", label: "Deutsch", flag: "🇩🇪", enabled: false },
  { code: "pt", label: "Português", flag: "🇧🇷", enabled: false },
  { code: "it", label: "Italiano", flag: "🇮🇹", enabled: false },
  { code: "ja", label: "日本語", flag: "🇯🇵", enabled: false },
  { code: "zh", label: "中文", flag: "🇨🇳", enabled: false },
];

export default function LanguageSetupScreen() {
  const router = useRouter();
  const setNativeLanguage = usePrefsStore((s) => s.setNativeLanguage);

  const handleSelect = (code: string) => {
    setNativeLanguage(code);
    router.replace("/home");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>¿Qué idioma hablas?</Text>
          <Text style={styles.subtitle}>
            Usaremos esto para mostrarte traducciones mientras lees.
          </Text>
        </View>

        <View style={styles.grid}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langCard, !lang.enabled && styles.langCardDisabled]}
              onPress={() => lang.enabled && handleSelect(lang.code)}
              activeOpacity={lang.enabled ? 0.75 : 1}
              disabled={!lang.enabled}
            >
              <View style={{ opacity: lang.enabled ? 1 : 0.35 }}>
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={styles.langLabel}>{lang.label}</Text>
              </View>
              {!lang.enabled && (
                <View style={styles.comingBadge}>
                  <Text style={styles.comingText}>Próximamente</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6F8" },
  scroll: { padding: 24, paddingBottom: 40 },

  header: { marginBottom: 28 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: { fontSize: 15, color: "#6B7280", lineHeight: 22 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  langCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    padding: 16,
    alignItems: "center",
    gap: 6,
    position: "relative",
  },
  flag: { fontSize: 32 },
  langLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  langCardDisabled: {
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  comingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  comingText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
  },
});
