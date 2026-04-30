import shareYourWorkImage from "@/assets/share_your_work.png";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const ShareWorkSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-space bg-[#ececec]" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-2xl md:rounded-[1.8rem] bg-[#ececec] px-3 py-4 md:px-12 md:py-14">
          <div className="pointer-events-none absolute left-2 top-6 text-[#dfc7a0] opacity-85">
            <svg width="190" height="78" viewBox="0 0 190 78" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 8L24 22L49 8L74 22L100 8L124 22L151 8L176 22L190 14" stroke="currentColor" strokeWidth="2.8"/>
              <path d="M0 33L24 47L49 33L74 47L100 33L124 47L151 33L176 47L190 39" stroke="currentColor" strokeWidth="2.8"/>
              <path d="M0 58L24 72L49 58L74 72L100 58L124 72L151 58L176 72L190 64" stroke="currentColor" strokeWidth="2.8"/>
            </svg>
          </div>

          <div className="pointer-events-none absolute bottom-7 right-7 grid grid-cols-9 gap-3 opacity-45">
            {Array.from({ length: 45 }).map((_, idx) => (
              <span key={idx} className="h-1.5 w-1.5 rounded-full bg-[#c6c6c6]" />
            ))}
          </div>

          <div className="grid items-center gap-4 md:gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div
              className={`relative transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
            >
              <div className="overflow-hidden rounded-xl md:rounded-[1.35rem]">
                <img
                  src={shareYourWorkImage}
                  alt="Person viewing artwork in a gallery"
                  className="h-[140px] w-full object-cover md:h-[360px]"
                />
              </div>
            </div>

            <div
              className={`max-w-[470px] transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
              style={{ transitionDelay: isVisible ? "180ms" : "0ms" }}
            >
              <h2 className="font-serif text-2xl leading-[1.02] tracking-[-0.02em] text-black md:text-[4.1rem]">
                Share Your Work
                <br />
                With Collectors
              </h2>

              <p className="mt-2 md:mt-5 max-w-[460px] text-xs leading-5 md:text-[1.18rem] md:leading-8 text-black/50">
                Join as an independent artist and reach global buyers. Share your work with collectors who value originality, process, and intention.
              </p>

              <a
                href="/sell"
                className="mt-3 md:mt-14 inline-flex items-center justify-center rounded-full bg-black px-6 md:px-9 py-2 md:py-3 text-xs md:text-sm font-medium text-white transition-colors hover:bg-black/85"
              >
                Start Selling on Artify
              </a>

              <p className="mt-2 md:mt-4 text-[11px] leading-5 md:text-[1.02rem] md:leading-7 text-black/48">
                <span className="font-medium text-black/72">Note:</span> Applications are reviewed to maintain curatorial quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareWorkSection;
