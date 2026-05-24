import { useAuthStore } from "@/src/store/authStore";
import { useFilterStore } from "@/src/store/filterStore";
import { useVideoStore } from "@/src/store/videoStore";
import { VideoPlayer } from "@/src/components/VideoPlayer";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChipSelector } from "@/src/components/ChipSelector";

export default function VideosScreen() {
  const user = useAuthStore((s) => s.user);
  const { videos, isLoading, fetchVideos } = useVideoStore();
  const { categories } = useFilterStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchVideos();
  }, [user?.id]);

  const filtered = selectedCategory
    ? videos.filter((v) => v.category_id === selectedCategory)
    : videos;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 16 }}>
          Videos
        </Text>

        <ChipSelector
          chips={[{ id: "", name: "Todos", slug: "" }, ...categories]}
          selected={selectedCategory ?? ""}
          onSelect={(id) => setSelectedCategory(id || null)}
          showAll={false}
        />

        {filtered.length === 0 && !isLoading && (
          <Text style={{ color: "#94A3B8", marginTop: 40, textAlign: "center" }}>
            No hay videos disponibles
          </Text>
        )}

        {filtered.map((video) => (
          <TouchableOpacity
            key={video.id}
            onPress={() => handleOpenVideo(video.url)}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: "row",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 80,
                height: 60,
                borderRadius: 8,
                backgroundColor: "#E2E8F0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24 }}>▶️</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", fontSize: 15 }}>
                {video.title}
              </Text>
              <Text style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>
                {video.language === "es" ? "Español" : "English"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
