import { ShieldCheck, Lock, CreditCard, Globe, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const trustItems = [
  { icon: ShieldCheck, label: "Certificate of Authenticity" },
  { icon: Lock, label: "Privacy & Data Protection" },
  { icon: CreditCard, label: "Secure Payments" },
  { icon: Globe, label: "Worldwide Shipping" },
  { icon: Award, label: "Curated Selection" },
];

const CollectConfidence = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24" ref={ref}>
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2
          className={`text-3xl md:text-5xl font-serif font-bold mb-12 text-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          Collect With Confidence
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {trustItems.map((item, i) => (
            <div
              key={item.label}
              className={`flex flex-col items-center gap-3 max-w-[140px] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: isVisible ? `${(i + 1) * 100}ms` : "0ms" }}
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <item.icon className="w-6 h-6 text-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectConfidence;
