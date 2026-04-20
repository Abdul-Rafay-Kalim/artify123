import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="section-dark">
      {/* Newsletter */}
      <div className="border-b border-current/10 py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-serif font-bold italic mb-6">
            Stay Connected to the Art World
          </h2>
          <div className="flex max-w-md mx-auto gap-2">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="email"
                placeholder="Your email address"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-transparent border border-current/20 text-sm placeholder:opacity-50 focus:outline-none focus:border-current/50"
              />
            </div>
            <button className="bg-section-dark-foreground text-section-dark px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Brand & Links */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-7xl md:text-9xl font-serif font-bold tracking-tight">ARTIFY</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm opacity-70">
          <div>
            <h4 className="font-semibold mb-4 opacity-100">Explore</h4>
            <ul className="space-y-2">
              <li><a href="/explore" className="hover:opacity-100 transition-opacity">New Arrivals</a></li>
              <li><a href="/explore" className="hover:opacity-100 transition-opacity">Collections</a></li>
              <li><a href="/artists" className="hover:opacity-100 transition-opacity">Artists</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 opacity-100">For Artists</h4>
            <ul className="space-y-2">
              <li><a href="/sell" className="hover:opacity-100 transition-opacity">Sell Your Work</a></li>
              <li><a href="/sell" className="hover:opacity-100 transition-opacity">Artist Resources</a></li>
              <li><a href="/sell" className="hover:opacity-100 transition-opacity">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 opacity-100">Support</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:opacity-100 transition-opacity">Help Center</a></li>
              <li><a href="/about" className="hover:opacity-100 transition-opacity">Shipping Info</a></li>
              <li><Link to="/returns" className="hover:opacity-100 transition-opacity">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 opacity-100">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><a href="/blog" className="hover:opacity-100 transition-opacity">Blog</a></li>
              <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-current/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
          <p>© 2026 Artify. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link to="/terms" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
