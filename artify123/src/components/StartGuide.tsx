import artAbstract from "@/assets/art-abstract.jpg";
import galleryInterior from "@/assets/gallery-interior.jpg";
import artCharcoal from "@/assets/art-charcoal.jpg";
import artRose from "@/assets/art-rose.jpg";
import artCityscape from "@/assets/art-cityscape.jpg";
import artWatercolor from "@/assets/art-watercolor.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const artworks = [
  { image: galleryInterior, top: "10%", left: "15%" },
  { image: artCharcoal, top: "80%", left: "20%", size: "large" },
  { image: artRose, top: "15%", right: "10%" },
  { image: artWatercolor, top: "45%", left: "8%" },
  { image: artCityscape, top: "55%", right: "5%", size: "large" },
  { image: artAbstract, bottom: "15%", left: "25%" },
  { image: artWatercolor, bottom: "10%", right: "20%", size: "large" },
];

const StartGuide = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-32 bg-gray-50 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Scattered Images */}
        {artworks.map((art, i) => (
          <div
            key={i}
            className={`absolute rounded-lg overflow-hidden transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{
              top: art.top,
              left: art.left,
              right: art.right,
              width: art.size === "large" ? "120px" : "80px",
              height: art.size === "large" ? "120px" : "80px",
              transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
            }}
          >
            <img src={art.image} alt="artwork" className="w-full h-full object-cover" />
          </div>
        ))}

        {/* Center Content */}
        <div className="relative z-20 text-center max-w-2xl mx-auto py-20">
          <h2
            className={`text-4xl md:text-6xl font-serif font-bold text-foreground mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          >
            Not Sure Where to Start?
          </h2>
          <p
            className={`text-base md:text-lg text-muted-foreground mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
          >
            Let our AI guide you to artworks that fit your space, light, and the way you want to live with art.
          </p>
          <a
            href="/art-quiz"
            className={`inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{ transitionDelay: isVisible ? "400ms" : "0ms" }}
          >
            Find Art for My Space
          </a>
        </div>
      </div>
    </section>
  );
};

export default StartGuide;
