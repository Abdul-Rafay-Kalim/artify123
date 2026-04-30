import { Crown, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useLikedArtworks } from "@/contexts/LikedContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { supabase } from "@/integrations/supabase/client";
import galleryInterior from "@/assets/gallery-interior.jpg";
import artCharcoal from "@/assets/art-charcoal.jpg";

interface ArtworkCard {
  id: string;
  title: string;
  artist: string;
  image: string;
  description: string;
  edition: string;
  medium: string;
  price: string;
  badge: string;
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

const featuredArtworks: ArtworkCard[] = [
  {
    id: "gallery-gallery-moment",
    title: "Gallery Moment",
    artist: "Alex Moore",
    image: galleryInterior,
    description:
      "Creating immersive digital compositions that explore identity, emotion, and abstraction through color and form.",
    edition: "2 of 8",
    medium: "Digital - Mixed Media",
    price: "PKR 1,200",
    badge: "Featured Artist",
  },
  {
    id: "gallery-fragments-of-light",
    title: "Fragments of Light",
    artist: "Daniel Cruz",
    image: artCharcoal,
    description:
      "A limited digital piece exploring movement, light, and layered emotion in a contemporary digital form.",
    edition: "1 of 5",
    medium: "Digital - 3D",
    price: "PKR 1,750",
    badge: "Featured Artist",
  },
];

const ArtworksGrid = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { isLiked, toggleLike } = useLikedArtworks();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { ensureArtworkRecord, getArtworkStatus, getAvailableQuantity, isPurchasable } = useInventory();
  const [listedArtworks, setListedArtworks] = useState<ArtworkCard[]>([]);

  useEffect(() => {
    const fetchListedArtworks = async () => {
      const { data } = await supabase
        .from("listed_artworks" as any)
        .select("id,title,artist_name,image_url,description,medium,price,created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!data) return;

      const mapped: ArtworkCard[] = (data as any[])
        .filter((item) => {
          if (!item.title || !item.artist_name) return false;
          const titleKey = normalizeText(String(item.title));
          const artistKey = String(item.artist_name).trim().toLowerCase();
          const isBlockedTitle = Array.from(blockedArtworkTitles).some((blocked) => normalizeText(blocked) === titleKey);
          return !isBlockedTitle && !blockedArtistNames.has(artistKey);
        })
        .map((item) => ({
          id: `listed-${item.id}`,
          title: item.title,
          artist: item.artist_name,
          image: item.image_url || "",
          description: item.description || "Recently listed by this artist.",
          edition: "Open edition",
          medium: item.medium || "Mixed Media",
          price: `PKR ${Number(item.price || 0).toLocaleString()}`,
          badge: "Latest Listing",
          href: `/art/listed-${item.id}`,
          createdAt: item.created_at || undefined,
        }));

      setListedArtworks(mapped);
    };

    fetchListedArtworks();
  }, []);

  const latestArtworks = useMemo(() => {
    const combined = [...listedArtworks, ...featuredArtworks];
    return combined
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 2);
  }, [listedArtworks]);

  useEffect(() => {
    latestArtworks.forEach((art) => ensureArtworkRecord(art.id, 1));
  }, [latestArtworks, ensureArtworkRecord]);

  const toCartArtwork = (artwork: ArtworkCard) => ({
    id: artwork.id,
    image: artwork.image,
    title: artwork.title,
    artist: artwork.artist,
    price: Number(artwork.price.replace(/[^0-9]/g, "")),
    genre: "Featured",
    medium: artwork.medium,
    dimensions: "N/A",
    year: new Date().getFullYear(),
    description: artwork.description,
  });

  return (
    <section className="section-space border-y border-border/60 bg-secondary/40" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div
          className={`mb-4 md:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } text-center`}
        >
          <h2 className="text-xl md:text-5xl font-serif font-bold text-foreground mb-1 md:mb-2">
            Artworks Available Now
          </h2>
          <p className="text-xs md:text-base text-muted-foreground">
            Original works, ready to be lived with.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-10 mb-4 md:mb-12">
          {latestArtworks.map((artwork, i) => (
            (() => {
              const status = getArtworkStatus(artwork.id, 1);
              const available = getAvailableQuantity(artwork.id, 1);
              const canBuy = isPurchasable(artwork.id, 1);

              return (
            <div
              key={artwork.id}
              className={`group transition-all duration-700 ${i > 0 ? "hidden md:block" : ""} ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${(i + 1) * 150}ms` : "0ms",
              }}
            >
              <div className="flex h-full rounded-2xl overflow-hidden bg-gray-100">
                {/* Image */}
                <div className="relative flex-shrink-0 w-48 h-40">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                  />
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    {artwork.badge}
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-black/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {status === "sold-out" ? "Sold Out" : status === "booked" ? "Booked" : `In Stock: ${available}`}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      toggleLike({
                        id: artwork.id,
                        title: artwork.title,
                        artist: artwork.artist,
                        image: artwork.image,
                        price: artwork.price,
                        source: "Gallery",
                      })
                    }
                    className="absolute top-3 right-3 rounded-full bg-black/75 p-2 text-white transition-all hover:scale-105 hover:bg-black"
                    aria-label="Toggle like"
                  >
                    <Heart
                      className={`h-4 w-4 ${isLiked(artwork.id) ? "fill-destructive text-destructive" : "text-white"}`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-foreground mb-1">{artwork.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">by {artwork.artist}</p>
                    <p className="line-clamp-3 min-h-[3.75rem] text-xs text-muted-foreground">
                      {artwork.description}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Edition:</span>
                      <span className="font-medium text-foreground">
                        {artwork.edition}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medium:</span>
                      <span className="font-medium text-foreground">
                        {artwork.medium}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-gray-300 pt-2">
                      <div>
                        <span className="text-muted-foreground">Price: </span>
                        <span className="font-semibold text-foreground">{artwork.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={artwork.href || "/explore"}
                          className="inline-flex h-8 items-center rounded-full border border-border px-3 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                          View
                        </Link>
                        <Button
                          type="button"
                          variant={isInCart(artwork.id) ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => {
                            const cartItem = toCartArtwork(artwork);
                            if (isInCart(cartItem.id)) {
                              removeFromCart(cartItem.id);
                            } else {
                              addToCart(cartItem);
                            }
                          }}
                          disabled={!canBuy && !isInCart(artwork.id)}
                          aria-label={isInCart(artwork.id) ? "Remove from cart" : "Add to cart"}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              );
            })()
          ))}
        </div>

        {/* CTA Button */}
        <div
          className={`flex justify-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: isVisible ? "450ms" : "0ms",
          }}
        >
          <Link
            to="/explore"
            className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            View all artworks
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArtworksGrid;
