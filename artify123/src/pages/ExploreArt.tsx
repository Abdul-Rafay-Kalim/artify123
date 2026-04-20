import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { artworks as staticArtworks, genres as staticGenres, mediums as staticMediums } from "@/data/artworks";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

interface UnifiedArtwork {
  id: string;
  image: string;
  title: string;
  artist: string;
  price: number;
  genre: string;
  medium: string;
  dimensions: string;
  year: number;
  description: string;
  isListed?: boolean;
}

const ExploreArt = () => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [dbArtworks, setDbArtworks] = useState<UnifiedArtwork[]>([]);

  useEffect(() => {
    const fetchListedArtworks = async () => {
      const { data } = await supabase
        .from("listed_artworks" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        setDbArtworks(
          (data as any[]).map((a: any) => ({
            id: `listed-${a.id}`,
            image: a.image_url || "",
            title: a.title,
            artist: a.artist_name,
            price: Number(a.price),
            genre: a.genre || "Other",
            medium: a.medium || "Other",
            dimensions: a.dimensions || "",
            year: a.year || new Date().getFullYear(),
            description: a.description || "",
            isListed: true,
          }))
        );
      }
    };
    fetchListedArtworks();
  }, []);

  const allArtworks: UnifiedArtwork[] = useMemo(
    () => [...staticArtworks, ...dbArtworks],
    [dbArtworks]
  );

  const allGenres = useMemo(
    () => [...new Set(allArtworks.map((a) => a.genre))],
    [allArtworks]
  );
  const allMediums = useMemo(
    () => [...new Set(allArtworks.map((a) => a.medium))],
    [allArtworks]
  );

  const toggleFilter = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filtered = useMemo(() => {
    let result = allArtworks.filter(
      (a) =>
        a.price >= priceRange[0] &&
        a.price <= priceRange[1] &&
        (selectedGenres.length === 0 || selectedGenres.includes(a.genre)) &&
        (selectedMediums.length === 0 || selectedMediums.includes(a.medium))
    );
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => b.year - a.year);
    return result;
  }, [priceRange, selectedGenres, selectedMediums, sortBy, allArtworks]);

  const activeFilterCount = selectedGenres.length + selectedMediums.length + (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedGenres([]);
    setSelectedMediums([]);
  };

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-serif font-semibold text-foreground mb-4">Price Range</h3>
        <Slider min={0} max={10000} step={50} value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>PKR {priceRange[0].toLocaleString()}</span>
          <span>PKR {priceRange[1].toLocaleString()}</span>
        </div>
      </div>
      <div>
        <h3 className="font-serif font-semibold text-foreground mb-4">Genre</h3>
        <div className="space-y-3">
          {allGenres.map((g) => (
            <label key={g} className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={selectedGenres.includes(g)} onCheckedChange={() => toggleFilter(g, selectedGenres, setSelectedGenres)} />
              <span className="text-sm text-foreground">{g}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-serif font-semibold text-foreground mb-4">Medium</h3>
        <div className="space-y-3">
          {allMediums.map((m) => (
            <label key={m} className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={selectedMediums.includes(m)} onCheckedChange={() => toggleFilter(m, selectedMediums, setSelectedMediums)} />
              <span className="text-sm text-foreground">{m}</span>
            </label>
          ))}
        </div>
      </div>
      {activeFilterCount > 0 && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">Clear All Filters</Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>Explore Art</h1>
            <p className="text-muted-foreground mt-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.25s" }}>
              Discover original works from emerging and established artists.
            </p>
          </div>

          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">{activeFilterCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <h2 className="font-serif text-xl font-bold mb-6">Filters</h2>
                  <FilterPanel />
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Label className="text-sm text-muted-foreground whitespace-nowrap">Sort by</Label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-input rounded-md px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedGenres.map((g) => (
                <Badge key={g} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleFilter(g, selectedGenres, setSelectedGenres)}>{g} <X className="w-3 h-3" /></Badge>
              ))}
              {selectedMediums.map((m) => (
                <Badge key={m} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleFilter(m, selectedMediums, setSelectedMediums)}>{m} <X className="w-3 h-3" /></Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setPriceRange([0, 10000])}>PKR {priceRange[0]}–{priceRange[1]} <X className="w-3 h-3" /></Badge>
              )}
            </div>
          )}

          <div className="flex gap-10">
            <aside className="hidden md:block w-64 shrink-0"><FilterPanel /></aside>
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No artworks match your filters.</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((art) => (
                    <div key={art.id} className="group">
                      <Link to={`/art/${art.id}`}>
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-secondary">
                          {art.image ? (
                            <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                          )}
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                        </div>
                      </Link>
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/art/${art.id}`} className="flex-1 min-w-0">
                          <h3 className="font-serif font-semibold text-foreground truncate">{art.title}</h3>
                          <p className="text-sm text-muted-foreground">{art.artist}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{art.medium} · {art.genre}</p>
                          <p className="text-sm font-medium text-foreground mt-1">PKR {art.price.toLocaleString()}</p>
                        </Link>
                        <Button
                          variant={isInCart(art.id) ? "default" : "outline"}
                          size="icon"
                          className="shrink-0 mt-1 h-9 w-9 rounded-full"
                          onClick={() => (isInCart(art.id) ? removeFromCart(art.id) : addToCart(art))}
                          aria-label={isInCart(art.id) ? "Remove from cart" : "Add to cart"}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-8 text-center">
                Showing {filtered.length} of {allArtworks.length} artworks
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExploreArt;
