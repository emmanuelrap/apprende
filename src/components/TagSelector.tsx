// components/TagSelector.tsx
import { ScrollView, Text, TouchableOpacity } from "react-native";

type Props = {
  tags: { id: string; name: string }[];
  selected: string | null;
  onSelect: (id: string | null) => void;
};

export function TagSelector({ tags, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
    >
      {/* Todos */}
      <TouchableOpacity
        onPress={() => onSelect(null)}
        className={`px-4 py-1.5 rounded-full border ${
          selected === null
            ? "bg-indigo-500 border-indigo-500"
            : "bg-white border-slate-200"
        }`}
      >
        <Text
          className={
            selected === null
              ? "text-white text-sm font-medium"
              : "text-slate-500 text-sm"
          }
        >
          Todos
        </Text>
      </TouchableOpacity>

      {tags.map((tag) => {
        const isSelected = selected === tag.id;
        return (
          <TouchableOpacity
            key={tag.id}
            onPress={() => onSelect(isSelected ? null : tag.id)}
            className={`px-4 py-1.5 rounded-full border ${
              isSelected
                ? "bg-indigo-500 border-indigo-500"
                : "bg-white border-slate-200"
            }`}
          >
            <Text
              className={
                isSelected
                  ? "text-white text-sm font-medium"
                  : "text-slate-500 text-sm"
              }
            >
              {tag.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
