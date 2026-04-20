import galleryInterior from "@/assets/gallery-interior.jpg";
import artMixedMedia from "@/assets/art-mixed-media.jpg";
import artWatercolor from "@/assets/art-watercolor.jpg";
import heroArt from "@/assets/hero-art.png";
import artAbstract from "@/assets/art-abstract.jpg";
import artCharcoal from "@/assets/art-charcoal.jpg";
import artCityscape from "@/assets/art-cityscape.jpg";
import artRose from "@/assets/art-rose.jpg";
import artSculpture from "@/assets/art-sculpture.jpg";

export interface Artwork {
  id: string;
  image: string;
  title: string;
  artist: string;
  price: number;
  genre: string;
  medium: string;
  dimensions: string;
  year: number;
  description: string;
}

export const artworks: Artwork[] = [
  {
    id: "1",
    image: galleryInterior,
    title: "Gallery Moment",
    artist: "Clara Dunn",
    price: 2400,
    genre: "Contemporary",
    medium: "Photography",
    dimensions: '24" × 36"',
    year: 2024,
    description:
      "A contemplative photograph capturing the quiet intimacy between viewer and artwork. The interplay of natural light and gallery architecture creates a meditative atmosphere.",
  },
  {
    id: "2",
    image: artMixedMedia,
    title: "Chromatic Soul",
    artist: "Ava Morales",
    price: 1850,
    genre: "Abstract",
    medium: "Mixed Media",
    dimensions: '30" × 40"',
    year: 2023,
    description:
      "Vibrant layers of acrylic and collage merge to form an expressive landscape of emotion. Each viewing reveals new textures and hidden details.",
  },
  {
    id: "3",
    image: artWatercolor,
    title: "Morning Fields",
    artist: "Thomas Lake",
    price: 980,
    genre: "Landscape",
    medium: "Watercolor",
    dimensions: '18" × 24"',
    year: 2024,
    description:
      "Delicate washes of color evoke the first light of dawn over rolling meadows. A masterclass in restraint and atmospheric perspective.",
  },
  {
    id: "4",
    image: heroArt,
    title: "Ember Portrait",
    artist: "Elena Vasquez",
    price: 3200,
    genre: "Portrait",
    medium: "Oil on Canvas",
    dimensions: '36" × 48"',
    year: 2023,
    description:
      "A striking portrait rendered in warm, glowing tones. The subject's gaze holds a quiet intensity that draws the viewer into an unspoken narrative.",
  },
  {
    id: "5",
    image: artAbstract,
    title: "Fractured Light",
    artist: "Kai Nishimura",
    price: 4500,
    genre: "Abstract",
    medium: "Acrylic on Canvas",
    dimensions: '48" × 60"',
    year: 2024,
    description:
      "Bold geometric forms shatter and reassemble in a dance of light and shadow. This large-scale work commands attention and transforms any space.",
  },
  {
    id: "6",
    image: artCharcoal,
    title: "Silent Study",
    artist: "Marcus Webb",
    price: 750,
    genre: "Portrait",
    medium: "Charcoal",
    dimensions: '16" × 20"',
    year: 2022,
    description:
      "An intimate charcoal drawing that captures the quiet strength of its subject. The artist's masterful use of light and shadow creates remarkable depth.",
  },
  {
    id: "7",
    image: artCityscape,
    title: "Urban Pulse",
    artist: "Lina Park",
    price: 2100,
    genre: "Landscape",
    medium: "Digital Art",
    dimensions: '30" × 20"',
    year: 2024,
    description:
      "A dynamic cityscape that captures the energy and rhythm of metropolitan life. Layers of detail reward extended viewing.",
  },
  {
    id: "8",
    image: artRose,
    title: "Bloom in Silence",
    artist: "Sophie Laurent",
    price: 1200,
    genre: "Still Life",
    medium: "Oil on Canvas",
    dimensions: '20" × 24"',
    year: 2023,
    description:
      "A luminous still life that elevates a single rose to the sublime. Rich color and delicate brushwork create an almost tactile experience.",
  },
  {
    id: "9",
    image: artSculpture,
    title: "Form & Void",
    artist: "David Okafor",
    price: 5800,
    genre: "Contemporary",
    medium: "Sculpture",
    dimensions: '18" × 12" × 12"',
    year: 2024,
    description:
      "A striking sculptural work that explores the tension between presence and absence. The organic forms seem to emerge from — and dissolve back into — space itself.",
  },
];

export const genres = [...new Set(artworks.map((a) => a.genre))];
export const mediums = [...new Set(artworks.map((a) => a.medium))];
export const artists = [...new Set(artworks.map((a) => a.artist))];
