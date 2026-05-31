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

- Profile se crea automáticamente vía trigger DB (handle_new_user)
  No hay INSERT manual desde frontend.

Problemas:

- AsyncStorage error → solucionado instalando @react-native-async-storage/async-storage

Decisiones:

- No usar Google Auth por ahora
- Profile creation delegado al trigger DB, no al frontend

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
- profiles se crean automáticamente vía trigger DB
- usar async/await siempre

---

## 🧠 Cómo usar este log

- Agregar una sección por feature
- Registrar errores importantes
- Documentar decisiones
- Mantenerlo corto y claro

---

## Auth - Profiles RLS

- Se configuro RLS con policy SELECT para que usuario solo vea su propio profile.
- No se usa policy INSERT desde frontend porque el profile lo crea el trigger DB (handle_new_user).
- El trigger se ejecuta con permisos de owner, evitando RLS.
- Se mantiene name en auth metadata durante signUp para que el trigger lo use.

---

## Expo Assets

- Se quitaron referencias rotas a assets/images en app.json.
- El proyecto no tenia carpeta assets y Expo fallaba al resolver icon/splash/favicon.

---

## Auth - Login

- Se agrego modo Ingresar en la pantalla de auth.
- Login usa supabase.auth.signInWithPassword con email/password.
- La navegacion a Home depende de la sesion manejada por Expo Router en app/(app)/_layout.tsx.

---

## AuthScreen

- Se renombro RegisterScreen a AuthScreen.
- Expo Router maneja el ruteo: app/(auth)/ cuando no hay sesion, app/(app)/ cuando hay sesion.

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
- Se creo hook useProfileBootstrap con recarga en focus de pantalla: fetchUserBooks, fetchSessions, fetchXpEvents y fetchTrophies.
- checkTrophies se ejecuta en useInitApp, no en useProfileBootstrap.
- Se conecto useProfileBootstrap en profile.tsx con indicador de carga ligero para evitar UI incompleta mientras sincroniza.
- Validacion: tsc y lint sin errores.

---

## 🎧 Audio por página

- Se agrego columna audio_url a page_content.
- Cada página/idioma tendrá su propio archivo de audio.
- Se descarto tabla page_paragraphs por simplicidad.

---

## 🔒 Bloqueo de libros por nivel

- Se agregó columna `min_level` (int, nullable) a `books` en Supabase.
- Si `min_level` está seteado (ej: 3), solo usuarios con nivel ≥ 3 pueden leer el libro.
- Admin form: nuevo selector de nivel mínimo requerido al crear/editar libro.
- BookCard: muestra badge "🔒 Necesitas nivel N+" si el usuario no cumple.
- BookCard: se atenúa visualmente y el `onPress` no navega si está bloqueado.
- El nivel del usuario se calcula con la misma función `getLevel(xp)` de ProfileCard (umbrales: 0/500/1000/2000/3000/5000 XP).
