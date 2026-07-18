# Sistema de Lectura

## Modos de lectura
1. **DualPanel** (`DualPanelReader`): dos idiomas lado a lado
2. **Interleaved** (`InterleavedReader`): oraciones intercaladas
3. **Single** (`SingleReader`): un solo idioma

Configuración persistida en `prefsStore` (AsyncStorage): modo, tema, tamaño fuente, espaciado.

## Temas
- Light, Sepia, Dark

## Progreso
- `readingStore` maneja sesiones, páginas, progreso
- `saveProgress()` actualiza `user_books.current_page`
- `saveSession()` crea `reading_sessions` con minutos, páginas, XP
- `finishBook()` marca como completado, otorga XP, verifica trofeos

## Vocabulario
- Guardar palabras desde el reader → `review_items`
- `vocabularyStore` maneja CRUD + mastery levels
- Modal de estudio con flip cards + writing mode
- Filtro por dificultad: hard / pending / mastered
