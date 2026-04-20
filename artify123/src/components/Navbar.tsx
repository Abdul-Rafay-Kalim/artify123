import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
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
  const [profileName, setProfileName] = useState("");
  const { totalItems } = useCart();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
      if (data) {
        const name = [data.first_name, data.last_name].filter(Boolean).join(" ");
        setProfileName(name || user.email?.split("@")[0] || "User");
      } else {
        setProfileName(user.email?.split("@")[0] || "User");
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <header
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-full ${
        scrolled
          ? "bg-foreground/40 backdrop-blur-2xl shadow-lg"
          : "bg-foreground/35 backdrop-blur-xl"
      }`}
    >
      <div className="flex items-center justify-between py-3 px-10 md:px-10 lg:px-8 max-w-8xl mx-auto">
        <Link to="/" className="font-serif text-xl font-bold tracking-tight text-background">
          ARTIFY
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-background/70">
          <Link to="/" className="hover:text-background transition-colors duration-200">Home</Link>
          <Link to="/explore" className="hover:text-background transition-colors duration-200">Explore</Link>
          <Link to="/ai-curator" className="hover:text-background transition-colors duration-200">AI Curator</Link>
          <Link to="/art-quiz" className="hover:text-background transition-colors duration-200">Art Quiz</Link>
          <Link to="/artists" className="hover:text-background transition-colors duration-200">Artists</Link>
          <Link to="/sell" className="hover:text-background transition-colors duration-200">Sell Art</Link>
          <Link to="/about" className="hover:text-background transition-colors duration-200">About</Link>
          <Link to="/contact" className="hover:text-background transition-colors duration-200">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-background/10 rounded-full transition-colors duration-200 text-background" aria-label="Search">
            <Search className="w-4 h-4" />
          </button>
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
            className="md:hidden p-2 text-background"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-background/10 px-6 py-4 flex flex-col gap-2 text-sm font-medium animate-fade-in">
          <Link to="/" className="py-2 text-background/80 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/explore" className="py-2 text-background/80 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Explore</Link>
          <Link to="/ai-curator" className="py-2 text-background/80 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>AI Curator</Link>
          <Link to="/art-quiz" className="py-2 text-background/80 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Art Quiz</Link>
          <Link to="/artists" className="py-2 text-background/80 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Artists</Link>
          <Link to="/sell" className="py-2 text-background/80 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Sell Art</Link>
          <Link to="/about" className="py-2 text-background/80 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/contact" className="py-2 text-background/80 hover:text-background transition-colors" onClick={() => setMobileOpen(false)}>Contact</Link>
          {!loading && user ? (
            <button
              onClick={() => { signOut(); setMobileOpen(false); }}
              className="mt-2 flex items-center justify-center gap-2 bg-background text-foreground px-4 py-2 rounded-full text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Log out ({profileName})
            </button>
          ) : (
            <Link to="/login" className="mt-2 flex items-center justify-center gap-2 bg-background text-foreground px-4 py-2 rounded-full text-sm font-medium" onClick={() => setMobileOpen(false)}>
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;