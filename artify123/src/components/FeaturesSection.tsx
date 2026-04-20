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
    <section className="py-24 bg-secondary" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <h2
          className={`text-3xl md:text-5xl font-serif font-bold text-center mb-16 text-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          A Thoughtful Way to Buy, Sell,<br className="hidden md:block" /> and Share Art
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`flex flex-col items-center text-center bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: isVisible ? `${(i + 1) * 150}ms` : "0ms" }}
            >
              <div className="w-[348px] h-[348px] overflow-hidden rounded-t-2xl">
                <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <h3 className="font-serif text-xl font-semibold mb-3 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
