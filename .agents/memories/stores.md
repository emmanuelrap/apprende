# Stores (Zustand)

Patrón: `create<Type>((set, get) => ({...}))`. Acceso cross-store con `useXStore.getState()`.

| Store | Estado clave | Acciones clave |
|-------|-------------|----------------|
| `authStore` | user, profile, xpEvents, isLoading | init, refreshProfile, updateProfile, logout, clearMyData |
| `bookStore` | books, selectedBook, isLoading | fetchBooks(filters), selectBook |
| `readingStore` | userBooks, currentPage, currentContent, sessions | fetchPageContent, saveSession, initReader, saveProgress, finishBook |
| `vocabularyStore` | reviewItems, isLoading | fetchReviewItems, addItem, updateMastery, deleteItem |
| `gamificationStore` | trophies, userTrophies, levels | fetchTrophies, checkTrophies, computeLevel, fetchLevels |
| `recorridoStore` | recorridos, selectedRecorrido | fetchRecorridos, selectRecorrido |
| `filterStore` | categories, tags | fetchFilters |
| `videoStore` | videos | fetchVideos |
| `prefsStore` | nativeLanguage, interests, appSettings | setNativeLanguage, setInterests, setAppSettings |

Nota: `prefsStore` usa `persist` middleware con AsyncStorage (offline).
