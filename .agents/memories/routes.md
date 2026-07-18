# Rutas y Navegación

## Layouts
- `app/_layout.tsx` → Root: init app + AppLoading
- `app/(app)/_layout.tsx` → BottomNav (4 tabs) + SafeAreaView

## Redirección
- `app/index.tsx` → auth? `/(app)/home` : `/(auth)`
- `app/(app)/_layout.tsx` → sin nativeLanguage? `/language-setup`

## Tabs (BottomNav)
| Tab | Ruta | Screen |
|-----|------|--------|
| Libros | `/(app)/home` | HomeScreen |
| Videos | `/(app)/videos` | VideosScreen |
| Vocabulario | `/(app)/study` | StudyScreen |
| Perfil | `/(app)/profile` | ProfileScreen |

## Rutas dinámicas
- `/book/[id]` → BookDetailScreen
- `/reader/[bookId]` → ReaderScreen
- `/recorrido/[id]` → RecorridoDetailScreen

## Otras rutas
- `/(auth)` → Login/Register
- `/language-setup` → LanguageSetupScreen
- `/(app)/list?type=X` → ListScreen (genérica)
