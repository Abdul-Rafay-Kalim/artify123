import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { LikedProvider } from "@/contexts/LikedContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
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
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DeliveryTerms from "./pages/DeliveryTerms";
import Liked from "./pages/Liked";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Defer to after paint so newly-mounted route content doesn't override
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [location.pathname]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-page-in">
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
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/delivery-terms" element={<DeliveryTerms />} />
        <Route path="/liked" element={<Liked />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetail />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <InventoryProvider>
          <CartProvider>
            <LikedProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <AnimatedRoutes />
              </BrowserRouter>
            </LikedProvider>
          </CartProvider>
        </InventoryProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
