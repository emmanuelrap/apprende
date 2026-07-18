# Servicios (Data Access Layer)

Módulos async que envuelven consultas Supabase.

| Archivo | Propósito |
|---------|-----------|
| `services/supabase.ts` | Cliente Supabase con fetch wrapper, log de errores, persistencia de sesión con AsyncStorage, auto-refresh de tokens via AppState |
| `services/books.ts` | Queries multi-tabla: books + categories + tags + userProgress, filtros, búsqueda, libros similares por scoring de categorías/tags |
| `services/recorridos.ts` | Learning paths con progreso, award de XP |
| `services/translate.ts` | Traducción: LibreTranslate → MyMemory (fallback) |
| `services/sentences.ts` | Splitter de texto en oraciones |
| `services/users.ts` | Perfiles de usuario |
| `services/vocabulary.ts` | CRUD review items |
| `services/favorites.ts` | Favoritos de libros |
| `services/reviews.ts` | Reseñas de libros |
| `services/videos.ts` | Videos YouTube |
