import { Search, Heart, ShoppingCart, User, Menu, X, LogOut, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import artifyLogo from "@/assets/artify_logo.png";
import { useCart } from "@/contexts/CartContext";
import { useLikedArtworks } from "@/contexts/LikedContext";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileName, setProfileName] = useState("");
  const { totalItems } = useCart();
  const { totalLiked } = useLikedArtworks();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const accountRole = ((user?.user_metadata?.role as string | undefined) || "buyer").toLowerCase();
  const isSeller = accountRole === "seller";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      setProfileName("");
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("user_id", user.id)
        .single();

      const profile = data as { first_name: string | null; last_name: string | null } | null;
      const profileName = profile
        ? [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim()
        : "";
      const meta = (user.user_metadata || {}) as Record<string, any>;
      const metaName = [meta.first_name, meta.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();
      const oauthName = (meta.full_name || meta.name || "").trim();
      setProfileName(
        profileName || metaName || oauthName || user.email?.split("@")[0] || "User",
      );
    };

    fetchProfile();
  }, [user]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/explore?search=${encodeURIComponent(query)}` : "/explore");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-4 z-50">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8">
        <div
          className={`relative transition-all duration-500 rounded-full ${
            scrolled ? "bg-foreground/40 backdrop-blur-2xl shadow-lg" : "bg-black shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between py-2.5 px-5 md:px-6 lg:px-7">
            <Link to="/" className="inline-flex items-center" aria-label="Artify Home">
              <img src={artifyLogo} alt="Artify" className="h-8 w-auto md:h-9" />
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-background/70">
              <Link to="/" className="hover:text-background transition-colors duration-200">Home</Link>
              <Link to="/explore" className="hover:text-background transition-colors duration-200">Explore</Link>
              <Link to="/services" className="hover:text-background transition-colors duration-200">Services</Link>
              <Link to="/ai-curator" className="hover:text-background transition-colors duration-200">AI Curator</Link>
              <Link to="/art-quiz" className="hover:text-background transition-colors duration-200">Art Quiz</Link>
              <Link to="/artists" className="hover:text-background transition-colors duration-200">Artists</Link>
              <Link to="/sell" className="hover:text-background transition-colors duration-200">Sell Art</Link>
              <Link to="/contact" className="hover:text-background transition-colors duration-200">Contact</Link>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 hover:bg-background/10 rounded-full transition-colors duration-200 text-background"
                aria-label="Open search"
                onClick={() => setSearchOpen((prev) => !prev)}
              >
                <Search className="w-4 h-4" />
              </button>

              <Link to="/liked" className="relative p-2 hover:bg-background/10 rounded-full transition-colors duration-200 text-background" aria-label="Liked">
                <Heart className="w-4 h-4" />
                {totalLiked > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalLiked}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative p-2 hover:bg-background/10 rounded-full transition-colors duration-200 text-background" aria-label="Cart">
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {!loading && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hidden md:flex items-center gap-2 bg-background text-foreground px-4 py-1.5 rounded-full text-sm font-medium hover:bg-background/90 transition-colors duration-200">
                      <User className="w-3.5 h-3.5" />
                      {profileName}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isSeller && (
                      <DropdownMenuItem asChild>
                        <Link to="/sell" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Sell my products
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login" className="hidden md:flex items-center gap-2 bg-background text-foreground px-4 py-1.5 rounded-full text-sm font-medium hover:bg-background/90 transition-colors duration-200">
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )}

              <button
                type="button"
                className="md:hidden p-2 text-background"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="absolute right-4 top-[calc(100%+10px)] z-50 w-[250px] md:right-8 md:w-[300px]">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 rounded-full border border-background/30 bg-black/85 p-1.5 backdrop-blur-xl"
              >
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search artworks..."
                  className="h-9 w-full bg-transparent px-3 text-sm text-background placeholder:text-background/60 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground transition-colors hover:bg-background/90"
                  aria-label="Submit search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {mobileOpen && (
            <nav className="md:hidden absolute right-3 top-[calc(100%+8px)] z-50 w-44 rounded-lg bg-black/95 backdrop-blur-xl shadow-xl ring-1 ring-background/10 py-1.5 flex flex-col text-[13px] font-medium animate-fade-in">
              <Link to="/" className="px-3 py-1.5 text-background/85 hover:bg-background/10 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/explore" className="px-3 py-1.5 text-background/85 hover:bg-background/10 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Explore</Link>
              <Link to="/services" className="px-3 py-1.5 text-background/85 hover:bg-background/10 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Services</Link>
              <Link to="/ai-curator" className="px-3 py-1.5 text-background/85 hover:bg-background/10 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>AI Curator</Link>
              <Link to="/art-quiz" className="px-3 py-1.5 text-background/85 hover:bg-background/10 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Art Quiz</Link>
              <Link to="/artists" className="px-3 py-1.5 text-background/85 hover:bg-background/10 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Artists</Link>
              <Link to="/sell" className="px-3 py-1.5 text-background/85 hover:bg-background/10 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Sell Art</Link>
              <Link to="/contact" className="px-3 py-1.5 text-background/85 hover:bg-background/10 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Contact</Link>
              <div className="my-1 mx-2 h-px bg-background/15" />
              {!loading && user ? (
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-background/85 hover:bg-background/10 hover:text-background transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log out
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-3 py-1.5 text-background/85 hover:bg-background/10 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
