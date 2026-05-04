import { supabase } from "@/src/services/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LEVELS = [
  { label: "A1", value: 1 },
  { label: "A2", value: 2 },
  { label: "B1", value: 3 },
  { label: "B2", value: 4 },
  { label: "C1", value: 5 },
  { label: "C2", value: 6 },
];

const LANGUAGES = [
  { label: "Español", value: "es" },
  { label: "Inglés", value: "en" },
  { label: "Francés", value: "fr" },
  { label: "Portugués", value: "pt" },
];

export default function AdminBookForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const isEdit = !!id;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "",
    cover_url: "",
    difficulty: 1,
    estimated_minutes: "",
    xp_base: "10",
  });

  // 📄 páginas dinámicas
  const [pages, setPages] = useState([
    {
      contents: [
        { language: "es", content: "" },
        { language: "en", content: "" },
      ],
    },
  ]);

  // =====================
  // 📥 LOAD BOOK (EDIT)
  // =====================
  useEffect(() => {
    if (!id) return;

    const loadBook = async () => {
      const { data } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setForm({
          title: data.title || "",
          author: data.author || "",
          cover_url: data.cover_url || "",
          difficulty: data.difficulty || 1,
          estimated_minutes: data.estimated_minutes?.toString() || "",
          xp_base: data.xp_base?.toString() || "10",
        });
      }

      // 📄 cargar páginas + contenido
      const { data: pagesData } = await supabase
        .from("book_pages")
        .select(
          `
          id,
          page_number,
          page_content (
            language,
            content
          )
        `,
        )
        .eq("book_id", id)
        .order("page_number", { ascending: true });

      if (pagesData) {
        const mapped = pagesData.map((p: any) => ({
          contents: p.page_content || [],
        }));
        setPages(mapped);
      }
    };

    loadBook();
  }, [id]);

  // =====================
  // ➕ ADD PAGE
  // =====================
  const addPage = () => {
    setPages([
      ...pages,
      {
        contents: [
          { language: "es", content: "" },
          { language: "en", content: "" },
        ],
      },
    ]);
  };

  // =====================
  // ➕ ADD LANGUAGE
  // =====================
  const addLanguage = (pageIndex: number, lang: string) => {
    const newPages = [...pages];

    const exists = newPages[pageIndex].contents.find(
      (c) => c.language === lang,
    );

    if (exists) return;

    newPages[pageIndex].contents.push({
      language: lang,
      content: "",
    });

    setPages(newPages);
  };

  // =====================
  // ✏️ UPDATE CONTENT
  // =====================
  const updateContent = (pageIndex: number, lang: string, value: string) => {
    const newPages = [...pages];

    const item = newPages[pageIndex].contents.find((c) => c.language === lang);

    if (item) item.content = value;

    setPages(newPages);
  };

  // =====================
  // 💾 SAVE (FIXED 🔥)
  // =====================
  const handleSave = async () => {
    if (!form.title) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    setLoading(true);

    try {
      let bookId = id;

      console.log("📘 START SAVE");

      // =====================
      // 📘 CREATE / UPDATE BOOK
      // =====================
      if (!isEdit) {
        const { data, error } = await supabase
          .from("books")
          .insert({
            title: form.title,
            author: form.author,
            cover_url: form.cover_url,
            difficulty: form.difficulty,
            estimated_minutes: parseInt(form.estimated_minutes) || 0,
            xp_base: parseInt(form.xp_base) || 10,
            total_pages: pages.length,
          })
          .select()
          .single();

        if (error) throw error;

        bookId = data.id;
        console.log("✅ BOOK CREATED:", bookId);
      } else {
        await supabase.from("book_pages").delete().eq("book_id", id);

        const { error } = await supabase
          .from("books")
          .update({
            title: form.title,
            author: form.author,
            cover_url: form.cover_url,
            difficulty: form.difficulty,
            estimated_minutes: parseInt(form.estimated_minutes) || 0,
            xp_base: parseInt(form.xp_base) || 10,
            total_pages: pages.length,
          })
          .eq("id", id);

        if (error) throw error;
      }

      if (!bookId) throw new Error("No bookId");

      // =====================
      // 📄 INSERT PAGES
      // =====================
      for (let i = 0; i < pages.length; i++) {
        const { data: pageData, error: pageError } = await supabase
          .from("book_pages")
          .insert({
            book_id: bookId,
            page_number: i + 1,
          })
          .select()
          .single();

        if (pageError) throw pageError;

        const contents = pages[i].contents
          .filter((c) => c.content.trim() !== "")
          .map((c) => ({
            page_id: pageData.id,
            language: c.language,
            content: c.content,
          }));

        if (contents.length > 0) {
          const { error: contentError } = await supabase
            .from("page_content")
            .insert(contents);

          if (contentError) throw contentError;
        }
      }

      Alert.alert("Éxito", "Libro guardado");
      router.back();
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", e.message);
    }

    setLoading(false);
  };

  // =====================
  // UI
  // =====================
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 16 }}>
        {isEdit ? "Editar libro" : "Nuevo libro"}
      </Text>

      <Text>Título *</Text>
      <TextInput
        placeholder="Ej: The Little Prince"
        value={form.title}
        onChangeText={(v) => setForm({ ...form, title: v })}
        style={input}
      />

      <Text>Autor</Text>
      <TextInput
        placeholder="Ej: Antoine de Saint-Exupéry"
        value={form.author}
        onChangeText={(v) => setForm({ ...form, author: v })}
        style={input}
      />

      <Text>URL portada</Text>
      <TextInput
        placeholder="https://..."
        value={form.cover_url}
        onChangeText={(v) => setForm({ ...form, cover_url: v })}
        style={input}
      />

      <Text>Dificultad</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {LEVELS.map((lvl) => (
          <TouchableOpacity
            key={lvl.value}
            onPress={() => setForm({ ...form, difficulty: lvl.value })}
            style={{
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor:
                form.difficulty === lvl.value ? "#078F83" : "#CBD5E1",
              backgroundColor:
                form.difficulty === lvl.value ? "#078F83" : "#FFF",
            }}
          >
            <Text
              style={{
                color: form.difficulty === lvl.value ? "#FFF" : "#000",
              }}
            >
              {lvl.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📄 PAGES */}
      <Text style={{ marginTop: 20, fontWeight: "700" }}>Páginas</Text>

      {pages.map((page, index) => (
        <View key={index} style={card}>
          <Text style={{ fontWeight: "700" }}>Página {index + 1}</Text>

          {page.contents.map((c, i) => (
            <View key={i}>
              <Text>{c.language.toUpperCase()}</Text>
              <TextInput
                multiline
                value={c.content}
                placeholder="Contenido..."
                onChangeText={(v) => updateContent(index, c.language, v)}
                style={[input, { minHeight: 80 }]}
              />
            </View>
          ))}

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                onPress={() => addLanguage(index, lang.value)}
                style={chip}
              >
                <Text>+ {lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity onPress={addPage} style={buttonOutline}>
        <Text style={{ color: "#078F83" }}>+ Agregar página</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSave} style={button}>
        <Text style={{ color: "#FFF" }}>
          {loading ? "Guardando..." : "Guardar libro"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 🎨 styles
const input = {
  borderWidth: 1,
  borderColor: "#CBD5E1",
  borderRadius: 8,
  padding: 10,
  marginBottom: 10,
};

const card = {
  marginTop: 12,
  padding: 12,
  borderWidth: 1,
  borderColor: "#CBD5E1",
  borderRadius: 10,
};

const button = {
  marginTop: 20,
  backgroundColor: "#078F83",
  padding: 14,
  borderRadius: 10,
  alignItems: "center" as const,
};

const buttonOutline = {
  marginTop: 12,
  borderWidth: 1,
  borderColor: "#078F83",
  padding: 12,
  borderRadius: 10,
  alignItems: "center" as const,
};

const chip = {
  borderWidth: 1,
  borderColor: "#CBD5E1",
  padding: 6,
  borderRadius: 6,
};
