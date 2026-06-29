import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

function SkeletonBlock({
  width,
  height,
  borderRadius = 12,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: "#D1D5DB",
          opacity,
        },
        style,
      ]}
    />
  );
}

function SkeletonCircle({ size }: { size: number }) {
  return <SkeletonBlock width={size} height={size} borderRadius={size / 2} />;
}

export function HomeLoading() {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#F7FAFC",
        paddingTop: 16,
        paddingHorizontal: 16,
        gap: 20,
      }}
    >
      {/* Search bar skeleton */}
      <SkeletonBlock width="100%" height={52} borderRadius={16} />

      {/* Filter chips */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <SkeletonBlock width={70} height={32} borderRadius={20} />
        <SkeletonBlock width={80} height={32} borderRadius={20} />
        <SkeletonBlock width={75} height={32} borderRadius={20} />
        <SkeletonBlock width={65} height={32} borderRadius={20} />
      </View>

      {/* Section: Discover */}
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <SkeletonBlock width={3} height={16} borderRadius={2} />
            <SkeletonBlock width={100} height={18} borderRadius={4} />
          </View>
          <SkeletonBlock width={60} height={14} borderRadius={4} />
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <SkeletonBlock width={120} height={180} borderRadius={12} />
          <SkeletonBlock width={120} height={180} borderRadius={12} />
          <SkeletonBlock width={120} height={180} borderRadius={12} />
        </View>
      </View>

      {/* Section: Recorridos */}
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <SkeletonBlock width={3} height={16} borderRadius={2} />
            <SkeletonBlock width={110} height={18} borderRadius={4} />
          </View>
          <SkeletonBlock width={60} height={14} borderRadius={4} />
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <SkeletonBlock width={280} height={160} borderRadius={16} />
          <SkeletonBlock width={280} height={160} borderRadius={16} />
        </View>
      </View>

      {/* Section: Categories */}
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <SkeletonBlock width={3} height={16} borderRadius={2} />
            <SkeletonBlock width={130} height={18} borderRadius={4} />
          </View>
          <SkeletonBlock width={60} height={14} borderRadius={4} />
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <SkeletonBlock width={120} height={160} borderRadius={12} />
          <SkeletonBlock width={120} height={160} borderRadius={12} />
          <SkeletonBlock width={120} height={160} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}
