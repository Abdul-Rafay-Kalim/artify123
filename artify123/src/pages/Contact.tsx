import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Contact Us
          </h1>
          <p className="mb-8 text-muted-foreground">
            Have a question or need assistance? Fill out the form below or
            email us at{' '}
            <a
              href="mailto:support@artify.com"
              className="underline hover:text-foreground"
            >
              artifyofficial1122@gmail.com
            </a>
            .
          </p>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={4}
                placeholder="How can we help?"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-foreground text-background px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
          </form>

          {/* social icons section; update hrefs later */}
          <div className="mt-8 flex justify-center gap-6">
            <a href="https://instagram.com/artify" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-6 h-6 hover:opacity-80" />
            </a>
            <a href="https://www.facebook.com/artify" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-6 h-6 hover:opacity-80" />
            </a>
            <a href="https://youtube.com/artify" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <Youtube className="w-6 h-6 hover:opacity-80" />
            </a>
            <a href="https://linkedin.com/company/artify" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-6 h-6 hover:opacity-80" />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
