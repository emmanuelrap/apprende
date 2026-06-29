import { colors, THEME_COLORS } from "@/src/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "Français", value: "fr" },
];

const FONT_SIZES = [14, 16, 18, 20, 22, 24];

const LINE_SPACINGS = [6, 10, 14, 18, 22];

const SIDE_MARGINS = [8, 16, 24, 32];

const FONTS = [
  { label: "Default", value: undefined },
  { label: "Serif", value: "serif" },
  { label: "Mono", value: "monospace" },
];

type Theme = "light" | "sepia" | "dark";

const THEMES: { key: Theme; label: string; emoji: string; desc: string }[] = [
  { key: "light", label: "Claro", emoji: "☀️", desc: "Blanco" },
  { key: "sepia", label: "Sepia", emoji: "🟤", desc: "Cálido" },
  { key: "dark", label: "Oscuro", emoji: "🌙", desc: "Oscuro" },
];

const LANG_LABELS: Record<string, string> = {
  es: "ES", en: "EN", fr: "FR", pt: "PT",
};

type Props = {
  title: string;
  currentPage: number;
  totalPages: number;
  langTop: string;
  langBottom: string;
  onLangTopChange: (lang: string) => void;
  onLangBottomChange: (lang: string) => void;
  availableLangs: string[];
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  readerMode: "dual" | "interleaved" | "single";
  onReaderModeChange: (mode: "dual" | "interleaved" | "single") => void;
  boldEnabled: boolean;
  onBoldEnabledChange: (v: boolean) => void;
  lineSpacing: number;
  onLineSpacingChange: (v: number) => void;
  sideMargin: number;
  onSideMarginChange: (v: number) => void;
  fontFamily: string | undefined;
  onFontFamilyChange: (v: string | undefined) => void;
  textAlign: "left" | "center" | "right" | "justify";
  onTextAlignChange: (v: "left" | "center" | "right" | "justify") => void;
};

