# AI LOG

## 📅 Historial de desarrollo

---

## 🟢 Setup inicial

- Se creó proyecto con Expo
- Se configuró TypeScript
- Se instaló NativeWind
- Se configuró Supabase client

Decisiones:

- Se usa Expo por simplicidad
- No se usan UI kits pesados
- Habla solo lo necesario, lo menos posible

---

## 🔐 Auth - Registro

- Se implementó registro con:
  supabase.auth.signUp(email, password)

- Se agregó creación manual de profile:
  insert en tabla profiles con:
  id = auth.users.id
  name = nombre

Problemas:

- AsyncStorage error → solucionado instalando @react-native-async-storage/async-storage
- Profile no se creaba → posible RLS bloqueando

Decisiones:

- No usar Google Auth por ahora
- Crear profile desde frontend

Pendiente:

- Validaciones de formulario
- Manejo de errores UX

---

## 🏠 Home Screen - Componentes Usables

- Se implementaron componentes touchables con efectos de opacidad
- Se agregó estado para filtros y niveles seleccionados
- Se integró fetch de libros desde tabla "books" en Supabase
- Se hicieron botones de filtro, chips de nivel y tarjetas de libro interactivas
- Se agregó onPress placeholder para futuras funcionalidades

Problemas resueltos:

- Componentes eran estáticos, ahora son touchables con feedback visual
- Data era mock, ahora se obtiene de base de datos

Decisiones tomadas:

- Usar TouchableOpacity para efectos simples
- Mantener estilos existentes pero agregar interactividad
- Asumir estructura de tabla books basada en mock data
- Agregar console.log en onPress para testing

---

- Mejorar UI

---

## 🧠 Base de Datos

- Tablas creadas:
  - profiles
  - books
  - book_pages
  - page_content
  - user_books
  - categories
  - book_tags

Decisiones:

- Soporte multi idioma en page_content
- Relaciones normalizadas

---

## ⚠️ Problemas conocidos

- RLS puede bloquear inserts en profiles
- Confirmación de email puede hacer user null
- AsyncStorage necesario en React Native

---

## 🚀 Próximos pasos

- Login persistente
- Mostrar libros
- Reader (páginas)
- Guardar progreso
- Sistema de XP

---

## 🧩 Notas rápidas

- user_id SIEMPRE = auth.users.id
- profiles no se crean automáticamente
- usar async/await siempre

---

## 🧠 Cómo usar este log

- Agregar una sección por feature
- Registrar errores importantes
- Documentar decisiones
- Mantenerlo corto y claro

---

## Auth - Profiles RLS

- Se detecto que el error al guardar profiles viene de RLS en Supabase.
- Para crear profile desde frontend se requiere policy INSERT con auth.uid() = id.
- Se mantiene display_name/name en auth metadata durante signUp.

SQL necesario:

```sql
alter table public.profiles enable row level security;

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);
```

---

## Expo Assets

- Se quitaron referencias rotas a assets/images en app.json.
- El proyecto no tenia carpeta assets y Expo fallaba al resolver icon/splash/favicon.

---

## Auth - Login

- Se agrego modo Ingresar en la pantalla de auth.
- Login usa supabase.auth.signInWithPassword con email/password.
- La navegacion a Home depende de la sesion escuchada en App.tsx.

---

## AuthScreen

- Se renombro RegisterScreen a AuthScreen.
- App.tsx ahora monta Auth cuando no hay sesion.

---

## Home UI

- Se rehizo HomeScreen como dashboard visual tipo lectura.
- Se agregaron buscador, categorias, progreso, filtros, libros recomendados y barra inferior.
- Se usa profile.name real si existe; el resto de datos queda mock temporal.

## Estabilizacion render y tipos

- Se elimino flujo legacy de App.tsx que referenciaba modulos inexistentes; ahora no interfiere con Expo Router.
- Se corrigio ookStore para cargar libros con progreso desde Supabase usando el modelo real (books, user_books, categories, tags).
- Se alineo pp/(app)/home.tsx con los campos tipados reales ( otalPages, estimatedMinutes, xp, progress, currentPage, status) y se restauro ancho de barra de progreso.
- Se corrigio BookCompletedScreen para evitar prop invalida de Lottie (pointerEvents) encapsulando en View con pointerEvents=none.
- Se corrigieron dependencias de hooks en layouts/pantallas para eliminar warnings de lint y evitar efectos inconsistentes.
- Validacion final:
  px tsc --noEmit y
  pm run lint sin errores ni warnings.

## Perfil: carga completa de datos

- Se alineo la carga de perfil con el modelo de BD: ahora se trae user_books, reading_sessions, xp_events y trofeos al entrar a perfil.
- Se agrego fetchUserBooks en useInitApp para que stats de completados/leyendo no queden vacios.
- Se creo hook useProfileBootstrap con recarga en focus de pantalla: fetchUserBooks, fetchSessions, fetchXpEvents, checkTrophies y fetchTrophies.
- Se conecto useProfileBootstrap en profile.tsx con indicador de carga ligero para evitar UI incompleta mientras sincroniza.
- Validacion: tsc y lint sin errores.
