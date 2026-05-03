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

# 🗄️ DATABASE CONTEXT

## 👤 profiles

Usuario de la app

* id (uuid, PK, FK → auth.users.id)
* name (text)
* avatar_url (text)
* xp (int, default 0)
* created_at (timestamp)

---

## 📚 books

Libros disponibles

* id (uuid, PK)
* title (text, required)
* author (text)
* cover_url (text)
* total_pages (int)
* difficulty (int → 1 fácil, 2 medio, 3 difícil)
* estimated_minutes (int)
* xp_base (int, default 10)
* created_at (timestamp)

---

## 📄 book_pages

Páginas de cada libro

* id (uuid, PK)
* book_id (uuid, FK → books.id)
* page_number (int)
* UNIQUE(book_id, page_number)

---

## 🌍 page_content

Contenido por idioma

* id (uuid, PK)
* page_id (uuid, FK → book_pages.id)
* language (text → 'es', 'en')
* content (text)
* UNIQUE(page_id, language)

---

## 📖 user_books

Progreso del usuario en libros

* id (uuid, PK)
* user_id (uuid, FK → profiles.id)
* book_id (uuid, FK → books.id)
* current_page (int, default 0)
* progress (int, porcentaje)
* status (text → 'reading', etc)
* started_at (timestamp)
* completed_at (timestamp)
* UNIQUE(user_id, book_id)

---

## 📊 reading_sessions

Sesiones de lectura

* id (uuid, PK)
* user_id (uuid, FK → profiles.id)
* book_id (uuid, FK → books.id)
* minutes (int)
* pages (int)
* xp (int)
* created_at (timestamp)

---

## ⚡ xp_events

Eventos de XP

* id (uuid, PK)
* user_id (uuid, FK → profiles.id)
* amount (int)
* source (text → reading, achievement, etc)
* reference_id (uuid)
* created_at (timestamp)

---

## 🟢 categories

Géneros

* id (uuid, PK)
* name (text)
* slug (text, unique)

---

## 🔗 book_categories

Relación libros ↔ categorías

* book_id (uuid, FK → books.id)
* category_id (uuid, FK → categories.id)
* PK (book_id, category_id)

---

## 🟡 book_tags

Tags UI

* id (uuid, PK)
* name (text)
* slug (text, unique)

---

## 🔗 book_tag_relations

Relación libros ↔ tags

* book_id (uuid, FK → books.id)
* tag_id (uuid, FK → book_tags.id)
* PK (book_id, tag_id)

---

## 🔁 TRIGGER (AUTO PROFILE)

Función:

* handle_new_user()

Comportamiento:

* Se ejecuta al crear usuario en auth.users
* Inserta automáticamente en profiles:

  * id = auth.users.id
  * name = user_metadata.name o 'User'

Trigger:

* after insert on auth.users

---

## ⚠️ REGLAS IMPORTANTES

* profiles se crea AUTOMÁTICO (NO frontend)
* relaciones usan UUID
* multi-idioma en page_content
* progreso separado en user_books
* XP separado en xp_events

---

## 🧠 MODELO MENTAL

User
→ profiles
→ user_books
→ reading_sessions
→ xp_events

Books
→ book_pages
→ page_content (multi idioma)
→ categories
→ tags


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