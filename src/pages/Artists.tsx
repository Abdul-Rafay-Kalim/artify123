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
  isListingOnly?: boolean;
}

const blockedArtistNames = new Set(["abc"]);
const abdulRafayAiImages = [
  "/WhatsApp%20Image%202026-04-12%20at%2012.55.17%20AM1.jpeg",
  "/WhatsApp%20Image%202026-04-12%20at%2012.55.17%20AM2.jpeg",
  "/6.jpeg",
];

const Artists = () => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data: profileData } = await supabase
        .from("artist_profiles" as any)
        .select("*")
        .order("created_at", { ascending: false });

      const profiles = (((profileData as any) || []) as ArtistProfile[]).filter((artist) => {
        const key = (artist.artist_name || "").trim().toLowerCase();
        return !blockedArtistNames.has(key);
      });
      const profileNames = new Set(profiles.map((artist) => artist.artist_name.trim().toLowerCase()));

      const { data: listedData } = await supabase
        .from("listed_artworks" as any)
        .select("artist_name")
        .order("created_at", { ascending: false });

      const listingOnlyArtists: ArtistProfile[] = [];
      const seenListingOnly = new Set<string>();

      for (const row of (listedData as any[]) || []) {
        const name = (row?.artist_name || "").trim();
        if (!name) continue;
        const key = name.toLowerCase();
        if (profileNames.has(key) || seenListingOnly.has(key) || blockedArtistNames.has(key)) continue;
        seenListingOnly.add(key);
        listingOnlyArtists.push({
          id: `listed-artist-${key.replace(/[^a-z0-9]+/g, "-")}`,
          artist_name: name,
          bio: null,
          introduction: "Featured from latest listed artworks.",
          specialties: null,
          avatar_url: null,
          isListingOnly: true,
        });
      }

      setArtists([...profiles, ...listingOnlyArtists]);
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
            <h1 className="page-title font-serif font-bold text-foreground opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
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
              {artists.map((artist, i) => {
                const cardClass = "group bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 opacity-0 animate-fade-in";
                const cardStyle = { animationDelay: `${0.1 + i * 0.1}s` };
                const isAbdulRafay = artist.artist_name.trim().toLowerCase() === "abdul rafay";
                const artistImage = isAbdulRafay
                  ? abdulRafayAiImages[i % abdulRafayAiImages.length]
                  : artist.avatar_url;

                const cardContent = (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        {artistImage ? (
                          <img src={artistImage} alt={artist.artist_name} className="w-full h-full rounded-full object-cover" />
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
                  </>
                );

                if (artist.isListingOnly) {
                  return (
                    <Link
                      key={artist.id}
                      to={`/explore?search=${encodeURIComponent(artist.artist_name)}`}
                      className={cardClass}
                      style={cardStyle}
                    >
                      {cardContent}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={artist.id}
                    to={`/artist/${artist.id}`}
                    className={cardClass}
                    style={cardStyle}
                  >
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Artists;
