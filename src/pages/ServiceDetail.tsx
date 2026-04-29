import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MessageCircle,
  Sparkles,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
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

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [service, setService] = useState<ServiceRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data } = await (supabase as any)
        .from("services")
        .select("*")
        .eq("id", id)
        .single();
      setService((data as ServiceRow) || null);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!service) return;
    setOrdering(true);
    // Simulated order — in MVP we just show confirmation
    await new Promise((r) => setTimeout(r, 900));
    setOrdering(false);
    toast({
      title: "Order request sent",
      description: `${service.artist_name} will be in touch about "${service.title}".`,
    });
  };

  const featured =
    service?.is_featured &&
    service?.featured_until &&
    new Date(service.featured_until) > new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 container mx-auto px-4 md:px-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-[4/3] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">
            Service not found
          </h1>
          <Link to="/services">
            <Button variant="outline">Back to services</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to services
          </Link>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
              {featured && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> Featured
                </div>
              )}
            </div>

            <div>
              {service.category && (
                <Badge variant="secondary" className="mb-3">
                  {service.category}
                </Badge>
              )}
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {service.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                by{" "}
                <span className="text-foreground font-medium">
                  {service.artist_name}
                </span>
              </p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-serif font-bold text-foreground">
                  PKR {Number(service.price).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  starting price
                </span>
              </div>

              <div className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" /> Delivery in {service.delivery_days}{" "}
                day{service.delivery_days === 1 ? "" : "s"}
              </div>

              {service.description && (
                <div className="mt-6 prose prose-sm max-w-none text-foreground/80 whitespace-pre-line">
                  {service.description}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleOrder}
                  disabled={ordering}
                >
                  {ordering && <Loader2 className="w-4 h-4 animate-spin" />}
                  Order this service
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    if (!user) return navigate("/login");
                    navigate("/messages");
                  }}
                >
                  <MessageCircle className="w-4 h-4" /> Contact artist
                </Button>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" /> Payment held safely until
                delivery is approved
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
