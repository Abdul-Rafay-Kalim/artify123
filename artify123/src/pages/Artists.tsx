import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Palette } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface ArtistProfile {
  id: string;
  artist_name: string;
  bio: string | null;
  introduction: string | null;
  specialties: string[] | null;
  avatar_url: string | null;
}

const Artists = () => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await supabase
        .from("artist_profiles" as any)
        .select("*")
        .order("created_at", { ascending: false });
      setArtists((data as any) || []);
      setLoading(false);
    };
    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Artists
            </h1>
            <p className="text-muted-foreground mt-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.25s" }}>
              Meet the creators behind the art.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-20">
              <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No artists have joined yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Be the first to create your artist profile!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist, i) => (
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      {artist.avatar_url ? (
                        <img src={artist.avatar_url} alt={artist.artist_name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Palette className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                        {artist.artist_name}
                      </h3>
                    </div>
                  </div>

                  {artist.specialties && artist.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {artist.specialties.slice(0, 3).map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  )}

                  {artist.introduction && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{artist.introduction}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Artists;
