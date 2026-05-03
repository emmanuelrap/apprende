# AI CONTEXT

## 📱 Proyecto
App móvil de lectura tipo beelinguapp.

## 🧱 Stack
- React Native (Expo)
- TypeScript
- Supabase (Auth + Database)
- NativeWind (Tailwind)
- React Navigation

## 🧠 Arquitectura

Estructura base:

src/
 ├── screens/
 ├── components/
 ├── services/
 │     └── supabase.ts
 ├── navigation/
 ├── hooks/

## 🔐 Auth Flow

1. Usuario se registra con:
   - nombre
   - email
   - password

2. Se usa:
   supabase.auth.signUp

3. Después:
   - obtener user.id
   - insertar en tabla profiles


IMPORTANTE:
Supabase NO crea profiles automáticamente.

---

## 🗄️ Base de Datos

Tablas principales:

- profiles (id, name, xp)
- books
- book_pages
- page_content (multi idioma)
- user_books
- reading_sessions
- xp_events
- categories
- book_categories
- book_tags
- book_tag_relations

---

## 🌍 Idiomas

- Español (es)
- Inglés (en)

Cada página tiene múltiples idiomas.

---

## ⚙️ Reglas de Código

- Hacer codigo limpio, facil de leer, sin codigo innesesario o basura
- usar async/await
- manejar errores siempre
- no lógica compleja en UI
- separar servicios (supabase.ts)
- código limpio y modular

---

## 🎯 Objetivo actual

1. Registro funcional
2. Crear profile correctamente
3. Navegar a Home
4. Crear la pantalla de inicio, se tiene una imagen como base

---

## 🧠 Comportamiento de la IA

- Responder con código limpio
- Explicaciones mínimas
- No repetir contexto innecesario
- No usar librerías pesadas
- Priorizar soluciones simples

---

## 📉 Optimización de tokens

- no explicar lo que se esta haciendo
- Responder corto
- No explicar cosas obvias
- No repetir código completo si no cambia
- Enfocarse solo en lo pedido

---

## 🧾 Logging (MUY IMPORTANTE)

Cada cambio relevante debe agregarse a:

AI_LOG.md

Formato:

## [feature]

- qué se hizo
- qué problema se resolvió
- decisiones tomadas

Ejemplo:

## Registro

- Se implementó signUp con Supabase
- Se agregó creación manual de profile
- Se corrigió error de RLS

---

## 🚫 Evitar

- sobreingeniería
- código innecesario
- librerías grandes
- lógica duplicada

---

## ✅ Prioridad

1. Funcione
2. Sea claro
3. Luego optimizar