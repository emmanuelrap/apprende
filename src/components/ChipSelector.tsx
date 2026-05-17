import { ScrollView, Text, TouchableOpacity } from "react-native";

type SingleProps = {
  multiselect?: false;
  selected: string | null;
  onSelect: (id: string | null) => void;
};

type MultiProps = {
  multiselect: true;
  selected: string[];
  onSelect: (id: string[]) => void;
};

type Props = (SingleProps | MultiProps) & {
  chips: { id: string; name: string }[];
  showAll?: boolean;
};

export function ChipSelector({ chips, showAll = true, ...props }: Props) {
  const isSelected = (id: string) => {
    if (props.multiselect) return props.selected.includes(id);
    return props.selected === id;
  };

  const handlePress = (id: string) => {
    if (props.multiselect) {
      const current = props.selected;
      props.onSelect(
        current.includes(id)
          ? current.filter((c) => c !== id)
          : [...current, id],
      );
    } else {
      props.onSelect(isSelected(id) ? null : id);
    }
  };

  const handleAll = () => {
    if (props.multiselect) {
      props.onSelect([]);
    } else {
      props.onSelect(null);
    }
  };

  const allSelected = props.multiselect
    ? props.selected.length === 0
    : props.selected === null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
    >
      {/* Todos */}
      {showAll && (
        <TouchableOpacity
          onPress={handleAll}
          className={`px-4 py-1.5 rounded-full border ${
            allSelected
              ? "bg-indigo-500 border-indigo-500"
              : "bg-white border-slate-200"
          }`}
        >
          <Text
            className={
              allSelected
                ? "text-white text-sm font-medium"
                : "text-slate-500 text-sm"
            }
          >
            Todos
          </Text>
        </TouchableOpacity>
      )}

      {chips.map((chip) => {
        const active = isSelected(chip.id);
        return (
          <TouchableOpacity
            key={chip.id}
            onPress={() => handlePress(chip.id)}
            className={`px-4 py-1.5 rounded-full border ${
              active
                ? "bg-indigo-500 border-indigo-500"
                : "bg-white border-slate-200"
            }`}
          >
            <Text
              className={
                active
                  ? "text-white text-sm font-medium"
                  : "text-slate-500 text-sm"
              }
            >
              {chip.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
