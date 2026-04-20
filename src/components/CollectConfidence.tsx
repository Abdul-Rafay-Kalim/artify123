import { Tag, Handshake, Shield, Globe, Crosshair } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const trustItems = [
  {
    icon: Tag,
    title: "Certificate of Authenticity",
    description:
      "Every artwork includes a signed certificate issued by the artist, ensuring provenance and originality.",
  },
  {
    icon: Handshake,
    title: "Direct Artist Collaboration",
    description:
      "We work directly with artists, not intermediaries, so every piece is transparent and personal.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "All transactions are protected with industry-standard encryption and trusted payment providers.",
  },
  {
    icon: Globe,
    title: "Worldwide Shipping",
    description:
      "Carefully packaged and fully insured delivery to collectors around the world.",
  },
  {
    icon: Crosshair,
    title: "Curated Selection",
    description:
      "Every artwork is reviewed to maintain quality, originality, and integrity across the platform.",
  },
];

const cardClasses =
  "rounded-3xl bg-background px-6 py-7 text-center shadow-sm";

const CollectConfidence = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-space bg-muted/40" ref={ref}>
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2
          className={`text-3xl md:text-5xl font-serif font-bold text-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          Collect With Confidence
        </h2>
        <p
          className={`mx-auto mt-2 max-w-2xl text-sm md:text-base text-muted-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: isVisible ? "80ms" : "0ms" }}
        >
          Every artwork is handled with care, transparency, and respect for both artist and collector.
        </p>

        <div className="mt-10 grid gap-4 md:gap-5">
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {trustItems.slice(0, 3).map((item, i) => (
              <div
                key={item.title}
                className={`${cardClasses} transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: isVisible ? `${(i + 1) * 110}ms` : "0ms" }}
              >
                <item.icon className="mx-auto h-6 w-6 text-foreground" />
                <h3 className="mt-4 text-2xl font-serif font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 min-h-[3.25rem] text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto grid w-full gap-4 md:w-[67%] md:grid-cols-2 md:gap-5">
            {trustItems.slice(3).map((item, i) => (
              <div
                key={item.title}
                className={`${cardClasses} transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: isVisible ? `${(i + 4) * 110}ms` : "0ms" }}
              >
                <item.icon className="mx-auto h-6 w-6 text-foreground" />
                <h3 className="mt-4 text-2xl font-serif font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 min-h-[3.25rem] text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectConfidence;
