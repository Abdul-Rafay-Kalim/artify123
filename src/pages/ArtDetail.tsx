import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, Share2, Palette, MessageCircle, Truck, RotateCcw, ShieldCheck, Leaf } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { artworks } from "@/data/artworks";
import { useCart } from "@/contexts/CartContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

interface ArtworkData {
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
  seller_id?: string;
}

const ArtDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { ensureArtworkRecord, getArtworkStatus, getAvailableQuantity, isPurchasable } = useInventory();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState<ArtworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chattingWith, setChattingWith] = useState<string | null>(null);
  const isListed = id?.startsWith("listed-");

  const handleChatWithSeller = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!artwork) return;

    try {
      // Check if conversation already exists
      const { data: existingConv, error: fetchError } = await (supabase as any)
        .from("conversations")
        .select("id")
        .eq("artwork_id", artwork.id)
        .eq("buyer_id", user.id)
        .eq("seller_id", chattingWith!)
        .single();

      if (existingConv && !fetchError) {
        // Conversation exists, navigate to messages
        navigate("/messages");
        return;
      }

      // Create new conversation
      const { data: newConv, error: createError } = await (supabase as any)
        .from("conversations")
        .insert({
          artwork_id: artwork.id,
          buyer_id: user.id,
          seller_id: chattingWith,
        })
        .select()
        .single();

      if (createError && createError.code !== "23505") {
        // 23505 is unique violation, meaning conversation already exists
        throw createError;
      }

      navigate("/messages");
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  useEffect(() => {
    const fetchArtwork = async () => {
      if (isListed && id) {
        const dbId = id.replace("listed-", "");
        const { data } = await supabase
          .from("listed_artworks" as any)
          .select("*")
          .eq("id", dbId)
          .single();
        if (data) {
          const d = data as any;
          const artwork = {
            id: `listed-${d.id}`,
            image: d.image_url || "",
            title: d.title,
            artist: d.artist_name,
            price: Number(d.price),
            genre: d.genre || "Other",
            medium: d.medium || "Other",
            dimensions: d.dimensions || "",
            year: d.year || new Date().getFullYear(),
            description: d.description || "",
            seller_id: d.seller_id || "",
          };
          setArtwork(artwork);
          setChattingWith(artwork.seller_id || null);
        }
      } else {
        const found = artworks.find((a) => a.id === id);
        if (found) {
          // For mock artworks, create a stable seller ID based on artist name
          const sellerId = `artist-${found.id}`;
          setArtwork({ ...found, seller_id: sellerId });
          setChattingWith(sellerId);
        }
      }
      setLoading(false);
    };
    fetchArtwork();
  }, [id, isListed]);

  useEffect(() => {
    if (artwork) {
      ensureArtworkRecord(artwork.id, 1);
    }
  }, [artwork, ensureArtworkRecord]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="aspect-[3/4] rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 container mx-auto px-4 text-center">
          <h1 className="page-title font-serif font-bold text-foreground">Artwork not found</h1>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/explore")}>
            Back to Explore
          </Button>
        </main>
      </div>
    );
  }

  const related = artworks
    .filter((a) => a.id !== artwork.id && (a.genre === artwork.genre || a.artist === artwork.artist))
    .slice(0, 3);

  const stockStatus = getArtworkStatus(artwork.id, 1);
  const availableQuantity = getAvailableQuantity(artwork.id, 1);
  const canBuy = isPurchasable(artwork.id, 1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-sm font-medium text-foreground/65">Product Detail</p>

          <div className="mt-4 rounded-[1.6rem] border border-border/70 bg-[#f4f4f4] p-4 md:p-6">
            <div className="mb-4 flex items-center gap-2 text-xs text-foreground/55">
              <Button variant="ghost" size="sm" className="h-7 px-2 gap-1" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
              <span>/</span>
              <span>Home</span>
              <span>/</span>
              <span>Collection</span>
              <span>/</span>
              <span className="text-foreground/80">{artwork.title}</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <section>
                <div className="aspect-[4/3.75] overflow-hidden rounded-2xl bg-secondary">
                  {artwork.image ? (
                    <img src={artwork.image} alt={artwork.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Palette className="h-14 w-14 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <Tabs defaultValue="about" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2 rounded-full bg-white">
                    <TabsTrigger value="about" className="rounded-full">About this work</TabsTrigger>
                    <TabsTrigger value="insights" className="rounded-full">Insights</TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="rounded-xl border border-border/60 bg-white p-4 text-sm text-foreground/75">
                    {artwork.description}
                  </TabsContent>
                  <TabsContent value="insights" className="rounded-xl border border-border/60 bg-white p-4 text-sm text-foreground/75">
                    A quiet exploration of depth, atmosphere, and emotional resonance. The composition balances texture with soft tonal gradients, creating a meditative focal point.
                  </TabsContent>
                </Tabs>
              </section>

              <aside className="rounded-2xl border border-border/60 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-4xl font-serif font-bold leading-[1.02] text-foreground">{artwork.title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{artwork.artist}</p>
                  </div>
                  <Badge variant="secondary">{artwork.genre}</Badge>
                </div>

                <p className="mt-3 text-3xl font-bold text-foreground">PKR {artwork.price.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stockStatus === "sold-out"
                    ? "Sold Out"
                    : stockStatus === "booked"
                      ? "Booked (pending verification)"
                      : `In Stock: ${availableQuantity}`}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">Authenticity Included</div>
                  <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-right">1 of 1 Edition</div>
                </div>

                <Button
                  className="mt-4 w-full h-11"
                  variant={isInCart(artwork.id) ? "secondary" : "default"}
                  onClick={() => (isInCart(artwork.id) ? removeFromCart(artwork.id) : addToCart(artwork))}
                  disabled={!canBuy && !isInCart(artwork.id)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isInCart(artwork.id)
                    ? "Remove from Cart"
                    : !canBuy
                      ? "Unavailable"
                      : "Add to Cart"}
                </Button>

                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="icon" aria-label="Share" title="Share">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Chat with seller" title="Chat with seller" onClick={handleChatWithSeller}>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>

                <Separator className="my-5" />

                <div className="space-y-2 text-sm text-foreground/75">
                  <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-foreground/70" /> Worldwide shipping available</p>
                  <p className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-foreground/70" /> Easy returns on transit damage</p>
                  <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-foreground/70" /> Certificate of authenticity included</p>
                  <p className="flex items-center gap-2"><Leaf className="h-4 w-4 text-foreground/70" /> Sustainable packaging practice</p>
                </div>

                <Separator className="my-5" />

                <div className="space-y-2 text-sm">
                  <h3 className="font-serif text-xl font-semibold text-foreground">Artwork Details</h3>
                  <div className="grid grid-cols-2 gap-y-1 text-muted-foreground">
                    <span>Artist</span><span className="text-right text-foreground">{artwork.artist}</span>
                    <span>Medium</span><span className="text-right text-foreground">{artwork.medium}</span>
                    <span>Dimensions</span><span className="text-right text-foreground">{artwork.dimensions || "N/A"}</span>
                    <span>Year</span><span className="text-right text-foreground">{artwork.year}</span>
                    <span>Genre</span><span className="text-right text-foreground">{artwork.genre}</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-5">Recommended Art</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {related.map((art) => (
                  <Link key={art.id} to={`/art/${art.id}`} className="group rounded-2xl border border-border/70 bg-[#f7f7f7] p-3">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl">
                      <img src={art.image} alt={art.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                    <h3 className="mt-3 font-serif text-xl font-semibold text-foreground">{art.title}</h3>
                    <p className="text-sm text-muted-foreground">{art.artist}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">PKR {art.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtDetail;
