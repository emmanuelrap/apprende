import { useAuth } from "@/src/hooks/useAuth";
import { useBooks } from "@/src/hooks/useBooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { user, name, loading: authLoading } = useAuth();
  const { books, loading: booksLoading } = useBooks(user?.id ?? null);

  useEffect(() => {
    console.log("user", user);
    console.log("books", books);
  }, [user, books]);

  // 🔒 protección
  if (!authLoading && !user) {
    router.replace("/");
    return null;
  }

  const loading = authLoading || booksLoading;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      {/* 📚 CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Hola {name || "👋"}
        </Text>

        {books.map((book) => (
          <TouchableOpacity
            key={book.id}
            onPress={() => router.push(`/reader/${book.id}`)}
            style={{
              padding: 12,
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "600" }}>{book.title}</Text>
            <Text style={{ color: "#64748B" }}>{book.author}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ⏳ LOADING */}
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.6)",
          }}
        >
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
}
