import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ArtQuiz from "./pages/ArtQuiz";
import AICurator from "./pages/AICurator";
import ExploreArt from "./pages/ExploreArt";
import ArtDetail from "./pages/ArtDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import SellArt from "./pages/SellArt";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Returns from "./pages/Returns";
import About from "./pages/About";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/art-quiz" element={<ArtQuiz />} />
            <Route path="/ai-curator" element={<AICurator />} />
            <Route path="/explore" element={<ExploreArt />} />
            <Route path="/art/:id" element={<ArtDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/sell" element={<SellArt />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
