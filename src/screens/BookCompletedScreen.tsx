// src/screens/BookCompletedScreen.tsx
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLevel } from "../hooks/useLevel";

type Props = {
  xpBefore: number;
  xpGained: number;
  bookTitle: string;
  onContinue: () => void;
};

export function BookCompletedScreen({
  xpBefore,
  xpGained,
  bookTitle,
  onContinue,
}: Props) {
  const xpAfter = xpBefore + xpGained;
  const levelInfo = useLevel(xpAfter);

  const barAnim = useRef(new Animated.Value(0)).current;
  const xpCountAnim = useRef(new Animated.Value(0)).current;
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    if (!levelInfo) return;

    Animated.timing(xpCountAnim, {
      toValue: xpGained,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    xpCountAnim.addListener(({ value }) => setDisplayXp(Math.round(value)));

    Animated.timing(barAnim, {
      toValue: levelInfo.progress,
      duration: 1500,
      delay: 400,
      useNativeDriver: false,
    }).start();

    return () => xpCountAnim.removeAllListeners();
  }, [levelInfo]);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1E1B4B" }}>
      <LottieView
        source={require("../../assets/animations/confetti.json")}
        autoPlay
        loop={true}
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Contenido centrado verticalmente */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 28,
          marginTop: -100,
          paddingBottom: 120,
        }}
      >
        {/* Trofeo + título */}
        <View style={{ alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 64 }}>🏆</Text>
          <Text style={{ color: "#A5B4FC", fontSize: 13 }}>Completaste</Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            {bookTitle}
          </Text>
        </View>

        {/* XP */}
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#A5B4FC", fontSize: 13 }}>XP ganado</Text>
          <Text style={{ color: "#FBBF24", fontSize: 48, fontWeight: "900" }}>
            +{displayXp}
          </Text>
        </View>

        {/* Barra de nivel */}
        {levelInfo && (
          <View style={{ gap: 8 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Nivel {levelInfo.current.level} · {levelInfo.current.title}
              </Text>
              {levelInfo.next && (
                <Text style={{ color: "#A5B4FC", fontSize: 12 }}>
                  {xpAfter} / {levelInfo.next.xp_required}
                </Text>
              )}
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#312E81",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Animated.View
                style={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#FBBF24",
                  width: barWidth,
                }}
              />
            </View>
          </View>
        )}
      </View>

      {/* Botón fijo abajo */}
      <View style={{ paddingHorizontal: 28 }}>
        <TouchableOpacity
          onPress={onContinue}
          activeOpacity={0.85}
          style={{
            backgroundColor: "#6366F1",
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
