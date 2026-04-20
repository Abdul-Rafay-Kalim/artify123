import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Palette, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface ArtistProfile {
  id: string;
  user_id: string;
  artist_name: string;
  bio: string | null;
  introduction: string | null;
  specialties: string[] | null;
  avatar_url: string | null;
}

interface ListedArtwork {
  id: string;
  title: string;
  artist_name: string;
  image_url: string | null;
  price: number;
  genre: string | null;
  medium: string | null;
}

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [artworks, setArtworks] = useState<ListedArtwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      const { data } = await supabase
        .from("artist_profiles" as any)
        .select("*")
        .eq("id", id)
        .single();
      setArtist(data as any);

      if (data) {
        const { data: arts } = await supabase
          .from("listed_artworks" as any)
          .select("*")
          .eq("seller_id", (data as any).user_id);
        setArtworks((arts as any) || []);
      }
      setLoading(false);
    };
    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 container mx-auto px-4 md:px-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-40 w-full mb-6" />
          <Skeleton className="h-6 w-32" />
        </main>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground">Artist not found</h1>
          <Link to="/artists">
            <Button variant="outline" className="mt-6">Browse Artists</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <Link to="/artists">
            <Button variant="ghost" size="sm" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" /> All Artists
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start gap-6 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center shrink-0">
                {artist.avatar_url ? (
                  <img src={artist.avatar_url} alt={artist.artist_name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Palette className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{artist.artist_name}</h1>
                {artist.specialties && artist.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {artist.specialties.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Introduction */}
            {artist.introduction && (
              <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Artist Introduction</span>
                </div>
                <p className="text-foreground leading-relaxed whitespace-pre-line">{artist.introduction}</p>
              </div>
            )}

            {/* Bio */}
            {artist.bio && (
              <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{artist.bio}</p>
              </div>
            )}

            <Separator className="my-8" />

            {/* Artworks */}
            <section className="opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                Works by {artist.artist_name}
              </h2>
              {artworks.length === 0 ? (
                <p className="text-muted-foreground">No artworks listed yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artworks.map((art) => (
                    <Link key={art.id} to={`/art/listed-${art.id}`} className="group">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-secondary">
                        {art.image_url ? (
                          <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Palette className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-serif font-semibold text-foreground truncate">{art.title}</h3>
                      <p className="text-sm text-muted-foreground">{art.medium} · {art.genre}</p>
                      <p className="text-sm font-medium text-foreground mt-1">PKR {Number(art.price).toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtistProfile;
