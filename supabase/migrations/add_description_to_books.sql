-- Agrega la columna description a la tabla books
-- Copia y pega esto en el SQL Editor de Supabase

ALTER TABLE books
ADD COLUMN description TEXT;

-- Opcional: actualizar la descripción de libros existentes
-- UPDATE books SET description = '...' WHERE id = '...';
