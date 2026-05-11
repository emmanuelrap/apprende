import { useVocabularyStore } from "@/src/store/vocabularyStore";
import { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Study() {
  const { reviewItems } = useVocabularyStore();
  useEffect(() => {
    console.log("reviewItems", reviewItems);
  }, [reviewItems]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>VOCABULARIO</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
