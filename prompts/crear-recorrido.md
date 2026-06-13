# Prompt: Crear un recorrido en Apprende

Crea un recorrido de aprendizaje de inglés para Apprende (app Expo + Supabase) siguiendo estos pasos.

## 1. Verifica lo existente

Ejecuta SQL queries para conocer el estado actual:

```sql
SELECT id, title FROM recorridos;
SELECT id, title, difficulty FROM books ORDER BY title;
SELECT * FROM categories;
SELECT * FROM book_tags;
```

Confirma al usuario qué recorridos ya existen para no repetir tema.

## 2. Diseña el recorrido

El usuario puede especificar:
- **Tema** del recorrido
- **Cantidad de libros** que lo componen
- **Páginas por libro**
- **Párrafos por página**

Si el usuario **no especifica algo**, usa estos valores por defecto:
- 2-5 libros con historia continua, no importa que no sean los mismo personajes pero debe tener relacion el tema
- Dificultad progresiva: A1→A2→B1 o A2→A2→B2→C1
- 3-6 páginas por libro según dificultad


- `estimated_minutes` del recorrido = suma de `estimated_minutes` de los libros
- `xp_reward` del recorrido = suma de `xp_base` de los libros
- `sort_order` = siguiente número disponible
- `is_published` = true
- `difficulty` y `min_level` del recorrido = los del libro más fácil

## 3. Esquemas exactos para el SQL

### books
| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid | PK |
| title | text | Título en inglés |
| author | text | 'Apprende' |
| description | text | 1-2 oraciones describiendo el libro |
| cover_url | text | NULL |
| total_pages | int | Ver tabla de especificaciones por nivel |
| difficulty | int | 1=A1, 2=A2, 3=B1, 4=B2, 5=C1, 6=C2 |
| estimated_minutes | int | Ver tabla de especificaciones por nivel |
| xp_base | int | Ver tabla de especificaciones por nivel |
| min_level | int | Nivel mínimo del usuario (1=A1, 2=A2, 3=B1...) |

### book_pages
| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid | PK |
| book_id | uuid | FK → books.id |
| page_number | int | 1-indexed |

### page_content
| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid | PK |
| page_id | uuid | FK → book_pages.id |
| language | text | 'en' o 'es' |
| content | text | Texto bilingüe |
| audio_url | text | NULL |

Cada página necesita 2 rows: uno con `language='en'` y otro con `language='es'`.

### book_vocabulary
| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid | PK |
| book_id | uuid | FK → books.id |
| word_es | text | Palabra en español |
| word_en | text | Traducción al inglés |
| level | text | 'A1', 'A2', 'B1' según el libro |

10-12 palabras relevantes al contenido del libro.

### book_categories (PK compuesto: book_id + category_id)
| Columna | Tipo | Notas |
|---------|------|-------|
| book_id | uuid | FK → books.id |
| category_id | uuid | FK → categories.id |

Cada libro recibe 2 categorías: **"Infantil"** + una temática del listado existente.

IDs de categorías disponibles (consultar en paso 1):
- Infantil: `21cdf8f7-56ca-43af-beb7-2f5222c5ac40`
- Aprendizaje: `a0000000-0000-4000-a000-000000000001`
- Ciencia, Historia, Fantasía, Ciencia Ficción, Misterio, Terror, Romance, Interesante

### book_tag_relations (PK compuesto: book_id + tag_id)
| Columna | Tipo | Notas |
|---------|------|-------|
| book_id | uuid | FK → books.id |
| tag_id | uuid | FK → book_tags.id |

Usar "Nuevo" (`6803779b-6be5-41e3-aaee-29b044e24a94`) en los 3 libros.

### recorridos
| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid | PK |
| title | text | Título del recorrido |
| description | text | Descripción del viaje de aprendizaje |
| cover_url | text | NULL |
| difficulty | int | Misma dificultad que el libro más fácil |
| min_level | int | Mismo valor que el libro más fácil |
| estimated_minutes | int | Suma de estimated_minutes de los libros |
| xp_reward | int | Suma de xp_base de los libros |
| is_published | bool | true |
| sort_order | int | Siguiente número disponible |

### recorrido_books (PK compuesto: recorrido_id + book_id)
| Columna | Tipo | Notas |
|---------|------|-------|
| recorrido_id | uuid | FK → recorridos.id |
| book_id | uuid | FK → books.id |
| sort_order | int | 1, 2, 3 |
| required | bool | true para todos |

## 4. Especificaciones por nivel

| Métrica | A1 | A2 | B1 | B2 | C1 |
|---------|:--:|:--:|:--:|:--:|:--:|
| Páginas por libro | 3 | 4 | 5 | 6 | 7-8 |
| Párrafos por página | 2-3 | 3-4 | 4-5 | 4-6 | 5-7 |
| estimated_minutes | 10 | 15 | 20 | 25 | 30 |
| xp_base | 10 | 15 | 20 | 25 | 30 |
| Gramática | Present simple | Past simple, present continuous | Present perfect, conditionals, connectors | Passive voice, subjunctive, phrasal verbs | All tenses, nuanced expressions |
| Vocabulario | Básico (casa, animal, color) | Cotidiano (comida, ropa, ciudad) | Abstracto (sentimientos, ideas) | Especializado general | Técnico, idiomático |

## 5. Reglas de contenido bilingüe

- La versión **EN** debe ser inglés natural y narrativo, ajustado al nivel
- La versión **ES** debe ser una traducción natural al español (no literal)
- Contenido educativo y apropiado para niños/pre-adolescentes/jovenes/adultos 
- La historia debe tener coherencia interna y conectar todos los libros
- Vocabulario: 6-12 palabras por libro, relevantes al contenido del libro

## 6. Formato del SQL

- Usa UUIDs literales con prefijo `a0000000-` (nuevo grupo, ej: `a0000000-c001-...`)
- NO uses `gen_random_uuid()` — IDs fijos para consistencia
- Cada INSERT enumera TODOS los campos explícitamente
- Las páginas EN y ES se insertan con INSERTs separados por página
- Aplica con la herramienta `supabase_apply_migration`

## 7. Verificación final

```sql
SELECT r.title, rb.sort_order, b.title, b.difficulty
FROM recorridos r
JOIN recorrido_books rb ON r.id = rb.recorrido_id
JOIN books b ON b.id = rb.book_id
WHERE r.id = '<id-nuevo-recorrido>'
ORDER BY rb.sort_order;
```

Muestra al usuario un resumen: nombre del recorrido, libros que incluye, nivel de dificultad, y estado de la migración.
