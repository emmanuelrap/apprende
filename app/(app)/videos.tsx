import { VideoPlayer } from "@/src/components/VideoPlayer";
import { useFilterStore } from "@/src/store/filterStore";
import { useVideoStore } from "@/src/store/videoStore";
import { colors, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
}

const CATEGORY_ICONS: Record<string, string> = {
  Aprendizaje: "school-outline",
  Ciencia: "flask-outline",
  "Ciencia Ficción": "rocket-outline",
  Fantasía: "sparkles-outline",
  Historia: "time-outline",
  Infantil: "happy-outline",
  Interesante: "bulb-outline",
  Misterio: "search-outline",
  Romance: "heart-outline",
  Terror: "skull-outline",
};

const WALLPAPERS = [
  ["#667eea", "#764ba2"],
  ["#f093fb", "#f5576c"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#fa709a", "#fee140"],
  ["#a18cd1", "#fbc2eb"],
  ["#fccb90", "#d57eeb"],
  ["#e0c3fc", "#8ec5fc"],
  ["#f5576c", "#ff6f00"],
  ["#667eea", "#43e97b"],
] as const;

function VideoCard({
  video,
  categoryName,
  onPress,
}: {
  video: any;
  categoryName: string;
  onPress: () => void;
}) {
  const videoId = getYoutubeId(video.url);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null;
  const wpIndex = video.id.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0) % WALLPAPERS.length;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        width: CARD_WIDTH,
        borderRadius: 14,
        backgroundColor: colors.white,
        marginBottom: 4,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      {/* Thumbnail */}
      <View style={{ width: "100%", height: 100, borderTopLeftRadius: 14, borderTopRightRadius: 14, overflow: "hidden" }}>
        {thumbnailUrl ? (
          <Image source={{ uri: thumbnailUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={WALLPAPERS[wpIndex]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Ionicons name="videocam-outline" size={28} color="rgba(255,255,255,0.5)" />
          </LinearGradient>
        )}
        {/* Play overlay */}
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="play" size={18} color="#fff" style={{ marginLeft: 2 }} />
          </View>
        </View>
        {/* Language badge */}
        <View
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            backgroundColor: video.language === "es" ? colors.primaryBg : colors.readingBg,
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <Text
            style={{
              fontSize: 9,
              fontWeight: "700",
              color: video.language === "es" ? colors.primaryDarkest : colors.reading,
            }}
          >
            {video.language?.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View style={{ padding: 10, gap: 4 }}>
        <Text
          style={{ fontSize: 13, fontWeight: "700", color: colors.text }}
          numberOfLines={2}
        >
          {video.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="pricetag-outline" size={10} color={colors.textMuted} />
          <Text style={{ fontSize: 10, color: colors.textMuted }} numberOfLines={1}>
            {categoryName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function VideosScreen() {
  const { videos, isLoading, error: videoError, fetchVideos } = useVideoStore();
  const { categories } = useFilterStore();
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchVideos();
    }, []),
  );

  const filtered = languageFilter
    ? videos.filter((v) => v.language === languageFilter)
    : videos;

  const grouped = filtered.reduce(
    (acc, v) => {
      const cat = categories.find((c) => c.id === v.category_id);
      const catName = cat?.name ?? "Otros";
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(v);
      return acc;
    },
    {} as Record<string, typeof videos>,
  );

  const totalVideos = videos.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primaryDark, colors.primaryMedium, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.15)",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.25)",
              }}
            >
              <Ionicons name="videocam" size={18} color="#fff" />
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "800", color: colors.white, letterSpacing: -0.3 }}>
                Videos
              </Text>
              <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: -1 }}>
                {totalVideos} {totalVideos === 1 ? "video disponible" : "videos disponibles"}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Language filter tabs */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: colors.white,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border,
            gap: 6,
          }}
        >
          {[
        { id: null, label: "Todos" },
        { id: "es", label: "Español" },
        { id: "en", label: "English" },
        { id: "fr", label: "Français" },
          ].map((lang) => {
            const active = languageFilter === lang.id;
            return (
              <TouchableOpacity
                key={lang.label}
                onPress={() => setLanguageFilter(lang.id)}
                activeOpacity={0.7}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 16,
                  backgroundColor: active ? colors.primary : colors.primaryBg,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: active ? colors.white : colors.primaryDarkest,
                  }}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ ...typography.body, color: colors.textMuted }}>
              Cargando videos...
            </Text>
          </View>
        ) : videoError ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 12 }}>
            <Text style={{ fontSize: 40 }}>⚠️</Text>
            <Text style={{ ...typography.body, textAlign: "center", color: colors.textSecondary }}>
              {videoError}
            </Text>
            <TouchableOpacity
              onPress={() => fetchVideos()}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingHorizontal: 24,
                paddingVertical: 12,
                marginTop: 4,
              }}
            >
              <Text style={{ fontWeight: "700", color: "#fff" }}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : filtered.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12, padding: 32 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: colors.primaryBg,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="videocam-outline" size={32} color={colors.primary} />
            </View>
            <Text style={{ ...typography.h4, color: colors.textMuted, textAlign: "center" }}>
              No hay videos disponibles
            </Text>
            <Text style={{ ...typography.body, color: colors.textMuted, textAlign: "center" }}>
              {languageFilter
                ? "No encontramos videos en este idioma. Intenta con otro filtro."
                : "Pronto agregaremos más contenido."}
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          >
            <View style={{ gap: 20 }}>
              {Object.entries(grouped).map(([catName, catVideos]) => {
                const iconName = CATEGORY_ICONS[catName] || "film-outline";
                return (
                  <View key={catName}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          backgroundColor: colors.primaryBg,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons name={iconName as any} size={14} color={colors.primaryDarkest} />
                      </View>
                      <Text style={{ fontSize: 15, fontWeight: "700", color: colors.text }}>
                        {catName}
                      </Text>
                      <View
                        style={{
                          backgroundColor: colors.border,
                          borderRadius: 8,
                          paddingHorizontal: 6,
                          paddingVertical: 1,
                        }}
                      >
                        <Text style={{ fontSize: 10, fontWeight: "600", color: colors.textMuted }}>
                          {catVideos.length}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                      {catVideos.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          categoryName={catName}
                          onPress={() => setPlayingUrl(video.url)}
                        />
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Video Player Modal */}
      <VideoPlayer
        url={playingUrl ?? ""}
        visible={!!playingUrl}
        onClose={() => setPlayingUrl(null)}
      />
    </SafeAreaView>
  );
}
