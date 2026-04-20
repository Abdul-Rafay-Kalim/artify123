import artRose from "@/assets/art-rose.jpg";
import galleryInterior from "@/assets/gallery-interior.jpg";
import artMixedMedia from "@/assets/art-mixed-media.jpg";
import artWatercolor from "@/assets/art-watercolor.jpg";
import heroArt from "@/assets/hero-art.png";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const pickedArtworks = [
  { id: 1, image: galleryInterior, title: "Gallery Moment", artist: "Clara Dunn", price: "PKR 2,400" },
  { id: 2, image: artMixedMedia, title: "Chromatic Soul", artist: "Ava Morales", price: "PKR 1,850" },
  { id: 3, image: artWatercolor, title: "Morning Fields", artist: "Thomas Lake", price: "PKR 980" },
  { id: 4, image: heroArt, title: "Ember Portrait", artist: "Elena Vasquez", price: "PKR 3,200" },
  { id: 5, image: artRose, title: "Rose Bloom", artist: "Sofia Chen", price: "PKR 1,500" },
  { id: 6, image: artMixedMedia, title: "Abstract Dreams", artist: "James Okafor", price: "PKR 2,100" },
];

const CuratorPicks = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-24" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <h2
          className={`text-3xl md:text-5xl font-serif font-bold mb-4 text-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          AI + Curator Picks...
        </h2>
        <p
          className={`text-muted-foreground mb-12 max-w-lg transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
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
              {pickedArtworks.map((art) => (
                <CarouselItem key={art.id} className="pl-4 basis-full md:basis-1/3">
                  <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <div className="bg-card border border-border rounded-3xl overflow-hidden h-full flex flex-col">
                      <Link to={`/art/${art.id}`} className="relative aspect-square overflow-hidden group flex-shrink-0">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(art.id);
                          }}
                          className="absolute top-4 right-4 p-3 bg-foreground rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
                          aria-label="Add to favorites"
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              favorites.includes(art.id)
                                ? "fill-destructive text-destructive"
                                : "text-background"
                            }`}
                          />
                        </button>
                      </Link>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <Link to={`/art/${art.id}`} className="group">
                          <h3 className="font-serif font-semibold text-foreground group-hover:opacity-70 transition-opacity">{art.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{art.artist}</p>
                        </Link>
                        <p className="text-sm font-medium text-foreground mt-3">{art.price}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
      </div>
    </section>
  );
};

export default CuratorPicks;
