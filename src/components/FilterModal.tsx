import { colors } from "@/src/theme";
import { useCallback, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Category = { id: string; name: string };

export function FilterModal({
  visible,
  categories,
  selected,
  onApply,
  onClose,
}: {
  visible: boolean;
  categories: Category[];
  selected: string[];
  onApply: (ids: string[]) => void;
  onClose: () => void;
}) {
  const [localSelected, setLocalSelected] = useState<string[]>(selected);

  const handleToggle = useCallback((id: string) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }, []);

  const handleApply = useCallback(() => {
    onApply(localSelected);
    onClose();
  }, [localSelected, onApply, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade" onShow={() => setLocalSelected(selected)}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 24,
            width: "82%",
            maxHeight: "70%",
          }}
          onPress={() => {}}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              textAlign: "center",
              marginBottom: 20,
              color: colors.text,
            }}
          >
            Filtrar por categoría
          </Text>

          {categories.length === 0 && (
            <Text style={{ color: colors.textMuted, textAlign: "center", paddingVertical: 20 }}>
              No hay categorías disponibles
            </Text>
          )}

          <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
            {categories.map((cat) => {
              const checked = localSelected.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => handleToggle(cat.id)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    marginBottom: 4,
                    backgroundColor: checked ? colors.primaryBg : "transparent",
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: checked ? colors.primary : colors.textVeryMuted,
                      backgroundColor: checked ? colors.primary : "transparent",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 14,
                    }}
                  >
                    {checked && (
                      <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
                        ✓
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      color: colors.text,
                      fontWeight: checked ? "600" : "400",
                    }}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            onPress={handleApply}
            activeOpacity={0.85}
            style={{
              marginTop: 20,
              backgroundColor: colors.primary,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
              {localSelected.length > 0
                ? `Aplicar (${localSelected.length})`
                : "Mostrar todo"}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
