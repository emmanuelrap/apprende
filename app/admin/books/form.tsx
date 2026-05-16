import { supabase } from "@/src/services/supabase";
import { useFilterStore } from "@/src/store/filterStore";
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

  const { categories, tags } = useFilterStore();

  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    author: "",
    cover_url: "",
    difficulty: 1,
    estimated_minutes: "",
    xp_base: "10",
  });

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

      // cargar categorías seleccionadas
      const { data: bookCats } = await supabase
        .from("book_categories")
        .select("category_id")
        .eq("book_id", id);
      if (bookCats) setSelectedCategories(bookCats.map((c) => c.category_id));

      // cargar tags seleccionados
      const { data: bookTags } = await supabase
        .from("book_tag_relations")
        .select("tag_id")
        .eq("book_id", id);
      if (bookTags) setSelectedTags(bookTags.map((t) => t.tag_id));

      // cargar páginas
      const { data: pagesData } = await supabase
        .from("book_pages")
        .select(`id, page_number, page_content (language, content)`)
        .eq("book_id", id)
        .order("page_number", { ascending: true });

      if (pagesData) {
        setPages(
          pagesData.map((p: any) => ({ contents: p.page_content || [] })),
        );
      }
    };

    loadBook();
  }, [id]);

  // =====================
  // 🔀 TOGGLES
  // =====================
  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  // =====================
  // ➕ PÁGINAS / IDIOMAS
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

  const addLanguage = (pageIndex: number, lang: string) => {
    const newPages = [...pages];
    const exists = newPages[pageIndex].contents.find(
      (c) => c.language === lang,
    );
    if (exists) return;
    newPages[pageIndex].contents.push({ language: lang, content: "" });
    setPages(newPages);
  };

  const updateContent = (pageIndex: number, lang: string, value: string) => {
    const newPages = [...pages];
    const item = newPages[pageIndex].contents.find((c) => c.language === lang);
    if (item) item.content = value;
    setPages(newPages);
  };

  const removePage = (index: number) => {
    if (pages.length === 1) return;
    setPages(pages.filter((_, i) => i !== index));
  };

  // =====================
  // 💾 SAVE
  // =====================
  const handleSave = async () => {
    if (!form.title) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    setLoading(true);

    try {
      let bookId = id as string;

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

        // limpiar relaciones anteriores
        await supabase.from("book_categories").delete().eq("book_id", id);
        await supabase.from("book_tag_relations").delete().eq("book_id", id);
      }

      if (!bookId) throw new Error("No bookId");

      // guardar categorías
      if (selectedCategories.length > 0) {
        await supabase.from("book_categories").insert(
          selectedCategories.map((category_id) => ({
            book_id: bookId,
            category_id,
          })),
        );
      }

      // guardar tags
      if (selectedTags.length > 0) {
        await supabase
          .from("book_tag_relations")
          .insert(selectedTags.map((tag_id) => ({ book_id: bookId, tag_id })));
      }

      // guardar páginas
      for (let i = 0; i < pages.length; i++) {
        const { data: pageData, error: pageError } = await supabase
          .from("book_pages")
          .insert({ book_id: bookId, page_number: i + 1 })
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
        placeholder=""
        value={form.title}
        onChangeText={(v) => setForm({ ...form, title: v })}
        style={input}
      />

      <Text>Autor</Text>
      <TextInput
        placeholder=""
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

      {/* Minutos y XP */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text>Minutos estimados</Text>
          <TextInput
            placeholder=""
            value={form.estimated_minutes}
            keyboardType="numeric"
            onChangeText={(v) => setForm({ ...form, estimated_minutes: v })}
            style={input}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text>XP base</Text>
          <TextInput
            placeholder="10"
            value={form.xp_base}
            keyboardType="numeric"
            onChangeText={(v) => setForm({ ...form, xp_base: v })}
            style={input}
          />
        </View>
      </View>

      {/* Dificultad */}
      <Text style={{ marginBottom: 6 }}>Dificultad</Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
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
              style={{ color: form.difficulty === lvl.value ? "#FFF" : "#000" }}
            >
              {lvl.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categorías */}
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Categorías</Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {categories.map((cat) => {
          const selected = selectedCategories.includes(cat.id);
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => toggleCategory(cat.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: selected ? "#6366F1" : "#CBD5E1",
                backgroundColor: selected ? "#6366F1" : "#FFF",
              }}
            >
              <Text
                style={{ fontSize: 13, color: selected ? "#FFF" : "#64748B" }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tags */}
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Tags</Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {tags.map((tag) => {
          const selected = selectedTags.includes(tag.id);
          return (
            <TouchableOpacity
              key={tag.id}
              onPress={() => toggleTag(tag.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: selected ? "#16A34A" : "#CBD5E1",
                backgroundColor: selected ? "#16A34A" : "#FFF",
              }}
            >
              <Text
                style={{ fontSize: 13, color: selected ? "#FFF" : "#64748B" }}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Páginas */}
      <Text
        style={{
          marginTop: 8,
          fontWeight: "700",
          fontSize: 16,
          marginBottom: 8,
        }}
      >
        Páginas
      </Text>

      {pages.map((page, index) => (
        <View key={index} style={card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: "700" }}>Página {index + 1}</Text>
            {pages.length > 1 && (
              <TouchableOpacity onPress={() => removePage(index)}>
                <Text style={{ color: "#EF4444", fontSize: 13 }}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>

          {page.contents.map((c, i) => (
            <View key={i}>
              <Text style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>
                {LANGUAGES.find((l) => l.value === c.language)?.label ??
                  c.language.toUpperCase()}
              </Text>
              <TextInput
                multiline
                value={c.content}
                placeholder="Contenido..."
                onChangeText={(v) => updateContent(index, c.language, v)}
                style={[input, { minHeight: 80 }]}
              />
            </View>
          ))}

          {/* idiomas en scroll horizontal */}
          <Text style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
            + Agregar idioma
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {LANGUAGES.map((lang) => {
                const already = page.contents.find(
                  (c) => c.language === lang.value,
                );
                return (
                  <TouchableOpacity
                    key={lang.value}
                    onPress={() => addLanguage(index, lang.value)}
                    style={[chip, already && { opacity: 0.4 }]}
                    disabled={!!already}
                  >
                    <Text style={{ fontSize: 13 }}>{lang.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      ))}

      <TouchableOpacity onPress={addPage} style={buttonOutline}>
        <Text style={{ color: "#078F83" }}>+ Agregar página</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSave}
        style={[button, { marginBottom: 40 }]}
      >
        <Text style={{ color: "#FFF" }}>
          {loading ? "Guardando..." : "Guardar libro"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
  padding: 8,
  borderRadius: 8,
  backgroundColor: "#FFF",
};
