import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const artworks = [
  { fileName: "WhatsApp Image 2026-04-12 at 12.55.17 AM0.jpeg", className: "left-[6%] top-[24%] h-[92px] w-[92px]" },
  { fileName: "WhatsApp Image 2026-04-12 at 12.55.17 AM4.jpeg", className: "left-[20%] top-[6%] h-[108px] w-[108px]" },
  { fileName: "WhatsApp Image 2026-04-12 at 12.55.17 AM3.jpeg", className: "left-[10%] top-[52%] h-[108px] w-[108px]" },
  { fileName: "WhatsApp Image 2026-04-12 at 12.55.17 AM1.jpeg", className: "right-[26%] top-[14%] h-[92px] w-[92px]" },
  { fileName: "6.jpeg", className: "right-[14%] top-[52%] h-[108px] w-[108px]" },
  { fileName: "WhatsApp Image 2026-04-12 at 12.55.17 AM2.jpeg", className: "left-[23%] top-[80%] h-[74px] w-[74px]" },
  { fileName: "WhatsApp Image 2026-04-12 at 12.55.17 AM.jpeg", className: "right-[23%] top-[80%] h-[74px] w-[74px]" },
  { fileName: "WhatsApp Image 2026-04-12 at 12.55.17 AM5.jpeg", className: "right-[36%] top-[84%] h-[80px] w-[80px]" },
];

const toPublicImagePath = (fileName: string) => `/${encodeURIComponent(fileName).replace(/%2F/g, "/")}`;

const StartGuide = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-space relative overflow-hidden bg-[#ececec]" ref={ref}>
      <div className="container mx-auto px-4 md:px-8 relative z-10 md:min-h-[620px]">
        <div className="pointer-events-none absolute right-0 top-[12%] hidden md:grid grid-cols-8 gap-3 opacity-45">
          {Array.from({ length: 32 }).map((_, idx) => (
            <span key={`rt-${idx}`} className="h-1.5 w-1.5 rounded-full bg-[#c6c6c6]" />
          ))}
        </div>

        <div className="pointer-events-none absolute left-0 bottom-[8%] hidden md:grid grid-cols-8 gap-3 opacity-45">
          {Array.from({ length: 32 }).map((_, idx) => (
            <span key={`lb-${idx}`} className="h-1.5 w-1.5 rounded-full bg-[#c6c6c6]" />
          ))}
        </div>

        {/* Scattered Images */}
        {artworks.map((art, i) => (
          <div
            key={i}
            className={`absolute hidden overflow-hidden rounded-2xl shadow-sm md:block ${art.className} transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{
              transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
            }}
          >
            <img
              src={toPublicImagePath(art.fileName)}
              alt="artwork"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
        ))}

        {/* Center Content */}
        <div className="relative z-20 mx-auto flex md:min-h-[620px] max-w-2xl flex-col items-center justify-center text-center">
          <div className="mb-3 grid w-full grid-cols-3 gap-2 md:hidden">
            {artworks.slice(0, 3).map((art, i) => (
              <div
                key={`mobile-${i}`}
                className={`aspect-square overflow-hidden rounded-lg transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isVisible ? `${120 + i * 80}ms` : "0ms" }}
              >
                <img
                  src={toPublicImagePath(art.fileName)}
                  alt="artwork"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            ))}
          </div>

          <h2
            className={`text-2xl md:text-6xl font-serif font-bold text-foreground mb-2 md:mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          >
            Not Sure Where to Start?
          </h2>
          <p
            className={`text-xs md:text-lg text-muted-foreground mb-4 md:mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
          >
            Let our AI guide you to artworks that fit your space, light, and the way you want to live with art.
          </p>
          <a
            href="/art-quiz"
            className={`inline-block bg-black text-white text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-700 ${
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
