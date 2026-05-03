import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../services/supabase";

type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

type FilterItem = {
  label: string;
  badge?: string;
  icon: MaterialIconName;
};

const filters: FilterItem[] = [
  { label: "Recien\nagregado", badge: "NUEVO", icon: "creation" },
  { label: "Popular", badge: "POPULAR", icon: "fire" },
  { label: "Mejor\ncalificado", badge: "TOP", icon: "trophy" },
  { label: "En tendencia", badge: "HOT", icon: "clock" },
  { label: "Favoritos", icon: "bookmark" },
];

const levels = [
  "Todos",
  "Principiante\nA1 - A2",
  "Intermedio\nB1 - B2",
  "Avanzado\nC1 - C2",
  "A-Z  \u2195",
];

type Book = {
  id: string;
  title: string;
  author: string;
  level: string;
  badge?: string;
  rating: string;
  reviews: string;
  time: string;
  pages: string;
  xp: string;
  description: string;
  cover: string;
  color: string;
};

export function HomeScreen() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      setName(
        data?.name ??
          user.user_metadata?.display_name ??
          user.user_metadata?.name ??
          "",
      );
      setLoading(false);
    };

    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select("*");

      if (error) {
        console.error("Error fetching books:", error);
        return;
      }

      // Map the data to match the Book type, assuming the table has these fields
      const mappedBooks: Book[] = (data || []).map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        level: book.level,
        badge: book.badge,
        rating: book.rating?.toString() || "0",
        reviews: book.reviews?.toString() || "0",
        time: book.time || "0h 0m",
        pages: book.pages?.toString() + " paginas" || "0 paginas",
        xp: "+" + book.xp?.toString() + " XP" || "+0 XP",
        description: book.description,
        cover: book.cover || "https://via.placeholder.com/104x116",
        color: book.color || "#E6F7F5",
      }));

      setBooks(mappedBooks);
    };

    loadProfile();
    fetchBooks();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 94 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 14, paddingTop: 8 }}>
          <View style={searchStyle}>
            <Ionicons name="search" size={22} color="#64748B" />
            <TextInput
              editable={false}
              placeholder="Buscar por titulo o categoria..."
              placeholderTextColor="#8492A6"
              style={{ flex: 1, color: "#0F172A", fontSize: 15 }}
            />
            <Ionicons name="options-outline" size={24} color="#526173" />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 20 }}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              {filters.map((item, index) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => setSelectedFilter(index)}
                  activeOpacity={0.7}
                  style={[
                    quickCardStyle,
                    selectedFilter === index && { backgroundColor: "#078F83" },
                  ]}
                >
                  {item.badge ? (
                    <View
                      style={[
                        badgeStyle,
                        selectedFilter === index && {
                          backgroundColor: "#69B85C",
                        },
                        index === 1 &&
                          selectedFilter !== index && {
                            backgroundColor: "#F59E0B",
                          },
                        index === 2 &&
                          selectedFilter !== index && {
                            backgroundColor: "#7C3AED",
                          },
                        index === 3 &&
                          selectedFilter !== index && {
                            backgroundColor: "#EF466F",
                          },
                      ]}
                    >
                      <Text style={badgeTextStyle}>{item.badge}</Text>
                    </View>
                  ) : null}
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={
                      selectedFilter === index ? "#FFFFFF" : iconColor(index)
                    }
                  />
                  <Text
                    style={[
                      quickLabelStyle,
                      selectedFilter === index && { color: "#FFFFFF" },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={progressCardStyle}>
            <View style={progressTabStyle}>
              <Text style={{ color: "#334155", fontWeight: "800" }}>
                Tu Progreso
              </Text>
            </View>

            <View style={progressColumnStyle}>
              <MaterialCommunityIcons
                name="chart-bar"
                size={28}
                color="#099083"
              />
              <View>
                <Text style={mutedTextStyle}>Nivel:</Text>
                <Text style={progressTitleStyle}>Principiante</Text>
                <View style={levelPillStyle}>
                  <Text style={levelPillTextStyle}>A1 - A2</Text>
                </View>
              </View>
            </View>

            <View style={separatorStyle} />

            <View style={{ flex: 1.15, paddingHorizontal: 14 }}>
              <Text style={mutedTextStyle}>⭐ Total XP:</Text>
              <Text style={progressTitleStyle}>1,250 XP</Text>
              <View style={xpTrackStyle}>
                <View style={xpFillStyle} />
              </View>
              <Text style={{ color: "#334155", fontSize: 12 }}>
                Faltan 750 XP para nivel Intermedio
              </Text>
            </View>

            <View style={separatorStyle} />

            <View style={{ flex: 0.72, paddingLeft: 14 }}>
              <Text style={mutedTextStyle}>🔥 Racha</Text>
              <Text style={progressTitleStyle}>7 dias</Text>
              <Text style={{ color: "#D08720", fontWeight: "800" }}>
                Sigue asi!
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14 }}
          >
            <View style={{ flexDirection: "row", gap: 12 }}>
              {levels.map((level, index) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setSelectedLevel(index)}
                  activeOpacity={0.7}
                  style={[
                    levelChipStyle,
                    selectedLevel === index && activeChipStyle,
                  ]}
                >
                  <Text
                    style={[
                      levelChipTextStyle,
                      selectedLevel === index && activeChipTextStyle,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={sectionHeaderStyle}>
            <Text style={{ color: "#0F172A", fontSize: 18, fontWeight: "900" }}>
              Recomendados para ti
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{ color: "#078F83", fontWeight: "800" }}>
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12 }}>
            {books.map((book) => (
              <TouchableOpacity
                key={book.id}
                activeOpacity={0.8}
                style={[bookCardStyle, { backgroundColor: book.color }]}
                onPress={() => console.log("Book pressed:", book.title)}
              >
                <Image source={{ uri: book.cover }} style={coverStyle} />

                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  {book.badge && (
                    <View style={bookBadgeStyle}>
                      <Text style={bookBadgeTextStyle}>{book.badge}</Text>
                    </View>
                  )}
                  <Text numberOfLines={1} style={bookTitleStyle}>
                    {book.title}
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 12 }}>
                    {book.author}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 7 }}>
                    <View style={outlinePillStyle}>
                      <Text style={outlinePillTextStyle}>{book.level}</Text>
                    </View>
                    <View style={smallPillStyle}>
                      <Text style={outlinePillTextStyle}>
                        {book.level === "Principiante"
                          ? "A1"
                          : book.level === "Intermedio"
                            ? "B1"
                            : "C1"}
                      </Text>
                    </View>
                  </View>
                  <Text numberOfLines={2} style={descriptionStyle}>
                    {book.description}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-start", width: 92 }}>
                  <Text style={metricTextStyle}>
                    ⭐ {book.rating} ({book.reviews})
                  </Text>
                  <Text style={metricTextStyle}>◷ {book.time}</Text>
                  <Text style={metricTextStyle}>▱ {book.pages}</Text>
                  <View style={xpBoxStyle}>
                    <Text
                      style={{
                        color: "#087F7A",
                        fontSize: 18,
                        fontWeight: "900",
                      }}
                    >
                      {book.xp}
                    </Text>
                    <Text style={{ color: "#334155", fontSize: 11 }}>
                      por completarlo
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={bottomNavStyle}>
        <View style={activeNavItemStyle}>
          <Ionicons name="book" size={22} color="#078F83" />
          <Text style={activeNavTextStyle}>Libros</Text>
        </View>
        <View style={navItemStyle}>
          <Ionicons name="play-circle-outline" size={23} color="#64748B" />
          <Text style={navTextStyle}>Videos</Text>
        </View>
        <View style={navItemStyle}>
          <Ionicons name="person-outline" size={22} color="#64748B" />
          <Text style={navTextStyle}>{name || "Perfil"}</Text>
        </View>
      </View>

      {loading ? (
        <View style={loadingOverlayStyle}>
          <ActivityIndicator color="#078F83" />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const searchStyle = {
  alignItems: "center" as const,
  backgroundColor: "#FFFFFF",
  borderColor: "#D8E1EA",
  borderRadius: 12,
  borderWidth: 1,
  elevation: 3,
  flexDirection: "row" as const,
  gap: 12,
  paddingHorizontal: 14,
  paddingVertical: 10,
  shadowColor: "#0F172A",
  shadowOpacity: 0.1,
  shadowRadius: 8,
};

const quickCardStyle = {
  alignItems: "center" as const,
  backgroundColor: "#F8FBFD",
  borderColor: "#CBD5E1",
  borderRadius: 14,
  borderWidth: 1,
  height: 82,
  justifyContent: "center" as const,
  paddingHorizontal: 10,
  width: 82,
};

const badgeStyle = {
  borderRadius: 8,
  paddingHorizontal: 7,
  paddingVertical: 2,
  position: "absolute" as const,
  right: -1,
  top: -8,
};

const badgeTextStyle = {
  color: "#FFFFFF",
  fontSize: 9,
  fontWeight: "900" as const,
};

const quickLabelStyle = {
  color: "#172033",
  fontSize: 12,
  fontWeight: "800" as const,
  marginTop: 8,
  textAlign: "center" as const,
};

const progressCardStyle = {
  alignItems: "center" as const,
  backgroundColor: "#FFFFFF",
  borderColor: "#DDE6EE",
  borderRadius: 12,
  borderWidth: 1,
  elevation: 2,
  flexDirection: "row" as const,
  marginTop: 18,
  minHeight: 92,
  paddingHorizontal: 14,
  paddingVertical: 12,
};

const progressTabStyle = {
  backgroundColor: "#E9EEF2",
  borderRadius: 6,
  left: 10,
  paddingHorizontal: 10,
  paddingVertical: 5,
  position: "absolute" as const,
  top: -12,
};

const progressColumnStyle = {
  alignItems: "center" as const,
  flex: 0.9,
  flexDirection: "row" as const,
  gap: 8,
};

const mutedTextStyle = {
  color: "#475569",
  fontSize: 12,
  fontWeight: "700" as const,
};

const progressTitleStyle = {
  color: "#172033",
  fontSize: 16,
  fontWeight: "900" as const,
};

const levelPillStyle = {
  alignSelf: "flex-start" as const,
  backgroundColor: "#B9E6DF",
  borderRadius: 8,
  marginTop: 8,
  paddingHorizontal: 12,
  paddingVertical: 4,
};

const levelPillTextStyle = {
  color: "#0D7F78",
  fontWeight: "900" as const,
};

const separatorStyle = {
  backgroundColor: "#E2E8F0",
  height: 64,
  width: 1,
};

const xpTrackStyle = {
  backgroundColor: "#CFE3E1",
  borderRadius: 99,
  height: 8,
  marginVertical: 7,
  overflow: "hidden" as const,
};

const xpFillStyle = {
  backgroundColor: "#078F83",
  borderRadius: 99,
  height: 8,
  width: "64%" as const,
};

const levelChipStyle = {
  alignItems: "center" as const,
  backgroundColor: "#FFFFFF",
  borderColor: "#D5DEE8",
  borderRadius: 13,
  borderWidth: 1,
  justifyContent: "center" as const,
  minHeight: 38,
  paddingHorizontal: 19,
};

const activeChipStyle = {
  backgroundColor: "#078F83",
  borderColor: "#078F83",
};

const levelChipTextStyle = {
  color: "#334155",
  fontSize: 12,
  fontWeight: "800" as const,
  textAlign: "center" as const,
};

const activeChipTextStyle = {
  color: "#FFFFFF",
};

const sectionHeaderStyle = {
  alignItems: "center" as const,
  flexDirection: "row" as const,
  justifyContent: "space-between" as const,
  marginBottom: 10,
  marginTop: 16,
};

const bookCardStyle = {
  borderRadius: 12,
  flexDirection: "row" as const,
  minHeight: 132,
  padding: 8,
};

const coverStyle = {
  borderRadius: 8,
  height: 116,
  width: 104,
};

const bookBadgeStyle = {
  alignSelf: "flex-start" as const,
  backgroundColor: "#79B952",
  borderRadius: 8,
  paddingHorizontal: 8,
  paddingVertical: 2,
};

const bookBadgeTextStyle = {
  color: "#FFFFFF",
  fontSize: 10,
  fontWeight: "900" as const,
};

const bookTitleStyle = {
  color: "#111827",
  fontSize: 18,
  fontWeight: "900" as const,
  marginTop: 3,
};

const outlinePillStyle = {
  borderColor: "#6BA7D8",
  borderRadius: 10,
  borderWidth: 1,
  paddingHorizontal: 9,
  paddingVertical: 2,
};

const smallPillStyle = {
  backgroundColor: "#D5F0EA",
  borderRadius: 10,
  paddingHorizontal: 9,
  paddingVertical: 3,
};

const outlinePillTextStyle = {
  color: "#25787C",
  fontSize: 11,
  fontWeight: "800" as const,
};

const descriptionStyle = {
  color: "#334155",
  fontSize: 12,
  lineHeight: 16,
  marginTop: 8,
};

const metricTextStyle = {
  color: "#172033",
  fontSize: 12,
  fontWeight: "700" as const,
  marginBottom: 8,
};

const xpBoxStyle = {
  alignItems: "center" as const,
  borderColor: "#09847F",
  borderRadius: 8,
  borderWidth: 1.5,
  marginTop: 2,
  paddingVertical: 5,
  width: 88,
};

const bottomNavStyle = {
  alignItems: "center" as const,
  backgroundColor: "#FFFFFF",
  borderColor: "#DDE6EE",
  borderRadius: 16,
  borderWidth: 1,
  bottom: 8,
  elevation: 6,
  flexDirection: "row" as const,
  height: 58,
  justifyContent: "space-between" as const,
  left: 8,
  paddingHorizontal: 12,
  position: "absolute" as const,
  right: 8,
};

const navItemStyle = {
  alignItems: "center" as const,
  flex: 1,
  justifyContent: "center" as const,
};

const activeNavItemStyle = {
  alignItems: "center" as const,
  backgroundColor: "#E0F6F3",
  borderRadius: 12,
  flex: 1,
  flexDirection: "row" as const,
  gap: 7,
  height: 38,
  justifyContent: "center" as const,
};

const navTextStyle = {
  color: "#64748B",
  fontSize: 12,
  fontWeight: "800" as const,
  marginTop: 2,
};

const activeNavTextStyle = {
  color: "#078F83",
  fontSize: 12,
  fontWeight: "900" as const,
};

const loadingOverlayStyle = {
  alignItems: "center" as const,
  backgroundColor: "rgba(247,250,252,0.7)",
  bottom: 0,
  justifyContent: "center" as const,
  left: 0,
  position: "absolute" as const,
  right: 0,
  top: 0,
};

function iconColor(index: number) {
  if (index === 1) return "#94A3B8";
  if (index === 2) return "#94A3B8";
  if (index === 3) return "#2E5FA5";
  return "#8A9AA8";
}
