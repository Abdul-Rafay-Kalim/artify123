
-- Artist profiles table
CREATE TABLE public.artist_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_name TEXT NOT NULL,
  bio TEXT,
  introduction TEXT,
  specialties TEXT[],
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view artist profiles" ON public.artist_profiles FOR SELECT USING (true);
CREATE POLICY "Auth users can create artist profile" ON public.artist_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own artist profile" ON public.artist_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own artist profile" ON public.artist_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_artist_profiles_updated_at
  BEFORE UPDATE ON public.artist_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Listed artworks table
CREATE TABLE public.listed_artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC NOT NULL CHECK (price > 0),
  genre TEXT,
  medium TEXT,
  dimensions TEXT,
  year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.listed_artworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listed artworks" ON public.listed_artworks FOR SELECT USING (true);
CREATE POLICY "Auth users can list artworks" ON public.listed_artworks FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own listings" ON public.listed_artworks FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own listings" ON public.listed_artworks FOR DELETE USING (auth.uid() = seller_id);

CREATE TRIGGER update_listed_artworks_updated_at
  BEFORE UPDATE ON public.listed_artworks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
