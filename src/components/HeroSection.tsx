import { Link } from "react-router-dom";
import heroArt from "@/assets/Group2.png";

const HeroSection = () => {

  return (
    <section id="hero-section" className="relative min-h-[100svh] md:min-h-screen flex items-center pt-20 md:pt-20 pb-6 md:pb-0 overflow-hidden bg-[#efefef]">
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
        <div className="grid md:grid-cols-12 gap-3 md:gap-6 items-start relative z-10">
          {/* Main content */}
          <div className="md:col-span-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h1 className="max-w-[680px] font-serif text-[2.25rem] sm:text-[4rem] md:text-[4.5rem] lg:text-[5.75rem] xl:text-[6.5rem] font-bold leading-[0.95] tracking-[-0.02em] text-foreground">
              Collect Art That<br />
              Lives Beyond<br />
              Trends
            </h1>

            <div className="mt-3 md:mt-6 max-w-[680px] text-foreground opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <p className="text-[13px] md:text-[18px] leading-[1.35] text-foreground/90">
                Discover and collect original artworks from emerging and established
                artists thoughtfully curated.
              </p>
              <p className="mt-1 text-[13px] md:text-[18px] font-semibold leading-[1.35] text-foreground">
                AI-guided recommendations curated for your space.
              </p>
              <p className="mt-2 md:mt-6 text-[13px] md:text-[18px] leading-[1.35] text-foreground/90">
                Buy original art or share your work with collectors worldwide.
              </p>
            </div>

            <div className="mt-4 md:mt-8 flex flex-wrap gap-2 md:gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <a
                href="/explore"
                className="inline-flex h-10 md:h-14 min-w-0 md:min-w-[176px] items-center justify-center rounded-full bg-black px-5 md:px-8 text-[13px] md:text-[18px] font-medium leading-none text-white transition-colors hover:bg-black/85"
              >
                Explore Art
              </a>
              <a
                href="/ai-curator"
                className="inline-flex h-10 md:h-14 min-w-0 md:min-w-[250px] items-center justify-center rounded-full border border-black/70 bg-transparent px-5 md:px-8 text-[13px] md:text-[18px] font-medium leading-none text-foreground transition-colors hover:bg-black/5"
              >
                Try AI Art Placement
              </a>
            </div>
          </div>

          {/* Hero image with decorative elements */}
          <div className="md:col-span-6 relative opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {/* Decorative glow top right */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
            
            {/* Decorative glow bottom left */}
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full opacity-15 blur-3xl pointer-events-none"></div>

            {/* Main image container */}
            <div className="relative w-full max-w-[180px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[460px] rounded-3xl overflow-hidden shadow-2xl mx-auto md:ml-auto">
              <img
                src={heroArt}
                alt="Vibrant contemporary portrait painting"
                className="block w-full h-auto mix-blend-multiply"
              />
              {/* Clickable hotspots aligned to the baked-in thumbnails + arrow */}
              <Link
                to="/explore"
                aria-label="Explore artworks"
                title="Explore artworks"
                className="absolute left-[1%] top-[51%] w-[12%] h-[11%] rounded-xl ring-0 hover:ring-2 hover:ring-white/80 transition"
              />
              <Link
                to="/artists"
                aria-label="Browse artists"
                title="Browse artists"
                className="absolute left-[1%] top-[63%] w-[12%] h-[11%] rounded-xl ring-0 hover:ring-2 hover:ring-white/80 transition"
              />
              <Link
                to="/ai-curator"
                aria-label="AI Curator"
                title="AI Curator"
                className="absolute left-[1%] top-[75%] w-[12%] h-[11%] rounded-xl ring-0 hover:ring-2 hover:ring-white/80 transition"
              />
              <Link
                to="/explore"
                aria-label="Open gallery"
                title="Open gallery"
                className="absolute left-[1%] top-[88%] w-[12%] h-[10%] rounded-full ring-0 hover:ring-2 hover:ring-white/80 transition"
              />
            </div>

            {/* Wavy decoration bottom right */}
            <svg
              className="absolute -bottom-6 -right-6 w-56 h-40 opacity-50 pointer-events-none"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
