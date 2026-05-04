import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Book() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Detalles del libro
        </Text>
        <TouchableOpacity onPress={() => router.push(`/reader/${bookId}`)}>
          Leer
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
