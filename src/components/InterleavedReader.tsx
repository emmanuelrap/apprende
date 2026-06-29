import { colors } from "@/src/theme";
import type { Theme } from "@/src/theme";
import { THEME_COLORS } from "@/src/theme";
import { useAuthStore } from "@/src/store/authStore";
import { useVocabularyStore } from "@/src/store/vocabularyStore";
import { usePrefsStore } from "@/src/store/prefsStore";
import { useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { translateText } from "@/src/services/translate";
import type { SentenceInfo } from "@/src/services/sentences";

type Language = "es" | "en" | "fr";

type Props = {
  contentTop: string;
  contentBottom: string;
  langTop: Language;
  langBottom: Language;
  bookId: string;
  pageId: string;
  activeParagraph: number | null;
  onParagraphPress: (index: number | null) => void;
  onSentencePress?: (sentenceGlobalIndex: number) => void;
  fontSize: number;
  theme: Theme;
  boldEnabled: boolean;
  lineSpacing: number;
  sideMargin: number;
  fontFamily: string | undefined;
  textAlign: "left" | "center" | "right" | "justify";
  sentences?: SentenceInfo[];
  activeSentenceIndex?: number | null;
};

type SaveItem = {
  type: "word" | "sentence";
  content: string;
  context: string;
};

export function InterleavedReader({
  contentTop,
  contentBottom,
  langTop,
  langBottom,
  bookId,
  pageId,
  activeParagraph,
  onParagraphPress,
  onSentencePress,
  fontSize,
  theme,
  boldEnabled,
  lineSpacing,
  sideMargin,
  fontFamily,
  textAlign,
  sentences,
  activeSentenceIndex,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const addItem = useVocabularyStore((state) => state.addItem);
  const nativeLang = usePrefsStore((s) => s.nativeLanguage);
  const readerColors = THEME_COLORS[theme];

  const [modal, setModal] = useState(false);
  const [saveItem, setSaveItem] = useState<SaveItem | null>(null);
  const [translation, setTranslation] = useState("");
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);

  const topParagraphs = contentTop
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const bottomParagraphs = contentBottom
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const mixed: { text: string; lang: Language }[] = [];
  const maxLen = Math.max(topParagraphs.length, bottomParagraphs.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < topParagraphs.length) mixed.push({ text: topParagraphs[i], lang: langTop });
    if (i < bottomParagraphs.length) mixed.push({ text: bottomParagraphs[i], lang: langBottom });
  }

  const activeSentence =
    sentences && activeSentenceIndex != null
      ? sentences.find((s) => s.globalIndex === activeSentenceIndex) ?? null
      : null;

  const openModal = (item: SaveItem, wordLang?: Language) => {
    setSaveItem(item);
    setTranslation("");
    setModal(true);
    if (item.type === "word" && nativeLang && wordLang && wordLang !== nativeLang) {
      setTranslating(true);
      translateText(item.content, wordLang, nativeLang).then((t) => {
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

  const cleanWord = (w: string) =>
    w.replace(/[^a-zA-ZáéíóúñüÁÉÍÓÚÑÜ']/g, "");

  return (
    <>
      <ScrollView style={{ flex: 1, paddingHorizontal: sideMargin, paddingVertical: 16, backgroundColor: readerColors.bg }}>
        {(() => {
          let topIdx = 0;
          let bottomIdx = 0;
          return mixed.map((item, pIndex) => {
            const isTop = item.lang === langTop;
            const paraTopIdx = isTop ? topIdx++ : bottomIdx++;
            const words = item.text.split(" ");
            const isActive = activeParagraph === pIndex;

            const isSentenceInThisParagraph =
              isTop &&
              activeSentence &&
              activeSentence.paragraphIndex === paraTopIdx;
            const sentenceText = isSentenceInThisParagraph
              ? activeSentence!.text
              : null;

            return (
              <TouchableOpacity
                key={pIndex}
                onPress={() => onParagraphPress(pIndex)}
                activeOpacity={1}
                style={{
                  backgroundColor:
                    isActive && !sentenceText
                      ? readerColors.highlight
                      : "transparent",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    lineHeight: fontSize + lineSpacing,
                    fontSize,
                    color: readerColors.text,
                    fontStyle: item.lang === langBottom ? "italic" : "normal",
                    fontWeight: boldEnabled ? "bold" : "normal",
                    fontFamily: fontFamily ?? undefined,
                    textAlign,
                  }}
                >
                  {words.map((word, wIndex) => {
                    let isSentenceHighlight = false;
                    if (sentenceText) {
                      const startIdx = item.text.indexOf(sentenceText);
                      const endIdx = startIdx + sentenceText.length;
                      const wordStart = words.slice(0, wIndex).join(" ").length + (wIndex > 0 ? 1 : 0);
                      const wordEnd = wordStart + word.length;
                      isSentenceHighlight = wordStart >= startIdx && wordEnd <= endIdx;
                    }

                    return (
                      <Text
                        key={wIndex}
                        onPress={() => {
                          if (!isTop || !onSentencePress || sentences == null) return;
                          const wordStart = words.slice(0, wIndex).join(" ").length + (wIndex > 0 ? 1 : 0);
                          const wordEnd = wordStart + word.length;
                          const found = sentences.find(
                            (s) =>
                              s.paragraphIndex === paraTopIdx &&
                              item.text.indexOf(s.text) >= 0 &&
                              wordStart >= item.text.indexOf(s.text) &&
                              wordEnd <= item.text.indexOf(s.text) + s.text.length,
                          );
                          if (found) {
                            onSentencePress(found.globalIndex);
                          }
                        }}
                        onLongPress={() => {
                          openModal({
                            type: "word",
                            content: cleanWord(word),
                            context: item.text,
                          }, item.lang);
                        }}
                        style={{
                          color: readerColors.text,
                          backgroundColor: isSentenceHighlight
                            ? readerColors.highlight
                            : "transparent",
                        }}
                      >
                        {word}
                        {wIndex < words.length - 1 ? " " : ""}
                      </Text>
                    );
                  })}
                </Text>
              </TouchableOpacity>
            );
          });
        })()}
      </ScrollView>

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
                color: readerColors.text,
                marginBottom: 16,
              }}
            >
              {saveItem?.content}
            </Text>

              {saveItem?.type === "word" && (
                <>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>
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
                          <Text style={{ fontWeight: "800", color: readerColors.text }}>
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
