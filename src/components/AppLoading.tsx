import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function AppLoading() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FAFC", justifyContent: "center", alignItems: "center" }}>
      <Animated.Text style={{ fontSize: 64, opacity: pulseAnim }}>📖</Animated.Text>
      <Text style={{ fontSize: 18, fontWeight: "700", color: "#0F172A", marginTop: 20 }}>
        Cargando tus datos
      </Text>
      <Animated.Text style={{ fontSize: 13, color: "#64748B", marginTop: 8, opacity: fadeAnim }}>
        Estamos preparando todo para ti...
      </Animated.Text>
    </SafeAreaView>
  );
}
