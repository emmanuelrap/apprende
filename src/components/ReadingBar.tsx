import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
];

type Props = {
  title: string;
  currentPage: number;
  totalPages: number;
  langTop: string;
  langBottom: string;
  onLangTopChange: (lang: string) => void;
  onLangBottomChange: (lang: string) => void;
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
      <Text style={{ fontSize: 9, color: "#94A3B8", fontWeight: "500" }}>{label}</Text>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 6,
          backgroundColor: "#E2E8F0",
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "600" }}>
          {LANGUAGES.find((l) => l.value === value)?.label ?? value}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }}
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
                    value === lang.value ? "#E8F5F3" : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: value === lang.value ? "700" : "400",
                    color: value === lang.value ? "#1A7A6E" : "#1C1C1E",
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
}: Props) {
  const router = useRouter();
  const progress =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 8,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          style={{ flex: 1, fontWeight: "600", fontSize: 15 }}
        >
          {title}
        </Text>

        <LangDropdown value={langTop} onChange={onLangTopChange} label="Arriba" />
        <LangDropdown value={langBottom} onChange={onLangBottomChange} label="Abajo" />

        <Text style={{ fontSize: 12, color: "#94A3B8" }}>
          {currentPage} / {totalPages}
        </Text>
      </View>

      <View style={{ height: 3, backgroundColor: "#E2E8F0" }}>
        <View
          style={{
            height: 3,
            backgroundColor: "#6366F1",
            width: `${progress}%`,
          }}
        />
      </View>
    </View>
  );
}
