import { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Buscar por título o categoría...",
  onFilterPress,
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E5E7EB", "#1A7A6E"],
  });

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.inputWrap, { borderColor }]}>
        {/* Search icon */}
        <View style={styles.searchIconWrap}>
          <View style={styles.searchCircle} />
          <View style={styles.searchHandle} />
        </View>

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </Animated.View>

      {/* Filter button */}
      <TouchableOpacity
        onPress={onFilterPress}
        style={[styles.filterBtn, focused && styles.filterBtnActive]}
        activeOpacity={0.75}
      >
        <View style={styles.filterLines}>
          <View
            style={[styles.filterLine, styles.fl1, focused && styles.flActive]}
          />
          <View
            style={[styles.filterLine, styles.fl2, focused && styles.flActive]}
          />
          <View
            style={[styles.filterLine, styles.fl3, focused && styles.flActive]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  searchIconWrap: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  searchCircle: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: "#9CA3AF",
    position: "absolute",
    top: 0,
    left: 0,
  },
  searchHandle: {
    width: 5,
    height: 1.8,
    backgroundColor: "#9CA3AF",
    borderRadius: 2,
    position: "absolute",
    bottom: 1,
    right: 0,
    transform: [{ rotate: "45deg" }],
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1C1C1E",
    paddingVertical: 0,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtnActive: {
    borderColor: "#1A7A6E",
    backgroundColor: "#E8F5F3",
  },
  filterLines: { gap: 4, alignItems: "flex-end" },
  filterLine: {
    height: 1.8,
    backgroundColor: "#9CA3AF",
    borderRadius: 2,
  },
  fl1: { width: 16 },
  fl2: { width: 11 },
  fl3: { width: 7 },
  flActive: { backgroundColor: "#1A7A6E" },
});
