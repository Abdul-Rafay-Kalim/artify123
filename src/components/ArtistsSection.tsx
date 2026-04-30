import { ArrowRight, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import artistStudio from "@/assets/artist-studio.jpg";
import artistPainting from "@/assets/artist-painting.jpg";
import artRose from "@/assets/art-rose.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface FeaturedArtist {
  id: string;
  image: string;
  name: string;
  bio: string;
  href: string;
}

const blockedArtistNames = new Set(["abc"]);
const abdulRafayAiImages = [
  "/WhatsApp%20Image%202026-04-12%20at%2012.55.17%20AM2.jpeg",
  "/6.jpeg",
  "/WhatsApp%20Image%202026-04-12%20at%2012.55.17%20AM1.jpeg",
];

const fallbackArtists: FeaturedArtist[] = [
  {
    id: "fallback-sofia-chen",
    image: artistStudio,
    name: "Sofia Chen",
    bio: "Exploring the intersection of nature and identity through mixed media installations.",
    href: "/artists",
  },
  {
    id: "fallback-james-okafor",
    image: artistPainting,
    name: "James Okafor",
    bio: "Bold brushwork that captures raw emotion in everyday urban landscapes.",
    href: "/artists",
  },
  {
    id: "fallback-maria-torres",
    image: artRose,
    name: "Maria Torres",
    bio: "Delicate botanical studies that celebrate the fleeting beauty of nature.",
    href: "/artists",
  },
];

const ArtistsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [artists, setArtists] = useState<FeaturedArtist[]>(fallbackArtists);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await supabase
        .from("artist_profiles" as any)
        .select("id,artist_name,bio,introduction,avatar_url,created_at")
        .order("created_at", { ascending: false })
        .limit(9);

      const profiles = ((data as any[]) || [])
        .filter((artist) => {
          const name = (artist?.artist_name || "").trim().toLowerCase();
          return Boolean(name) && !blockedArtistNames.has(name);
        })
        .map((artist, index) => ({
          id: artist.id,
          image:
            artist.artist_name?.trim().toLowerCase() === "abdul rafay"
              ? abdulRafayAiImages[index % abdulRafayAiImages.length]
              : artist.avatar_url || fallbackArtists[index % fallbackArtists.length].image,
          name: artist.artist_name,
          bio: artist.introduction || artist.bio || "Now showing on Artify.",
          href: `/artist/${artist.id}`,
        }));

      if (profiles.length > 0) {
        setArtists(profiles);
      }
    };

    fetchArtists();
  }, []);

  return (
    <section className="section-space" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <h2
          className={`text-xl md:text-5xl font-serif font-bold text-center mb-2 md:mb-4 text-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          The Artists Behind the Work
        </h2>
        <p
          className={`text-center text-xs md:text-base text-muted-foreground mb-4 md:mb-12 max-w-lg mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
        >
          Meet the creators whose vision and craft bring each piece to life.
        </p>
        <Carousel opts={{ align: "start", loop: artists.length > 3 }} className="w-full">
          <CarouselContent className="-ml-4">
            {artists.map((artist, i) => (
              <CarouselItem key={artist.id} className="pl-4 basis-full md:basis-1/3">
                <Link
                  to={artist.href}
                  className={`group block h-full transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: isVisible ? `${(i + 1) * 150}ms` : "0ms" }}
                >
                  <article className="flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-5 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                    <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-secondary mb-4">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                        <Palette className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-semibold text-foreground">{artist.name}</h3>
                        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{artist.bio}</p>
                      </div>
                    </div>
                  </article>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 md:-left-6 h-11 w-11 rounded-full border border-background/30 bg-foreground/40 text-background backdrop-blur-2xl shadow-sm transition-colors duration-200 hover:bg-black hover:text-white disabled:opacity-40" />
          <CarouselNext className="-right-4 md:-right-6 h-11 w-11 rounded-full border border-background/30 bg-foreground/40 text-background backdrop-blur-2xl shadow-sm transition-colors duration-200 hover:bg-black hover:text-white disabled:opacity-40" />
        </Carousel>
        <div
          className={`flex justify-center mt-4 md:mt-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
        >
          <Link
            to="/artists"
            className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
          >
            Browse All Artists
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;
