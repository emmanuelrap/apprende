-- ============================================================
-- Core Schema (idempotent — safe to run if tables already exist)
-- ============================================================

-- Enable pg_trgm for full-text search indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT now()
);

-- Books
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  total_pages INTEGER,
  difficulty INTEGER,
  estimated_minutes INTEGER,
  xp_base INTEGER DEFAULT 10,
  min_level INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Book pages
CREATE TABLE IF NOT EXISTS public.book_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL
);

-- Page content (bilingual)
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.book_pages(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  content TEXT,
  audio_url TEXT DEFAULT NULL
);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Book-Category junction
CREATE TABLE IF NOT EXISTS public.book_categories (
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);

-- Tags
CREATE TABLE IF NOT EXISTS public.book_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Book-Tag junction
CREATE TABLE IF NOT EXISTS public.book_tag_relations (
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.book_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, tag_id)
);

-- User books (reading progress)
CREATE TABLE IF NOT EXISTS public.user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'reading',
  started_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  UNIQUE (user_id, book_id)
);

-- Reading sessions
CREATE TABLE IF NOT EXISTS public.reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  minutes INTEGER,
  pages INTEGER,
  xp INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

-- XP events log
CREATE TABLE IF NOT EXISTS public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER,
  source TEXT,
  reference_id UUID,
  created_at TIMESTAMP DEFAULT now()
);

-- Levels
CREATE TABLE IF NOT EXISTS public.levels (
  level INTEGER PRIMARY KEY,
  xp_required INTEGER NOT NULL,
  title TEXT
);

-- Trophies
CREATE TABLE IF NOT EXISTS public.trophies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  rarity TEXT DEFAULT 'common',
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- User trophies (earned)
CREATE TABLE IF NOT EXISTS public.user_trophies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  trophy_id UUID REFERENCES public.trophies(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT now()
);

-- Review items (vocabulary)
CREATE TABLE IF NOT EXISTS public.review_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  page_id UUID REFERENCES public.book_pages(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  translation TEXT,
  context TEXT,
  next_review_at TIMESTAMP,
  review_count INTEGER DEFAULT 0,
  mastery INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- User favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Book reviews
CREATE TABLE IF NOT EXISTS public.book_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  rating NUMERIC NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Videos
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  language TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Book vocabulary (pre-defined)
CREATE TABLE IF NOT EXISTS public.book_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  word_es TEXT NOT NULL,
  word_en TEXT NOT NULL,
  level TEXT DEFAULT 'A1',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Indexes for common queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_book_pages_book_id ON public.book_pages(book_id);
CREATE INDEX IF NOT EXISTS idx_page_content_page_id ON public.page_content(page_id);
CREATE INDEX IF NOT EXISTS idx_user_books_user_id ON public.user_books(user_id);
CREATE INDEX IF NOT EXISTS idx_user_books_book_id ON public.user_books(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_id ON public.reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_user_id ON public.xp_events(user_id);
CREATE INDEX IF NOT EXISTS idx_review_items_user_id ON public.review_items(user_id);

-- ============================================================
-- Row Level Security Policies
-- ============================================================

-- Helper: enable RLS on all tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'profiles', 'books', 'book_pages', 'page_content',
      'user_books', 'reading_sessions', 'xp_events',
      'categories', 'book_categories', 'book_tags', 'book_tag_relations',
      'levels', 'trophies', 'user_trophies',
      'review_items', 'videos', 'book_vocabulary',
      'user_favorites', 'book_reviews'
    ])
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
  END LOOP;
END $$;

-- 1. Profiles: own profile only
DROP POLICY IF EXISTS "profiles_self" ON public.profiles;
CREATE POLICY profiles_self ON public.profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. Public read for books, categories, tags, levels, trophies, videos
DROP POLICY IF EXISTS "books_read" ON public.books;
CREATE POLICY books_read ON public.books FOR SELECT USING (true);

DROP POLICY IF EXISTS "categories_read" ON public.categories;
CREATE POLICY categories_read ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "book_tags_read" ON public.book_tags;
CREATE POLICY book_tags_read ON public.book_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "book_categories_read" ON public.book_categories;
CREATE POLICY book_categories_read ON public.book_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "book_tag_relations_read" ON public.book_tag_relations;
CREATE POLICY book_tag_relations_read ON public.book_tag_relations FOR SELECT USING (true);

DROP POLICY IF EXISTS "levels_read" ON public.levels;
CREATE POLICY levels_read ON public.levels FOR SELECT USING (true);

DROP POLICY IF EXISTS "trophies_read" ON public.trophies;
CREATE POLICY trophies_read ON public.trophies FOR SELECT USING (true);

DROP POLICY IF EXISTS "videos_read" ON public.videos;
CREATE POLICY videos_read ON public.videos FOR SELECT USING (true);

DROP POLICY IF EXISTS "book_vocabulary_read" ON public.book_vocabulary;
CREATE POLICY book_vocabulary_read ON public.book_vocabulary FOR SELECT USING (true);

-- 3. Book pages and content: public read
DROP POLICY IF EXISTS "book_pages_read" ON public.book_pages;
CREATE POLICY book_pages_read ON public.book_pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "page_content_read" ON public.page_content;
CREATE POLICY page_content_read ON public.page_content FOR SELECT USING (true);

-- 4. User-owned data
DROP POLICY IF EXISTS "user_books_self" ON public.user_books;
CREATE POLICY user_books_self ON public.user_books
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reading_sessions_self" ON public.reading_sessions;
CREATE POLICY reading_sessions_self ON public.reading_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "xp_events_self" ON public.xp_events;
CREATE POLICY xp_events_self ON public.xp_events
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_trophies_self" ON public.user_trophies;
CREATE POLICY user_trophies_self ON public.user_trophies
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "review_items_self" ON public.review_items;
CREATE POLICY review_items_self ON public.review_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_favorites_self" ON public.user_favorites;
CREATE POLICY user_favorites_self ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "book_reviews_self" ON public.book_reviews;
CREATE POLICY book_reviews_self ON public.book_reviews
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. Book reviews: public read
DROP POLICY IF EXISTS "book_reviews_read" ON public.book_reviews;
CREATE POLICY book_reviews_read ON public.book_reviews FOR SELECT USING (true);
