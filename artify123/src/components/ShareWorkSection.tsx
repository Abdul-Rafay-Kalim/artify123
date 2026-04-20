import { ArrowRight } from "lucide-react";
import artMixedMedia from "@/assets/art-mixed-media.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const ShareWorkSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 section-dark" ref={ref}>
      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div
          className={`aspect-square rounded-2xl overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
        >
          <img src={artMixedMedia} alt="Colorful contemporary artwork" className="w-full h-full object-cover" />
        </div>
        <div
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            Share Your Work<br />With Collectors
          </h2>
          <p className="opacity-70 mb-8 max-w-md">
            Join a community of artists who sell directly to passionate collectors. No middlemen, no gatekeepers.
          </p>
          <a
            href="/sell"
            className="inline-flex items-center gap-2 border border-current px-6 py-3 rounded-full text-sm font-medium hover:bg-section-dark-foreground hover:text-section-dark transition-colors"
          >
            Apply as an Artist
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ShareWorkSection;
