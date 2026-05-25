import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  trophy: {
    name: string;
    description: string;
    icon: string;
    rarity: "common" | "rare" | "epic" | "legendary";
    xp_reward: number;
  };
  onContinue: () => void;
};

const RARITY_COLORS: Record<string, string> = {
  common: "#94A3B8",
  rare: "#6366F1",
  epic: "#A855F7",
  legendary: "#F59E0B",
};

export function TrophyUnlockedScreen({ trophy, onContinue }: Props) {
  const [displayXp, setDisplayXp] = useState(0);
  const xpCountAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 6,
      useNativeDriver: true,
    }).start();

    Animated.timing(xpCountAnim, {
      toValue: trophy.xp_reward,
      duration: 1000,
      delay: 500,
      useNativeDriver: false,
    }).start();

    xpCountAnim.addListener(({ value }) => setDisplayXp(Math.round(value)));

    return () => xpCountAnim.removeAllListeners();
  }, []);

  const rarityColor = RARITY_COLORS[trophy.rarity] ?? "#94A3B8";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <LottieView
          source={require("../../assets/animations/confetti.json")}
          autoPlay
          loop
          style={{ flex: 1 }}
        />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 28,
          marginTop: -80,
        }}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 72 }}>{trophy.icon}</Text>

          <View
            style={{
              backgroundColor: rarityColor + "22",
              paddingHorizontal: 14,
              paddingVertical: 4,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: rarityColor, fontWeight: "700", fontSize: 12, textTransform: "uppercase" }}>
              {trophy.rarity}
            </Text>
          </View>

          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700", textAlign: "center" }}>
            {trophy.name}
          </Text>

          <Text style={{ color: "#94A3B8", fontSize: 14, textAlign: "center" }}>
            {trophy.description}
          </Text>

          {trophy.xp_reward > 0 && (
            <View style={{ alignItems: "center", marginTop: 8 }}>
              <Text style={{ color: "#A5B4FC", fontSize: 12 }}>XP ganado</Text>
              <Text style={{ color: "#FBBF24", fontSize: 36, fontWeight: "900" }}>
                +{displayXp}
              </Text>
            </View>
          )}
        </Animated.View>
      </View>

      <View style={{ paddingHorizontal: 28, paddingBottom: 20 }}>
        <TouchableOpacity
          onPress={onContinue}
          activeOpacity={0.85}
          style={{
            backgroundColor: rarityColor,
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
