# Arquitectura del Proyecto

## Stack
- **React Native 0.81.5** + **Expo 54** + **Expo Router 6** (file-based routing)
- **TypeScript 5.9**, **NativeWind 4** (Tailwind), **Reanimated 4**, **Moti 0.30**
- **Zustand 5** (estado global), **Supabase** (backend: auth, DB, storage)
- **expo-speech** (TTS), **Lottie** (animaciones)

## Estructura raíz
```
app/          → Rutas Expo Router (file-based)
src/
  components/ → Componentes reutilizables (19)
  screens/    → Pantallas completas (6)
  services/   → Capa de datos (10 módulos)
  store/      → Estado global Zustand (9 stores)
  hooks/      → Hooks personalizados (3)
  theme.ts    → Tokens de diseño
supabase/     → Migraciones SQL
.agents/
  memories/   → Memorias del proyecto (este archivo)
  skills/     → Skills de opencode
```

## Principios
- Pantallas en `screens/` se importan desde rutas en `app/`
- Componentes puros sin lógica de negocio
- Servicios async que envuelven Supabase
- Stores con acceso cross-store via `useXStore.getState()`
