import { Crown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import galleryInterior from "@/assets/gallery-interior.jpg";
import artCharcoal from "@/assets/art-charcoal.jpg";

interface ArtworkCard {
  title: string;
  artist: string;
  image: string;
  description: string;
  edition: string;
  medium: string;
  price: string;
  badge: string;
}

const featuredArtworks: ArtworkCard[] = [
  {
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

  return (
    <section className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
            Artworks Available Now
          </h2>
          <p className="text-base text-muted-foreground">
            Original works, ready to be lived with.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-12">
          {featuredArtworks.map((artwork, i) => (
            <div
              key={artwork.artist}
              className={`group transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${(i + 1) * 150}ms` : "0ms",
              }}
            >
              <div className="bg-gray-100 rounded-2xl overflow-hidden flex">
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
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                      {artwork.artist}
                    </h3>
                    <p className="text-xs text-muted-foreground">
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
                    <div className="flex justify-between pt-1.5 border-t border-gray-300">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-semibold text-foreground">
                        {artwork.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          <a
            href="/explore-art"
            className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            View all artworks
          </a>
        </div>
      </div>
    </section>
  );
};

export default ArtworksGrid;
