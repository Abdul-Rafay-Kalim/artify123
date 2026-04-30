import artRose from "@/assets/art-rose.jpg";
import galleryInterior from "@/assets/gallery-interior.jpg";
import artMixedMedia from "@/assets/art-mixed-media.jpg";
import artWatercolor from "@/assets/art-watercolor.jpg";
import heroArt from "@/assets/Subtract.png";
import { useEffect, useMemo, useState } from "react";
import { useLikedArtworks } from "@/contexts/LikedContext";
import { useCart } from "@/contexts/CartContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface PickedArtwork {
  id: string;
  image: string;
  title: string;
  artist: string;
  price: string;
  href?: string;
  createdAt?: string;
}

const blockedArtistNames = new Set(["abc"]);
const blockedArtworkTitles = new Set(["abc", "mona lisa", "monalisa"]);

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const pickedArtworks: PickedArtwork[] = [
  { id: 1, image: galleryInterior, title: "Gallery Moment", artist: "Clara Dunn", price: "PKR 2,400" },
  { id: 2, image: artMixedMedia, title: "Chromatic Soul", artist: "Ava Morales", price: "PKR 1,850" },
  { id: 3, image: artWatercolor, title: "Morning Fields", artist: "Thomas Lake", price: "PKR 980" },
  { id: 4, image: heroArt, title: "Ember Portrait", artist: "Elena Vasquez", price: "PKR 3,200" },
  { id: 5, image: artRose, title: "Rose Bloom", artist: "Sofia Chen", price: "PKR 1,500" },
  { id: 6, image: artMixedMedia, title: "Abstract Dreams", artist: "James Okafor", price: "PKR 2,100" },
].map((art) => ({ ...art, id: String(art.id) }));

const CuratorPicks = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { isLiked, toggleLike } = useLikedArtworks();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [listedPicks, setListedPicks] = useState<PickedArtwork[]>([]);

  useEffect(() => {
    const fetchListedPicks = async () => {
      const { data } = await supabase
        .from("listed_artworks" as any)
        .select("id,title,artist_name,image_url,price,created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!data) return;

      const mapped: PickedArtwork[] = (data as any[])
        .filter((row) => {
          if (!row.title || !row.artist_name) return false;
          const titleKey = normalizeText(String(row.title));
          const artistKey = String(row.artist_name).trim().toLowerCase();
          const isBlockedTitle = Array.from(blockedArtworkTitles).some((blocked) => normalizeText(blocked) === titleKey);
          return !isBlockedTitle && !blockedArtistNames.has(artistKey);
        })
        .map((row) => ({
          id: `listed-${row.id}`,
          image: row.image_url || "",
          title: row.title,
          artist: row.artist_name,
          price: `PKR ${Number(row.price || 0).toLocaleString()}`,
          href: `/art/listed-${row.id}`,
          createdAt: row.created_at || undefined,
        }));

      setListedPicks(mapped);
    };

    fetchListedPicks();
  }, []);

  const carouselArtworks = useMemo(() => {
    const combined = [...listedPicks, ...pickedArtworks].filter((art) => {
      const titleKey = normalizeText(art.title || "");
      const artistKey = (art.artist || "").trim().toLowerCase();
      const isBlockedTitle = Array.from(blockedArtworkTitles).some((blocked) => normalizeText(blocked) === titleKey);
      return !isBlockedTitle && !blockedArtistNames.has(artistKey);
    });
    return combined
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 6);
  }, [listedPicks]);

  const toCartArtwork = (art: PickedArtwork) => ({
    id: `curated-${art.id}`,
    image: art.image,
    title: art.title,
    artist: art.artist,
    price: Number(art.price.replace(/[^0-9]/g, "")),
    genre: "Curated",
    medium: "Mixed Media",
    dimensions: "N/A",
    year: new Date().getFullYear(),
    description: "Curated recommendation from AI + Curator Picks.",
  });

  return (
    <section className="section-space" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <h2
          className={`text-xl md:text-5xl font-serif font-bold mb-2 md:mb-4 text-center text-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          AI + Curator Picks...
        </h2>
        <p
          className={`mx-auto mb-4 md:mb-12 max-w-lg text-center text-xs md:text-base text-muted-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
        >
          A personalized selection of art curated just for you, blending algorithmic intelligence with expert taste.
        </p>

        {/* Artworks Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
            <CarouselContent className="-ml-4">
              {carouselArtworks.map((art) => (
                <CarouselItem key={art.id} className="pl-4 basis-full md:basis-1/3">
                  <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <div className="bg-card border border-border rounded-3xl overflow-hidden h-full flex flex-col">
                      <Link to={art.href || `/art/${art.id}`} className="relative aspect-square overflow-hidden group flex-shrink-0">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleLike({
                              id: `curated-${art.id}`,
                              title: art.title,
                              artist: art.artist,
                              image: art.image,
                              price: art.price,
                              href: art.href || `/art/${art.id}`,
                              source: "Curated",
                            });
                          }}
                          className="absolute top-4 right-4 p-3 bg-foreground rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
                          aria-label="Add to favorites"
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              isLiked(`curated-${art.id}`)
                                ? "fill-destructive text-destructive"
                                : "text-background"
                            }`}
                          />
                        </button>
                      </Link>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <Link to={art.href || `/art/${art.id}`} className="group">
                          <h3 className="font-serif font-semibold text-foreground group-hover:opacity-70 transition-opacity">{art.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{art.artist}</p>
                        </Link>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">{art.price}</p>
                          <div className="flex items-center gap-2">
                            <Link
                              to={art.href || `/art/${art.id}`}
                              className="inline-flex h-9 items-center rounded-full border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                            >
                              View
                            </Link>
                            <Button
                              type="button"
                              variant={isInCart(`curated-${art.id}`) ? "default" : "outline"}
                              size="icon"
                              className="h-9 w-9 rounded-full"
                              onClick={(e) => {
                                e.preventDefault();
                                const cartItem = toCartArtwork(art);
                                if (isInCart(cartItem.id)) {
                                  removeFromCart(cartItem.id);
                                } else {
                                  addToCart(cartItem);
                                }
                              }}
                              aria-label={isInCart(`curated-${art.id}`) ? "Remove from cart" : "Add to cart"}
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-6 h-11 w-11 rounded-full border border-background/30 bg-foreground/40 text-background backdrop-blur-2xl shadow-sm transition-colors duration-200 hover:bg-black hover:text-white disabled:opacity-40" />
            <CarouselNext className="-right-4 md:-right-6 h-11 w-11 rounded-full border border-background/30 bg-foreground/40 text-background backdrop-blur-2xl shadow-sm transition-colors duration-200 hover:bg-black hover:text-white disabled:opacity-40" />
        </Carousel>
      </div>
    </section>
  );
};

export default CuratorPicks;
