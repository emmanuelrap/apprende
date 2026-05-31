import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Category = { id: string; name: string };

export function FilterModal({
  visible,
  categories,
  selected,
  onToggle,
  onClose,
}: {
  visible: boolean;
  categories: Category[];
  selected: string[];
  onToggle: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
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
              color: "#0F172A",
            }}
          >
            Filtrar por categoría
          </Text>

          {categories.length === 0 && (
            <Text style={{ color: "#94A3B8", textAlign: "center", paddingVertical: 20 }}>
              No hay categorías disponibles
            </Text>
          )}

          <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
            {categories.map((cat) => {
              const checked = selected.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => onToggle(cat.id)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    marginBottom: 4,
                    backgroundColor: checked ? "#E8F5F3" : "transparent",
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: checked ? "#078F83" : "#CBD5E1",
                      backgroundColor: checked ? "#078F83" : "transparent",
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
                      color: "#1C1C1E",
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
            onPress={onClose}
            activeOpacity={0.85}
            style={{
              marginTop: 20,
              backgroundColor: "#078F83",
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
              {selected.length > 0
                ? `Aplicar (${selected.length})`
                : "Mostrar todo"}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
