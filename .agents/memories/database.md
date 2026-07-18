# Base de Datos (Supabase)

## Tablas principales
| Tabla | Uso |
|-------|-----|
| `profiles` | Perfiles de usuario (id, name, avatar_url, xp, level). Creada por trigger on signup |
| `books` | Libros (id, title, author, description, cover_url, difficulty, xp_base, min_level, total_pages) |
| `book_pages` | Páginas de libro (id, book_id, page_number) |
| `page_content` | Contenido bilingüe (id, page_id, language, content) |
| `categories` | Categorías (id, name, slug) |
| `book_tags` | Tags (id, name, slug) |
| `book_categories` | junction book ↔ category |
| `book_tag_relations` | junction book ↔ tag |
| `user_books` | Progreso lectura (user_id, book_id, current_page, status, progress) |
| `reading_sessions` | Sesiones de lectura (minutes, pages, xp) |
| `xp_events` | Eventos de XP (amount, source, reference_id) |
| `levels` | Niveles (level, xp_required, title) |
| `trophies` | Logros (name, description, icon, rarity, condition_type, condition_value, xp_reward) |
| `user_trophies` | Logros obtenidos |
| `review_items` | Vocabulario en revisión (type, content, translation, mastery, next_review_at) |
| `user_favorites` | Favoritos |
| `recorridos` | Learning paths (difficulty, min_level, xp_reward) |
| `recorrido_books` | junction recorrido ↔ book (sort_order, required) |
| `user_recorridos` | Progreso en recorridos (status: not_started/in_progress/completed) |
| `book_vocabulary` | Vocabulario del libro (word_es, word_en, level A1-C2) |
| `book_reviews` | Reseñas (rating, comment) |
| `videos` | Videos YouTube (url, thumbnail, language) |

## Migraciones
4 migraciones en `supabase/migrations/`: recorridos, book_vocabulary, description column, seed data "Exploring the City with Ana"
