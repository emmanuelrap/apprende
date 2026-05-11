import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../hooks/useLanguaje";

//TODO Agregar a la BD una tabla de idiomas con su código, nombre y emoji de bandera. Cargar desde ahí en vez de hardcodear el array acá.
const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇲🇽" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

type Step = "native" | "target";

export default function LanguageSetupScreen() {
  const router = useRouter();
  const { savePrefs } = useLanguage();
  const [step, setStep] = useState<Step>("native");
  const [nativeLang, setNativeLang] = useState<string | null>(null);

  async function handleTargetSelect(code: string) {
    if (!nativeLang) return;

    await savePrefs({ nativeLanguage: nativeLang, targetLanguage: code });
    router.replace("/home");
  }

  const isNativeStep = step === "native";
  const availableForTarget = LANGUAGES.filter((l) => l.code !== nativeLang);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, !isNativeStep && styles.dotActive]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            {isNativeStep ? "Paso 1 de 2" : "Paso 2 de 2"}
          </Text>
          <Text style={styles.title}>
            {isNativeStep ? "¿Qué idioma hablas?" : "¿Qué idioma quieres leer?"}
          </Text>
          <Text style={styles.subtitle}>
            {isNativeStep
              ? "Usaremos esto para mostrarte traducciones mientras lees."
              : "Te recomendaremos libros en este idioma para practicar."}
          </Text>
        </View>

        {/* Language grid */}
        <View style={styles.grid}>
          {(isNativeStep ? LANGUAGES : availableForTarget).map((lang) => {
            const isSelected = isNativeStep ? nativeLang === lang.code : false;

            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langCard, isSelected && styles.langCardSelected]}
                onPress={async () => {
                  if (isNativeStep) {
                    setNativeLang(lang.code);
                    setTimeout(() => setStep("target"), 180);
                  } else {
                    await handleTargetSelect(lang.code);
                  }
                }}
                activeOpacity={0.75}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.langLabel,
                    isSelected && styles.langLabelSelected,
                  ]}
                >
                  {lang.label}
                </Text>
                {isSelected && <View style={styles.checkDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Back button on step 2 */}
        {!isNativeStep && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setStep("native")}
          >
            <Text style={styles.backText}>← Cambiar idioma nativo</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6F8" },
  scroll: { padding: 24, paddingBottom: 40 },

  dots: { flexDirection: "row", gap: 6, marginBottom: 32 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  dotActive: { backgroundColor: "#1A7A6E", width: 24 },

  header: { marginBottom: 28 },
  eyebrow: {
    fontSize: 12,
    color: "#1A7A6E",
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
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
  langCardSelected: {
    borderColor: "#1A7A6E",
    backgroundColor: "#E8F5F3",
  },
  flag: { fontSize: 32 },
  langLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  langLabelSelected: { color: "#1A7A6E" },
  checkDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1A7A6E",
  },

  backBtn: { marginTop: 24, alignItems: "center" },
  backText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
});
