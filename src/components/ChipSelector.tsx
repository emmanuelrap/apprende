import { colors } from "@/src/theme";
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
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
    >
      {showAll && (
        <ChipButton
          label="Todos"
          active={allSelected}
          onPress={handleAll}
        />
      )}

      {chips.map((chip) => {
        const active = isSelected(chip.id);
        return (
          <ChipButton
            key={chip.id}
            label={chip.name}
            active={active}
            onPress={() => handlePress(chip.id)}
          />
        );
      })}
    </ScrollView>
  );
}

function ChipButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: active ? colors.primary : colors.white,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: active ? colors.white : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
