-- Add featured fields to listed_artworks
ALTER TABLE public.listed_artworks
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_listed_artworks_is_featured
  ON public.listed_artworks (is_featured, featured_until);

-- Services marketplace
CREATE TABLE IF NOT EXISTS public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  artist_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price NUMERIC NOT NULL,
  delivery_days INTEGER NOT NULL DEFAULT 7,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  featured_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Auth users can create services"
  ON public.services FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own services"
  ON public.services FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own services"
  ON public.services FOR DELETE
  USING (auth.uid() = seller_id);

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_services_is_featured
  ON public.services (is_featured, featured_until);
CREATE INDEX IF NOT EXISTS idx_services_seller
  ON public.services (seller_id);