function LangDropdown({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (lang: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ alignItems: "center", gap: 2 }}>
      <Text style={{ fontSize: 9, color: colors.textMuted, fontWeight: "500" }}>
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 6,
          backgroundColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "600" }}>
          {LANGUAGES.find((l) => l.value === value)?.label ?? value}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setOpen(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              paddingVertical: 6,
              minWidth: 180,
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 20,
              overflow: "hidden",
            }}
          >
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.value}
                onPress={() => {
                  onChange(lang.value);
                  setOpen(false);
                }}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  backgroundColor:
                    value === lang.value ? colors.primaryBg : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: value === lang.value ? "700" : "400",
                    color: value === lang.value ? colors.primary : colors.text,
                    textAlign: "center",
                  }}
                >
                  {lang.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export function ReadingBar({
  title,
  currentPage,
  totalPages,
  langTop,
  langBottom,
  onLangTopChange,
  onLangBottomChange,
  availableLangs,
  fontSize,
  onFontSizeChange,
  theme,
  onThemeChange,
  readerMode,
  onReaderModeChange,
  boldEnabled,
  onBoldEnabledChange,
  lineSpacing,
  onLineSpacingChange,
  sideMargin,
  onSideMarginChange,
  fontFamily,
  onFontFamilyChange,
  textAlign,
  onTextAlignChange,
}: Props) {
  const router = useRouter();
  const [openSettings, setOpenSettings] = useState(false);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const progress =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <View>
      {/* Fila 1: título, settings, paginación */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.6}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.border,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: colors.text, lineHeight: 22, fontWeight: "300" }}>‹</Text>
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          style={{ flex: 1, fontWeight: "600", fontSize: 15, color: THEME_COLORS[theme].text }}
        >
          {title}
        </Text>

        {/* Language picker */}
        <View>
          <TouchableOpacity
            onPress={() => setLangPickerOpen(true)}
            activeOpacity={0.6}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: colors.primaryBg,
              marginRight: 4,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primaryDarkest }}>
              {LANG_LABELS[langTop] ?? langTop.toUpperCase()}
            </Text>
          </TouchableOpacity>

          <Modal visible={langPickerOpen} transparent animationType="fade">
            <Pressable
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }}
              onPress={() => setLangPickerOpen(false)}
            >
              <Pressable
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 14,
                  padding: 8,
                  minWidth: 140,
                  overflow: "hidden",
                }}
                onPress={() => {}}
              >
                {availableLangs.map((lang) => (
                  <Pressable
                    key={lang}
                    onPress={() => {
                      onLangTopChange(lang);
                      setLangPickerOpen(false);
                    }}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderRadius: 8,
                      backgroundColor: langTop === lang ? colors.primaryBg : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: langTop === lang ? "700" : "400",
                        color: langTop === lang ? colors.primary : colors.text,
                        textAlign: "center",
                      }}
                    >
                      {LANG_LABELS[lang] ?? lang.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </Pressable>
            </Pressable>
          </Modal>
        </View>

        {/* Reader mode toggle */}
        <TouchableOpacity
          onPress={() => {
            const next = { dual: "interleaved", interleaved: "single", single: "dual" } as const;
            onReaderModeChange(next[readerMode]);
          }}
          activeOpacity={0.6}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            backgroundColor: colors.border,
            marginRight: 6,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600" }}>
            {readerMode === "dual" ? "☗" : readerMode === "interleaved" ? "⇄" : "◉"}
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: colors.textMuted, marginRight: 4 }}>
          {currentPage} / {totalPages}
        </Text>

        <TouchableOpacity
          onPress={() => setOpenSettings(true)}
          activeOpacity={0.6}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.border,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 3, backgroundColor: colors.border }}>
        <View
          style={{
            height: 3,
            backgroundColor: colors.primary,
            width: `${progress}%`,
          }}
        />
      </View>

      <Modal visible={openSettings} transparent animationType="fade">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setOpenSettings(false)}
        >
          <Pressable
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 24,
              minWidth: 260,
              maxHeight: "90%",
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 20,
            }}
            onPress={() => {}}
          >
            <ScrollView style={{ gap: 20 }}>
              {/* Tema */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
                  Tema
                </Text>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
                  {THEMES.map((t) => (
                    <TouchableOpacity
                      key={t.key}
                      onPress={() => onThemeChange(t.key)}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: theme === t.key ? colors.primary : colors.borderAlt,
                        backgroundColor: theme === t.key ? colors.primaryBg : "#fff",
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>{t.emoji}</Text>
                      <Text style={{ fontSize: 12, fontWeight: "600", marginTop: 4 }}>{t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tamaño de letra */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
                  Tamaño de letra
                </Text>

                <View style={{ flexDirection: "row", gap: 8, justifyContent: "center", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => onFontSizeChange(Math.max(12, fontSize - 2))}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 8,
                      backgroundColor: colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>A−</Text>
                  </TouchableOpacity>

                  {FONT_SIZES.map((size) => (
                    <TouchableOpacity
                      key={size}
                      onPress={() => onFontSizeChange(size)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        backgroundColor: fontSize === size ? colors.primary : colors.border,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: fontSize === size ? "#fff" : colors.text,
                        }}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    onPress={() => onFontSizeChange(Math.min(28, fontSize + 2))}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 8,
                      backgroundColor: colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>A+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Negritas */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
                  Estilo de texto
                </Text>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
                  <TouchableOpacity
                    onPress={() => onBoldEnabledChange(false)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: !boldEnabled ? colors.primary : colors.borderAlt,
                      backgroundColor: !boldEnabled ? colors.primaryBg : "#fff",
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "400" }}>Normal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onBoldEnabledChange(true)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: boldEnabled ? colors.primary : colors.borderAlt,
                      backgroundColor: boldEnabled ? colors.primaryBg : "#fff",
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "700" }}>Negrita</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Interlineado */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
                  Interlineado
                </Text>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
                  {LINE_SPACINGS.map((sp) => (
                    <TouchableOpacity
                      key={sp}
                      onPress={() => onLineSpacingChange(sp)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        borderRadius: 8,
                        backgroundColor: lineSpacing === sp ? colors.primary : colors.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: lineSpacing === sp ? "#fff" : colors.text,
                        }}
                      >
                        {sp}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Margen lateral */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
                  Margen lateral
                </Text>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
                  {SIDE_MARGINS.map((m) => (
                    <TouchableOpacity
                      key={m}
                      onPress={() => onSideMarginChange(m)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        borderRadius: 8,
                        backgroundColor: sideMargin === m ? colors.primary : colors.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: sideMargin === m ? "#fff" : colors.text,
                        }}
                      >
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Alineación */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
                  Alineación
                </Text>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
                  {[
                    { key: "left", label: "Izq" },
                    { key: "center", label: "Centro" },
                    { key: "right", label: "Der" },
                    { key: "justify", label: "Just" },
                  ].map((opt) => (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => onTextAlignChange(opt.key as typeof textAlign)}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: textAlign === opt.key ? colors.primary : colors.borderAlt,
                        backgroundColor: textAlign === opt.key ? colors.primaryBg : "#fff",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: textAlign === opt.key ? colors.primaryDarkest : colors.text,
                        }}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Fuente */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
                  Fuente
                </Text>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
                  {FONTS.map((f) => (
                    <TouchableOpacity
                      key={f.label}
                      onPress={() => onFontFamilyChange(f.value)}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: fontFamily === f.value ? colors.primary : colors.borderAlt,
                        backgroundColor: fontFamily === f.value ? colors.primaryBg : "#fff",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          fontFamily: f.value ?? undefined,
                        }}
                      >
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Idioma inferior (solo visible en dual/interleaved) */}
              {readerMode !== "single" && (
                <View>
                  <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
                    Segundo idioma
                  </Text>
                  <View style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}>
                    <LangDropdown value={langBottom} onChange={onLangBottomChange} label="Inf" />
                  </View>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
