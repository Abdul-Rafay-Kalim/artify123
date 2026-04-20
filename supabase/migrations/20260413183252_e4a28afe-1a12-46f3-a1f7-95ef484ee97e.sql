
-- Add phone_number and address fields to profiles table
ALTER TABLE public.profiles ADD COLUMN phone_number TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN address_line1 TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN address_line2 TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN city TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN state TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN postal_code TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN country TEXT DEFAULT '';
