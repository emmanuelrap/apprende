import { colors, shadows } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  filterLoading?: boolean;
  debounceMs?: number;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Buscar libros, videos...",
  onFilterPress,
  filterLoading,
  debounceMs = 400,
}: SearchInputProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (text: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => onChangeText(text), debounceMs);
    },
    [onChangeText, debounceMs],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 4,
        paddingLeft: 16,
        paddingRight: 6,
        height: 52,
        gap: 10,
        ...shadows.card,
      }}
    >
      <Ionicons name="search" size={20} color={colors.textMuted} />
      <TextInput
        style={{ flex: 1, fontSize: 15, color: colors.text, paddingVertical: 0 }}
        defaultValue={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      {onFilterPress && (
        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.7}
          disabled={filterLoading}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: filterLoading ? colors.primary : colors.primaryBg,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {filterLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons name="options-outline" size={20} color={colors.primary} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
