import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Buscar libros, videos...",
  onFilterPress,
}: SearchInputProps) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
      <LinearGradient
        colors={["#0F766E", "#14B8A6", "#34D399"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* Search input pill */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 100,
            paddingHorizontal: 16,
            paddingVertical: 11,
            gap: 10,
          }}
        >
          <Ionicons name="search" size={18} color="#0F766E" />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: "#1C1C1E", paddingVertical: 0 }}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {/* Filter button */}
        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.7}
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: "rgba(255,255,255,0.15)",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.25)",
          }}
        >
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
