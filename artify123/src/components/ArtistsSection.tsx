import { ArrowRight } from "lucide-react";
import artistStudio from "@/assets/artist-studio.jpg";
import artistPainting from "@/assets/artist-painting.jpg";
import artRose from "@/assets/art-rose.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const artists = [
  {
    image: artistStudio,
    name: "Sofia Chen",
    bio: "Exploring the intersection of nature and identity through mixed media installations.",
  },
  {
    image: artistPainting,
    name: "James Okafor",
    bio: "Bold brushwork that captures raw emotion in everyday urban landscapes.",
  },
  {
    image: artRose,
    name: "Maria Torres",
    bio: "Delicate botanical studies that celebrate the fleeting beauty of nature.",
  },
];

const ArtistsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <h2
          className={`text-3xl md:text-5xl font-serif font-bold text-center mb-4 text-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          The Artists Behind the Work
        </h2>
        <p
          className={`text-center text-muted-foreground mb-12 max-w-lg mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
        >
          Meet the creators whose vision and craft bring each piece to life.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {artists.map((artist, i) => (
            <div
              key={artist.name}
              className={`group cursor-pointer transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: isVisible ? `${(i + 1) * 150}ms` : "0ms" }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">{artist.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{artist.bio}</p>
            </div>
          ))}
        </div>
        <div
          className={`flex justify-center mt-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
        >
          <a
            href="/artists"
            className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
          >
            Browse All Artists
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;
