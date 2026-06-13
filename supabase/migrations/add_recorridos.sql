CREATE TABLE IF NOT EXISTS recorridos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  difficulty INTEGER DEFAULT 1,
  min_level INTEGER DEFAULT 1,
  estimated_minutes INTEGER,
  xp_reward INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recorrido_books (
  recorrido_id UUID NOT NULL REFERENCES recorridos(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  required BOOLEAN DEFAULT true,
  PRIMARY KEY (recorrido_id, book_id)
);

CREATE TABLE IF NOT EXISTS user_recorridos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recorrido_id UUID NOT NULL REFERENCES recorridos(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started',
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  UNIQUE (user_id, recorrido_id)
);

CREATE INDEX idx_recorrido_books_recorrido ON recorrido_books(recorrido_id);
CREATE INDEX idx_recorrido_books_book ON recorrido_books(book_id);
CREATE INDEX idx_user_recorridos_user ON user_recorridos(user_id);
CREATE INDEX idx_user_recorridos_recorrido ON user_recorridos(recorrido_id);
