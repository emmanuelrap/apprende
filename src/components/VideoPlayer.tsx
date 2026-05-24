import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { WebView } from "react-native-webview";

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
}

type Props = {
  url: string;
  visible: boolean;
  onClose: () => void;
};

export function VideoPlayer({ url, visible, onClose }: Props) {
  const videoId = getYoutubeId(url);
  const [loading, setLoading] = useState(true);

  if (!videoId) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)" }}>
        <View
          style={{
            marginTop: 50,
            paddingHorizontal: 16,
            alignItems: "flex-end",
          }}
        >
          <Pressable onPress={onClose}>
            <Text style={{ fontSize: 18, color: "#fff", fontWeight: "700" }}>
              Cerrar
            </Text>
          </Pressable>
        </View>

        <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
          {loading && (
            <Text style={{ color: "#fff", textAlign: "center", marginBottom: 8 }}>
              Cargando video...
            </Text>
          )}
          <WebView
            source={{
              html: `
                <html>
                  <body style="margin:0;background:#000">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                      frameborder="0"
                      allow="autoplay; encrypted-media"
                      allowfullscreen
                    ></iframe>
                  </body>
                </html>
              `,
            }}
            style={{ flex: 1, borderRadius: 12 }}
            onLoad={() => setLoading(false)}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      </View>
    </Modal>
  );
}
