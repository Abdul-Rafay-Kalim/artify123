import { ArrowRight, ExternalLink } from "lucide-react";
import heroArt from "@/assets/hero-art.png";
import art1 from "@/assets/art-abstract.jpg";
import art2 from "@/assets/art-watercolor.jpg";
import art3 from "@/assets/art-rose.jpg";

const HeroSection = () => {
  const thumbnails = [
    { id: 1, image: art1, alt: "Abstract artwork" },
    { id: 2, image: art2, alt: "Watercolor piece" },
    { id: 3, image: art3, alt: "Rose artwork" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
      {/* Decorative dot pattern background */}
      <div className="absolute left-0 top-0 w-40 h-full hidden md:flex flex-col items-center justify-start pt-20 gap-3 opacity-20 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex gap-3">
            {[...Array(10)].map((_, j) => (
              <div key={j} className="w-2 h-2 rounded-full bg-gray-400"></div>
            ))}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-12 gap-8 items-start relative z-10">
          {/* Left sidebar with thumbnails */}
          <div className="hidden md:flex md:col-span-1 flex-col gap-4 justify-center">
            {thumbnails.map((thumb, idx) => (
              <div
                key={thumb.id}
                className="w-20 h-20 rounded-lg overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition-all hover:scale-110 cursor-pointer opacity-0 animate-fade-in"
                style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
              >
                <img
                  src={thumb.image}
                  alt={thumb.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Extra icon button */}
            <div className="w-20 h-20 rounded-xl bg-black flex items-center justify-center cursor-pointer hover:scale-110 transition-transform opacity-0 animate-fade-in" style={{ animationDelay: "0.55s" }}>
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-5 space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] text-foreground">
              Collect Art That<br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">Lives Beyond</span><br />
              Trends
            </h1>
            <p className="text-muted-foreground text-lg max-w-md opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Discover original works from emerging and established artists. A curated space where art meets intention.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <a
                href="/explore"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/artists"
                className="inline-flex items-center gap-2 border-2 border-gray-300 text-foreground px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Discover Artists
              </a>
            </div>
          </div>

          {/* Hero image with decorative elements */}
          <div className="md:col-span-6 relative opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {/* Wavy decoration bottom right */}
            <svg
              className="absolute -bottom-8 -right-8 w-48 h-32 opacity-40 pointer-events-none"
              viewBox="0 0 200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,60 Q50,20 100,60 T200,60"
                stroke="#f97316"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M0,80 Q50,40 100,80 T200,80"
                stroke="#fb923c"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M0,100 Q50,60 100,100 T200,100"
                stroke="#fdba74"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Main image container */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src={heroArt}
                alt="Vibrant contemporary portrait painting"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative corner accent */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full opacity-30 blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
