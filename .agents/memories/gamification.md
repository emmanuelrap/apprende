# Gamificación

## XP
Fuentes de XP: sesiones de lectura, completar libros, ganar trofeos, completar recorridos.
Almacenado en `xp_events` y `profiles.xp`.

## Niveles
Tabla `levels` con `xp_required` por nivel. Títulos por nivel.
Cálculo en `gamificationStore.computeLevel()`.

## Trofeos
Definidos en `trophies` con:
- `condition_type`: `xp_reached` | `books_completed`
- `condition_value`: umbral numérico
- `xp_reward`: XP que otorga al obtenerse
- `rarity`: común, raro, épico, legendario

Los trofeos se verifican en:
1. `useInitApp` (al iniciar)
2. Al completar un libro
3. Al focus del perfil

## Recorridos (Learning Paths)
- Secuencia de libros con orden y requisitos
- `user_recorridos.status`: not_started → in_progress → completed
- `min_level` para desbloquear
- Otorgan XP al completarse
