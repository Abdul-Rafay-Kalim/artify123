import { useEffect, useState } from "react";
import artistStudio from "@/assets/artist-studio.jpg";
import galleryInterior from "@/assets/gallery-interior.jpg";
import artistPainting from "@/assets/artist-painting.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const tabs = [
  { id: "news", label: "News" },
  { id: "updates", label: "Updates" },
  { id: "latest", label: "Latest Arts" },
  { id: "deals", label: "Deals" },
  { id: "discounts", label: "Discounts" },
];

const posts = [
  { image: artistStudio, kind: "news", title: "Artist Residency Open Call", excerpt: "Apply now for a summer artist residency program in our studio lab.", badge: "News" },
  { image: galleryInterior, kind: "updates", title: "New Exhibition: Contemporary Realism", excerpt: "Explore our latest gallery installation opening this weekend.", badge: "Update" },
  { image: artistPainting, kind: "latest", title: "Fresh Arrivals: Ceramic Masterpieces", excerpt: "Handpicked new works by emerging sculptors in shop now.", badge: "Latest" },
  { image: artistStudio, kind: "deals", title: "Bundle Offer: 3 Prints for 2", excerpt: "Limited-time bundle discount on curated prints collections.", badge: "Deal" },
  { image: galleryInterior, kind: "discounts", title: "Up to 35% Off Select Originals", excerpt: "Save on selected original paintings before the month ends.", badge: "Discount" },
  { image: artistPainting, kind: "news", title: "Artist Talk: The Future of Digital Art", excerpt: "Join our live webinar with top digital artists and curators.", badge: "News" },
];

const BlogSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState("news");
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const filteredPosts = posts.filter((post) => post.kind === activeTab);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const timer = setInterval(() => {
      if (!carouselApi) return;
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [carouselApi, activeTab]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    carouselApi.scrollTo(0);
  }, [activeTab, carouselApi]);

  return (
    <section className="py-24 section-dark" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <h2
          className={`text-3xl md:text-5xl font-serif font-bold mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Studio News + Deals
        </h2>

        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                  : "bg-background/20 text-foreground hover:bg-background/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Carousel opts={{ align: "start", loop: true, speed: 10 }} setApi={setCarouselApi} className="w-full">
          <CarouselContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post, i) => (
              <CarouselItem key={`${post.title}-${i}`} className="relative">
                <article className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
                      {post.badge}
                    </span>
                    <h3 className="font-serif text-lg md:text-xl font-bold mt-3 text-foreground">{post.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-end gap-2 mt-4">
            <CarouselPrevious className="px-3 py-2 rounded-full bg-background/80 text-foreground hover:bg-background transition" />
            <CarouselNext className="px-3 py-2 rounded-full bg-background/80 text-foreground hover:bg-background transition" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default BlogSection;
