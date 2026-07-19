import { colors } from "@/src/theme";
import type { Theme } from "@/src/theme";
import { THEME_COLORS } from "@/src/theme";
import { useAuthStore } from "@/src/store/authStore";
import { useVocabularyStore } from "@/src/store/vocabularyStore";
import { usePrefsStore } from "@/src/store/prefsStore";
import { useState } from "react";
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { translateText } from "@/src/services/translate";
import type { SentenceInfo } from "@/src/services/sentences";

type Language = "es" | "en" | "fr";

type Props = {
  content: string;
  language: Language;
  bookId: string;
  pageId: string;
  readonly?: boolean;
  activeParagraph: number | null;
  onParagraphPress: (index: number | null) => void;
  onSentencePress?: (sentenceGlobalIndex: number, paragraphIndex?: number) => void;
  fontSize?: number;
  theme?: Theme;
  boldEnabled?: boolean;
  lineSpacing?: number;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  sentences?: SentenceInfo[];
  activeSentenceIndex?: number | null;
};

type SaveItem = {
  type: "word" | "sentence";
  content: string;
  context: string;
};

function HighlightedText({
  paragraph,
  activeSentence,
  theme,
  fontSize,
  lineSpacing = 0,
  boldEnabled,
  fontFamily,
  textAlign,
  readonly,
  paragraphIndex,
  sentences,
  onSentencePress,
  onWordLongPress,
}: {
  paragraph: string;
  activeSentence: string | null;
  theme: Theme;
  fontSize: number;
  lineSpacing?: number;
  boldEnabled?: boolean;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  readonly?: boolean;
  paragraphIndex?: number;
  sentences?: SentenceInfo[] | null;
  onSentencePress?: ((sentenceGlobalIndex: number, paragraphIndex?: number) => void) | null;
  onWordLongPress: (word: string) => void;
}) {
  const words = paragraph.split(" ");
  const highlightColor = THEME_COLORS[theme].highlight;

  return (
    <Text style={{ lineHeight: fontSize + lineSpacing, fontSize, color: THEME_COLORS[theme].text, fontWeight: boldEnabled ? "bold" : "normal", fontFamily: fontFamily ?? undefined, textAlign }}>
      {words.map((word, wIndex) => {
        const inActiveSentence = activeSentence && paragraph.includes(activeSentence);
        let isSentenceHighlight = false;
        if (inActiveSentence) {
          const startIdx = paragraph.indexOf(activeSentence);
          const endIdx = startIdx + activeSentence.length;
          const wordStart = words.slice(0, wIndex).join(" ").length + (wIndex > 0 ? 1 : 0);
          const wordEnd = wordStart + word.length;
          isSentenceHighlight = wordStart >= startIdx && wordEnd <= endIdx;
        }

        return (
          <Text
            key={wIndex}
            onPress={() => {
              if (readonly || !onSentencePress || sentences == null || paragraphIndex == null) return;
              const wordStart = words.slice(0, wIndex).join(" ").length + (wIndex > 0 ? 1 : 0);
              const wordEnd = wordStart + word.length;
              const found = sentences.find(
                (s) =>
                  s.paragraphIndex === paragraphIndex &&
                  paragraph.indexOf(s.text) >= 0 &&
                  wordStart >= paragraph.indexOf(s.text) &&
                  wordEnd <= paragraph.indexOf(s.text) + s.text.length,
              );
              if (found) {
                onSentencePress(found.globalIndex, paragraphIndex);
              }
            }}
            onLongPress={() => {
              if (readonly) return;
              onWordLongPress(word.replace(/[^a-zA-ZáéíóúñüÁÉÍÓÚÑÜ']/g, ""));
            }}
            style={{
              color: THEME_COLORS[theme].text,
              backgroundColor: isSentenceHighlight
                ? highlightColor
                : "transparent",
            }}
          >
            {word}
            {wIndex < words.length - 1 ? " " : ""}
          </Text>
        );
      })}
    </Text>
  );
}

export function PageContent({
  content,
  language,
  bookId,
  pageId,
  readonly = false,
  activeParagraph,
  onParagraphPress,
  onSentencePress,
  fontSize = 16,
  theme = "light",
  boldEnabled,
  lineSpacing,
  fontFamily,
  textAlign = "justify",
  sentences,
  activeSentenceIndex,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const addItem = useVocabularyStore((state) => state.addItem);
  const nativeLang = usePrefsStore((s) => s.nativeLanguage);

  const [modal, setModal] = useState(false);
  const [saveItem, setSaveItem] = useState<SaveItem | null>(null);
  const [translation, setTranslation] = useState("");
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);

  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const openModal = (item: SaveItem) => {
    setSaveItem(item);
    setTranslation("");
    setModal(true);
    if (item.type === "word" && nativeLang && nativeLang !== language) {
      setTranslating(true);
      translateText(item.content, language, nativeLang).then((t) => {
        setTranslation(t);
        setTranslating(false);
      });
    }
  };

  const handleSave = async () => {
    if (!user || !saveItem) return;
    setSaving(true);
    await addItem(user.id, {
      type: saveItem.type,
      content: saveItem.content,
      context: saveItem.context,
      translation: translation || null,
      book_id: bookId,
      page_id: pageId,
    });
    setSaving(false);
    setModal(false);
  };

  const activeSentence =
    sentences && activeSentenceIndex != null
      ? sentences.find((s) => s.globalIndex === activeSentenceIndex) ?? null
      : null;

  return (
    <>
      <View>
        {paragraphs.map((paragraph, pIndex) => {
          const isActive = activeParagraph === pIndex;
          const isSentenceInThisParagraph =
            activeSentence?.paragraphIndex === pIndex;
          const sentenceText = isSentenceInThisParagraph
            ? activeSentence!.text
            : null;

          return (
            <TouchableOpacity
              key={pIndex}
              onPress={() => onParagraphPress(pIndex)}
              activeOpacity={1}
              style={{ borderRadius: 4 }}
            >
              <View
                style={{
                  backgroundColor: isActive && !sentenceText
                    ? THEME_COLORS[theme].highlight
                    : "transparent",
                  borderRadius: 4,
                }}
              >
              <HighlightedText
                paragraph={paragraph}
                activeSentence={sentenceText}
                theme={theme}
                fontSize={fontSize}
                lineSpacing={lineSpacing}
                boldEnabled={boldEnabled}
                fontFamily={fontFamily}
                textAlign={textAlign}
                readonly={readonly}
                paragraphIndex={pIndex}
                sentences={sentences ?? null}
                onSentencePress={onSentencePress ?? null}
                onWordLongPress={(word) =>
                  openModal({
                    type: "word",
                    content: word,
                    context: paragraph,
                  })
                }
              />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* modal guardar */}
      <Modal visible={modal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 24,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>
              {saveItem?.type === "word" ? "Palabra" : "Oración"}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.text,
                marginBottom: 16,
              }}
            >
              {saveItem?.content}
            </Text>

              {saveItem?.type === "word" && (
                <>
                  <Text
                    style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}
                  >
                    Contexto
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.textMuted,
                      marginBottom: 16,
                      fontStyle: "italic",
                      lineHeight: 18,
                    }}
                  >
                    {(() => {
                      const word = saveItem.content;
                      const ctx = saveItem.context;
                      const idx = ctx.toLowerCase().indexOf(word.toLowerCase());
                      if (idx === -1) return ctx;
                      return (
                        <>
                          {ctx.slice(0, idx)}
                          <Text style={{ fontWeight: "800", color: colors.text }}>
                            {ctx.slice(idx, idx + word.length)}
                          </Text>
                          {ctx.slice(idx + word.length)}
                        </>
                      );
                    })()}
                  </Text>
                </>
              )}

            <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 6 }}>
              Traducción
            </Text>
            <View style={{ position: "relative" }}>
              <TextInput
                placeholder={translating ? "Traduciendo..." : "Escribe la traducción..."}
                value={translation}
                onChangeText={setTranslation}
                editable={!translating}
                style={{
                  borderWidth: 1,
                  borderColor: translating ? colors.primary : colors.border,
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 16,
                  fontSize: 15,
                  paddingRight: translating ? 40 : 12,
                  color: translating ? colors.textMuted : colors.text,
                }}
              />
              {translating && (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ position: "absolute", right: 12, top: 14 }}
                />
              )}
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.textSecondary }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {saving ? "Guardando..." : "💾 Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
