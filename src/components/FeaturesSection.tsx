import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import picCollectors from "@/assets/for-collectors.png";
import picArtists from "@/assets/for-artists.png";
import picWorld from "@/assets/for-me.png";

const features = [
  {
    image: picCollectors,
    title: "For Collectors",
    description: "Discover curated art from artists worldwide, with certificates of authenticity.",
  },
  {
    image: picArtists,
    title: "For Artists",
    description: "Showcase and sell your work directly to collectors who value your craft.",
  },
  {
    image: picWorld,
    title: "For the World",
    description: "Making art accessible and connecting creative communities globally.",
  },
];

const FeaturesSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-space bg-secondary" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <h2
          className={`text-xl md:text-5xl font-serif font-bold text-center mb-4 md:mb-16 text-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          A Thoughtful Way to Buy, Sell,<br className="hidden md:block" /> and Share Art
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`flex flex-col items-center text-center rounded-2xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: isVisible ? `${(i + 1) * 150}ms` : "0ms" }}
            >
              <div className="w-full aspect-square max-w-[348px] md:w-[348px] md:h-[348px] overflow-hidden rounded-2xl md:rounded-[2rem] bg-white isolate">
                <img
                  src={f.image}
                  alt={f.title}
                  className="block w-full h-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.12)]"
                />
              </div>
              <div className="mt-1 md:mt-2 px-1 md:px-8 pt-2 md:pt-4 pb-2 md:pb-8">
                <h3 className="font-serif text-[11px] md:text-xl font-semibold mb-1 md:mb-3 text-foreground leading-tight">{f.title}</h3>
                <p className="hidden md:block text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
