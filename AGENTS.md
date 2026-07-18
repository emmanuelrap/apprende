# Apprende - English Learning App

App de aprendizaje de inglés leyendo libros bilingües. React Native (Expo 54) + Supabase + Zustand + NativeWind.

## Memoria del Proyecto

Archivos en `.agents/memories/` con conocimiento estructurado del proyecto. Cuando trabajes en algo relacionado a un área, leé el archivo correspondiente con `read`:

| Archivo | Contenido |
|---------|-----------|
| `.agents/memories/architecture.md` | Stack, estructura de directorios, principios arquitectónicos |
| `.agents/memories/routes.md` | Sistema de rutas Expo Router, layouts, tabs, redirecciones |
| `.agents/memories/stores.md` | Todos los Zustand stores, estado y acciones |
| `.agents/memories/services.md` | Servicios Supabase, data access layer |
| `.agents/memories/components.md` | Catálogo de componentes reutilizables |
| `.agents/memories/database.md` | Schema Supabase, tablas, migraciones |
| `.agents/memories/gamification.md` | Sistema de XP, niveles, trofeos, recorridos |
| `.agents/memories/reader.md` | Modos de lectura, progreso, vocabulario |
| `.agents/memories/screens.md` | Pantallas principales y su propósito |

## Convenciones
- TypeScript estricto, componentes funcionales
- NativeWind para estilos (Tailwind v3)
- Stores Zustand sin React Context
- Servicios como funciones async, no clases
- Pantallas en `src/screens/`, rutas en `app/`
- `prefsStore` con persist middleware (AsyncStorage)

## Comandos
```bash
npm start        # Iniciar Expo
npm run android  # Build Android
npm run ios      # Build iOS
npm run web      # Build web
npm run lint     # ESLint
```
