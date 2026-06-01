CREATE TABLE IF NOT EXISTS book_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  word_es TEXT NOT NULL,
  word_en TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'A1',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_book_vocabulary_book_id ON book_vocabulary(book_id);
