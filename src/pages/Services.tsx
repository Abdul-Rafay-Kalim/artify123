import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Sparkles, Clock, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface ServiceRow {
  id: string;
  seller_id: string;
  artist_name: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number;
  delivery_days: number;
  image_url: string | null;
  is_featured: boolean;
  featured_until: string | null;
  created_at: string;
}

const CATEGORIES = [
  "Logo Design",
  "Portraits",
  "Wall Art",
  "UI/UX Design",
  "Illustration",
  "Calligraphy",
  "Other",
];

const isStillFeatured = (s: ServiceRow) =>
  s.is_featured &&
  s.featured_until &&
  new Date(s.featured_until) > new Date();

const Services = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await (supabase as any)
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setServices(data as ServiceRow[]);
    };
    fetchServices();
  }, []);

  const filtered = useMemo(() => {
    let result = services.filter(
      (s) =>
        (!searchQuery ||
          `${s.title} ${s.artist_name} ${s.category} ${s.description}`
            .toLowerCase()
            .includes(searchQuery)) &&
        (selectedCategories.length === 0 ||
          (s.category && selectedCategories.includes(s.category)))
    );

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest")
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    else {
      // featured first, then newest
      result.sort((a, b) => {
        const af = isStillFeatured(a) ? 1 : 0;
        const bf = isStillFeatured(b) ? 1 : 0;
        if (af !== bf) return bf - af;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    }
    return result;
  }, [services, searchQuery, selectedCategories, sortBy]);

  const toggleCategory = (c: string) => {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1
                className="page-title font-serif font-bold text-foreground opacity-0 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                Art Services
              </h1>
              <p
                className="text-muted-foreground mt-2 opacity-0 animate-fade-in"
                style={{ animationDelay: "0.25s" }}
              >
                Hire artists for portraits, logos, custom commissions, and more.
              </p>
            </div>
            <Link to="/sell?tab=service">
              <Button className="gap-2">
                <Briefcase className="w-4 h-4" /> Offer a service
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3 ml-auto">
              <Label className="text-sm text-muted-foreground whitespace-nowrap">
                Sort by
              </Label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-input rounded-md px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="featured">Featured first</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-10">
            <aside className="hidden md:block w-64 shrink-0">
              <h3 className="font-serif font-semibold text-foreground mb-4">
                Category
              </h3>
              <div className="space-y-3">
                {CATEGORIES.map((c) => (
                  <label
                    key={c}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedCategories.includes(c)}
                      onCheckedChange={() => toggleCategory(c)}
                    />
                    <span className="text-sm text-foreground">{c}</span>
                  </label>
                ))}
              </div>
            </aside>

            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border rounded-xl">
                  <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No services yet. Be the first to offer one.
                  </p>
                  <Link to="/sell?tab=service">
                    <Button variant="outline" className="mt-4">
                      Offer a service
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((s) => {
                    const featured = isStillFeatured(s);
                    return (
                      <Link
                        key={s.id}
                        to={`/service/${s.id}`}
                        className="group block"
                      >
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-secondary">
                          {s.image_url ? (
                            <img
                              src={s.image_url}
                              alt={s.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No image
                            </div>
                          )}
                          {featured && (
                            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground shadow-md">
                              <Sparkles className="w-3 h-3" /> Featured
                            </div>
                          )}
                          {s.category && (
                            <div className="absolute right-3 top-3 rounded-full bg-black/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                              {s.category}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-serif font-semibold text-foreground line-clamp-2">
                            {s.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            by {s.artist_name}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-medium text-foreground">
                              From PKR {Number(s.price).toLocaleString()}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" /> {s.delivery_days}d
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-8 text-center">
                Showing {filtered.length} of {services.length} services
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
