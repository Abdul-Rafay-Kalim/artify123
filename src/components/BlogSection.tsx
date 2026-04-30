import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import artistStudio from "@/assets/artist-studio.jpg";
import galleryInterior from "@/assets/gallery-interior.jpg";
import artistPainting from "@/assets/artist-painting.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const newsStories = [
  {
    image: artistPainting,
    title: "Living With Art: How Space Changes Meaning",
    note: "(Art placement / emotional connection)",
  },
  {
    image: galleryInterior,
    title: "The Language of Texture: Why Material Matters",
    note: "(Process + craft insight)",
  },
  {
    image: artistStudio,
    title: "How to Begin Collecting Art Without Chasing Trends",
    note: "(Collector education - very high trust)",
  },
  {
    image: galleryInterior,
    title: "Inside the Studio: Where Silence Becomes Form",
    note: "(Studio practice / artist routine)",
  },
  {
    image: artistPainting,
    title: "Emerging Voices Reshaping Contemporary Practice",
    note: "(Artist discovery / cultural depth)",
  },
];

const leftCards = [
  {
    image: artistStudio,
    title: "Inside the Studio: Where Silence Becomes Form",
    note: "(Artist studio visit / feature story)",
  },
  {
    image: artistPainting,
    title: "How to Begin Collecting Art Without Chasing Trends",
    note: "(Collector education - very high trust)",
  },
  {
    image: galleryInterior,
    title: "Living With Art: How Space Changes Meaning",
    note: "",
  },
];

const BlogSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [topStoryIndex, setTopStoryIndex] = useState(0);

  const maxStartIndex = Math.max(0, newsStories.length - 2);

  useEffect(() => {
    const timer = setInterval(() => {
      setTopStoryIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [maxStartIndex]);

  const visibleRightStories = useMemo(
    () => newsStories.slice(topStoryIndex, topStoryIndex + 2),
    [topStoryIndex],
  );

  const featuredStory = newsStories[topStoryIndex] ?? newsStories[0];
  const leftVisibleStories = leftCards.slice(0, 2);

  return (
    <section className="section-space bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div
          className={`relative overflow-hidden rounded-2xl md:rounded-[2.6rem] border border-white/10 bg-[#050607] p-3 md:p-10 text-white transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Background tile pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                "radial-gradient(120% 95% at 50% 50%, transparent 44px, rgba(255,255,255,0.07) 45px, rgba(255,255,255,0.07) 46px, transparent 47px)",
              backgroundSize: "120px 108px",
            }}
          />

          <div className="relative z-10">
            <header className="mb-3 md:mb-8 text-center">
              <h2 className="font-serif text-xl leading-none tracking-tight text-white md:text-6xl">From the Studio & Beyond</h2>
              <p className="mt-1 md:mt-3 text-xs text-white/65 md:text-base">
                Stories, insights, and perspectives that explore how art is made, collected, and lived with.
              </p>
            </header>

            <div className="grid gap-3 md:gap-4 lg:grid-cols-[240px_minmax(0,1fr)_290px]">
              {/* Left stack */}
              <aside className="hidden lg:block space-y-3">
                {leftVisibleStories.map((card) => (
                  <article key={card.title} className="rounded-2xl border border-white/10 bg-black/55 p-2">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl">
                      <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
                    </div>
                    <h3 className="mt-2 font-serif text-[1.75rem] leading-[1.05] text-white md:text-[1.95rem]">{card.title}</h3>
                    {card.note && <p className="mt-1 text-xs text-white/50">{card.note}</p>}
                  </article>
                ))}
              </aside>

              {/* Main feature */}
              <article key={`feature-${topStoryIndex}`} className="animate-news-feature rounded-xl md:rounded-[1.9rem] border border-white/10 bg-black/45 p-2 md:p-3">
                <div className="overflow-hidden rounded-lg md:rounded-[1.5rem]">
                  <img src={featuredStory.image} alt={featuredStory.title} className="h-32 md:h-auto md:max-h-[540px] w-full object-cover" />
                </div>
                <h3 className="mt-2 md:mt-3 font-serif text-base md:text-[2.4rem] leading-tight md:leading-[1.04] text-white">
                  {featuredStory.title}
                </h3>
                <p className="mt-1 text-[10px] md:text-sm text-white/55">{featuredStory.note}</p>
              </article>

              {/* Right list */}
              <aside className="hidden lg:block rounded-2xl border border-white/10 bg-black/50 p-4">
                <div className="grid grid-cols-[1fr_38px] gap-4">
                  <div key={`right-${topStoryIndex}`} className="space-y-4">
                    {visibleRightStories.map((story, idx) => (
                      <article
                        key={`${story.title}-${story.note}-${idx}`}
                        className={`animate-news-item cursor-pointer rounded-xl p-2 transition-colors ${idx === 0 ? "bg-white/5" : ""}`}
                        style={{ animationDelay: `${idx * 90}ms` }}
                        onClick={() => {
                          const nextIndex = topStoryIndex + idx;
                          if (nextIndex <= maxStartIndex) {
                            setTopStoryIndex(nextIndex);
                          }
                        }}
                      >
                        <h3 className="font-serif text-[1.7rem] leading-[1.02] text-white">{story.title}</h3>
                        <p className="mt-1 text-sm text-white/50">{story.note}</p>
                      </article>
                    ))}
                  </div>

                  <div className="flex flex-col items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTopStoryIndex((prev) => (prev <= 0 ? maxStartIndex : prev - 1))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/75 transition-colors hover:bg-white/15 hover:text-white"
                      aria-label="Previous stories"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>

                    <input
                      type="range"
                      min={0}
                      max={maxStartIndex}
                      value={topStoryIndex}
                      onChange={(e) => setTopStoryIndex(Number(e.target.value))}
                      step={1}
                      className="vertical-story-slider"
                      aria-label="Browse studio stories"
                    />

                    <button
                      type="button"
                      onClick={() => setTopStoryIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/75 transition-colors hover:bg-white/15 hover:text-white"
                      aria-label="Next stories"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/45">
                      {topStoryIndex + 1}/{maxStartIndex + 1}
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
