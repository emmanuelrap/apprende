import { deleteBook } from "@/src/services/books";
import { supabase } from "@/src/services/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function AdminBooks() {
  const router = useRouter();

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, title, author");

      if (error) {
        console.error(error);
      } else {
        setBooks(data || []);
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleDeleteBook = (bookId: string) => {
    if (Platform.OS === "web") {
      const ok = window.confirm("¿Eliminar libro?");
      if (!ok) return;

      onDelete(bookId);
    } else {
      Alert.alert("Eliminar", "¿Seguro?", [
        { text: "Cancelar" },
        { text: "Eliminar", onPress: () => onDelete(bookId) },
      ]);
    }
  };

  const onDelete = async (bookId: string) => {
    try {
      await deleteBook(bookId);

      // 🔄 actualizar UI
      setBooks((prev) => prev.filter((b) => b.id !== bookId));

      // ✅ feedback
      Toast.show({
        type: "success",
        text1: "Libro eliminado",
      });
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
          📚 Admin - Libros
        </Text>

        {/* ➕ Crear */}
        <TouchableOpacity
          onPress={() => router.push("/admin/books/form")}
          style={{
            backgroundColor: "#078F83",
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            + Crear libro
          </Text>
        </TouchableOpacity>

        {/* 📚 Lista */}
        {books.map((book) => (
          <View key={book.id}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/admin/books/form",
                  params: { id: book.id },
                })
              }
              style={{
                padding: 14,
                backgroundColor: "#fff",
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "600" }}>{book.title}</Text>
              <Text style={{ color: "#64748B" }}>{book.author}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteBook(book.id)}>
              <Text>Borrar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {loading && <ActivityIndicator />}
      </ScrollView>
    </SafeAreaView>
  );
}
