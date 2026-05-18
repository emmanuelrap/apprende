import type { Theme } from "@/src/theme";
import { THEME_COLORS } from "@/src/theme";
import { useAuthStore } from "@/src/store/authStore";
import { useVocabularyStore } from "@/src/store/vocabularyStore";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

type Language = "es" | "en";

type Props = {
  content: string;
  language: Language;
  bookId: string;
  pageId: string;
  readonly?: boolean;
  activeParagraph: number | null;
  onParagraphPress: (index: number | null) => void;
  fontSize?: number;
  theme?: Theme;
};

type SaveItem = {
  type: "word" | "sentence";
  content: string;
  context: string;
};

export function PageContent({
  content,
  language,
  bookId,
  pageId,
  readonly = false,
  activeParagraph,
  onParagraphPress,
  fontSize = 16,
  theme = "light",
}: Props) {
  const user = useAuthStore((state) => state.user);
  const addItem = useVocabularyStore((state) => state.addItem);

  const [modal, setModal] = useState(false);
  const [saveItem, setSaveItem] = useState<SaveItem | null>(null);
  const [translation, setTranslation] = useState("");
  const [saving, setSaving] = useState(false);

  const paragraphs = content
    .split(".")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => p + ".");

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

  return (
    <>
      <View>
        {paragraphs.map((paragraph, pIndex) => {
          const words = paragraph.split(" ");
          const isActive = activeParagraph === pIndex;

          return (
            <TouchableOpacity
              key={pIndex}
              onPress={() => onParagraphPress(pIndex)}
              onLongPress={() => {
                if (readonly) return;
                openModal({
                  type: "sentence",
                  content: paragraph,
                  context: paragraph,
                });
              }}
              delayLongPress={400}
              activeOpacity={1}
              className="p-2 "
            >
              <Text style={{ lineHeight: fontSize + 12, fontSize, color: THEME_COLORS[theme].text }}>
                {words.map((word, wIndex) => (
                  <Text
                    key={wIndex}
                    onPress={() => onParagraphPress(pIndex)}
                    onLongPress={() => {
                      if (readonly) return;
                      openModal({
                        type: "word",
                        content: word.replace(/[^a-zA-ZáéíóúñüÁÉÍÓÚÑÜ']/g, ""),
                        context: paragraph,
                      });
                    }}
                    style={{
                      color: THEME_COLORS[theme].text,
                      backgroundColor: isActive ? THEME_COLORS[theme].highlight : "transparent",
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
                <Text
                  style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}
                >
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
