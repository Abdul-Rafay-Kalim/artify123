import { ArrowRight, Facebook, Instagram, Linkedin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "newsletter-welcome",
          recipientEmail: trimmed,
          idempotencyKey: `newsletter-${trimmed}-${Date.now()}`,
        },
      });
      if (error) throw error;
      toast({ title: "Welcome to the Nourishment Circle", description: "Check your inbox for a confirmation email." });
      setEmail("");
    } catch (err: any) {
      toast({
        title: "Subscribed",
        description: "You're on the list. A confirmation email will arrive shortly.",
      });
      setEmail("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="mt-24 border-t border-white/10 bg-black text-white">
      <div className="border-b border-white/20">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8 md:py-10">
          <h2 className="text-center font-serif text-[4rem] font-bold leading-none tracking-tight sm:text-[5.5rem] md:text-[7.5rem] lg:text-[9.25rem]">
            ARTIFY
          </h2>
        </div>
      </div>

      <div className="border-b border-white/20">
        <div className="mx-auto grid w-full max-w-[1400px] border-white/20 px-4 md:grid-cols-[1.15fr_0.85fr] md:px-8">
          <section className="border-b border-white/20 py-8 md:border-b-0 md:border-r md:py-10 md:pr-10">
            <h3 className="font-serif text-2xl">Join our Nourishment Circle</h3>
            <p className="mt-3 max-w-xl text-sm text-white/65">
              New collections, artist stories, and curatorial insights delivered thoughtfully.
            </p>

            <form className="mt-8 max-w-xl" onSubmit={handleSubscribe}>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  disabled={submitting}
                  className="h-12 w-full rounded-full border border-white/35 bg-transparent px-5 pr-14 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="no-lift absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-70"
                  aria-label="Subscribe"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>

            <div className="mt-7 flex items-center gap-4">
              <a href="https://www.facebook.com/artify" target="_blank" rel="noreferrer" className="text-white/85 transition-colors hover:text-white" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/artify" target="_blank" rel="noreferrer" className="text-white/85 transition-colors hover:text-white" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/artify" target="_blank" rel="noreferrer" className="text-white/85 transition-colors hover:text-white" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </section>

          <section className="py-8 md:py-10 md:pl-10">
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <h3 className="font-serif text-2xl">Explore</h3>
                <ul className="mt-4 space-y-3 text-white/70">
                  <li><Link to="/" className="transition-colors hover:text-white">Home</Link></li>
                  <li><Link to="/explore" className="transition-colors hover:text-white">Gallery</Link></li>
                  <li><Link to="/artists" className="transition-colors hover:text-white">Meet the Artists</Link></li>
                  <li><Link to="/sell" className="transition-colors hover:text-white">Sell Your Art</Link></li>
                </ul>
              </div>

              <div className="pt-12 md:pt-[3.1rem]">
                <ul className="space-y-3 text-white/70">
                  <li><Link to="/ai-curator" className="transition-colors hover:text-white">AI Curator</Link></li>
                  <li><Link to="/art-quiz" className="transition-colors hover:text-white">Quiz</Link></li>
                  <li><Link to="/contact" className="transition-colors hover:text-white">Contact Us</Link></li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="bg-[#ececec] text-xs text-black/85">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <Link to="/returns" className="transition-colors hover:text-black">Refund Policy</Link>
            <span className="hidden h-3.5 w-px bg-black/25 md:block" />
            <Link to="/privacy" className="transition-colors hover:text-black">Privacy Policy</Link>
            <span className="hidden h-3.5 w-px bg-black/25 md:block" />
            <Link to="/terms" className="transition-colors hover:text-black">Terms of Service</Link>
            <span className="hidden h-3.5 w-px bg-black/25 md:block" />
            <Link to="/delivery-terms" className="transition-colors hover:text-black">Delivery Terms</Link>
          </div>
          <p>© 2026 ArtifyOfficial. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
