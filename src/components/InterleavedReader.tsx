import type { Theme } from "@/src/theme";
import { THEME_COLORS } from "@/src/theme";
import { useAuthStore } from "@/src/store/authStore";
import { useVocabularyStore } from "@/src/store/vocabularyStore";
import { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type Language = "es" | "en";

type Props = {
  contentTop: string;
  contentBottom: string;
  langTop: Language;
  langBottom: Language;
  bookId: string;
  pageId: string;
  activeParagraph: number | null;
  onParagraphPress: (index: number | null) => void;
  fontSize: number;
  theme: Theme;
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
  fontSize,
  theme,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const addItem = useVocabularyStore((state) => state.addItem);
  const colors = THEME_COLORS[theme];

  const [modal, setModal] = useState(false);
  const [saveItem, setSaveItem] = useState<SaveItem | null>(null);
  const [translation, setTranslation] = useState("");
  const [saving, setSaving] = useState(false);

  const topParagraphs = contentTop
    .split(".")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => p + ".");

  const bottomParagraphs = contentBottom
    .split(".")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => p + ".");

  const mixed: { text: string; lang: Language }[] = [];
  const maxLen = Math.max(topParagraphs.length, bottomParagraphs.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < topParagraphs.length) mixed.push({ text: topParagraphs[i], lang: langTop });
    if (i < bottomParagraphs.length) mixed.push({ text: bottomParagraphs[i], lang: langBottom });
  }

  const openModal = (item: SaveItem) => {
    setSaveItem(item);
    setTranslation("");
    setModal(true);
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
      <ScrollView style={{ flex: 1, padding: 16, backgroundColor: colors.bg }}>
        {mixed.map((item, pIndex) => {
          const words = item.text.split(" ");
          const isActive = activeParagraph === pIndex;

          return (
            <TouchableOpacity
              key={pIndex}
              onPress={() => onParagraphPress(pIndex)}
              onLongPress={() => {
                openModal({
                  type: "sentence",
                  content: item.text,
                  context: item.text,
                });
              }}
              delayLongPress={400}
              activeOpacity={1}
              className="p-2"
            >
              <Text
                style={{
                  lineHeight: fontSize + 12,
                  fontSize,
                  color: colors.text,
                }}
              >
                {words.map((word, wIndex) => (
                  <Text
                    key={wIndex}
                    onPress={() => onParagraphPress(pIndex)}
                    onLongPress={() => {
                      openModal({
                        type: "word",
                        content: cleanWord(word),
                        context: item.text,
                      });
                    }}
                    style={{
                      color: colors.text,
                      backgroundColor: isActive ? colors.highlight : "transparent",
                    }}
                  >
                    {word}
                    {wIndex < words.length - 1 ? " " : ""}
                  </Text>
                ))}
              </Text>
            </TouchableOpacity>
          );
        })}
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
            <Text style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>
              {saveItem?.type === "word" ? "Palabra" : "Oración"}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1E293B",
                marginBottom: 16,
              }}
            >
              {saveItem?.content}
            </Text>

            {saveItem?.type === "word" && (
              <>
                <Text style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>
                  Contexto
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#94A3B8",
                    marginBottom: 16,
                    fontStyle: "italic",
                  }}
                >
                  {saveItem.context}
                </Text>
              </>
            )}

            <Text style={{ fontSize: 13, color: "#64748B", marginBottom: 6 }}>
              Traducción (opcional)
            </Text>
            <TextInput
              placeholder="Escribe la traducción..."
              value={translation}
              onChangeText={setTranslation}
              style={{
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 10,
                padding: 12,
                marginBottom: 16,
                fontSize: 15,
              }}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#64748B" }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: "#6366F1",
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
