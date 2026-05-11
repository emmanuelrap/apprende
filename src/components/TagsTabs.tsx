import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabase";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface TagsTabsProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

function TabIcon({ slug, active }: { slug: string; active: boolean }) {
  const color = active ? "#1A7A6E" : "#9CA3AF";

  if (slug.includes("nuevo") || slug.includes("new")) {
    return (
      <View style={[styles.iconWrap, { borderColor: color }]}>
        <View style={[styles.star, { backgroundColor: color }]} />
      </View>
    );
  }

  if (slug.includes("popular")) {
    return <View style={[styles.flame, { borderBottomColor: color }]} />;
  }

  if (slug.includes("top") || slug.includes("mejor")) {
    return (
      <View style={[styles.trophy, { borderColor: color }]}>
        <View style={[styles.trophyTop, { backgroundColor: color }]} />
      </View>
    );
  }

  if (slug.includes("tendencia") || slug.includes("trend")) {
    return <View style={[styles.clock, { borderColor: color }]} />;
  }

  return <View style={[styles.bookmark, { borderColor: color }]} />;
}

export function TagsTabs({ selected, onSelect }: TagsTabsProps) {
  const [tags, setTags] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      const { data, error } = await supabase
        .from("book_tags")
        .select("id, name, slug")
        .order("name");

      if (!error && data) setTags(data);
      setLoading(false);
    }
    fetchTags();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="small" color="#1A7A6E" />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {tags.map((cat) => {
        const isActive = selected === cat.id;

        return (
          <Tab
            key={cat.id}
            cat={cat}
            isActive={isActive}
            onPress={() => onSelect(isActive ? null : cat.id)}
          />
        );
      })}
    </ScrollView>
  );
}

function Tab({
  cat,
  isActive,
  onPress,
}: {
  cat: Category;
  isActive: boolean;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.93,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
      >
        <TabIcon slug={cat.slug} active={isActive} />

        <Text
          style={[styles.tabLabel, { color: isActive ? "#1A7A6E" : "#6B7280" }]}
          numberOfLines={2}
        >
          {cat.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { marginTop: 10 },
  content: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },

  tab: {
    width: 82,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 10,
    alignItems: "center",
    gap: 6,
    minHeight: 90,
    justifyContent: "center",
  },

  tabInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },

  tabActive: {
    backgroundColor: "#E6F4F1",
    borderColor: "#1A7A6E",
  },

  tabLabel: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
    fontWeight: "500",
  },

  // Icons
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  star: {
    width: 8,
    height: 8,
    borderRadius: 1,
    transform: [{ rotate: "45deg" }],
  },
  flame: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 18,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderRadius: 3,
  },
  trophy: {
    width: 20,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: "center",
  },
  trophyTop: { width: 8, height: 6, borderRadius: 4, marginTop: 2 },
  clock: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  bookmark: {
    width: 14,
    height: 18,
    borderWidth: 1.5,
    borderRadius: 2,
  },
});
