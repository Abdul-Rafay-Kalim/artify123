import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>Your Cart</h1>
          <p className="text-muted-foreground mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.25s" }}>
            {items.length === 0 ? "Your cart is empty." : `${items.length} item${items.length > 1 ? "s" : ""} in your cart.`}
          </p>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground mb-6">Discover something you love.</p>
              <Button asChild>
                <Link to="/explore">Browse Artworks</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {items.map(({ artwork }) => (
                  <div key={artwork.id} className="flex gap-4">
                    <Link to={`/art/${artwork.id}`} className="shrink-0">
                      <div className="w-24 h-32 rounded-lg overflow-hidden bg-secondary">
                        <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/art/${artwork.id}`}>
                        <h3 className="font-serif font-semibold text-foreground">{artwork.title}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                      <p className="text-sm text-muted-foreground">{artwork.medium}</p>
                      <p className="font-medium text-foreground mt-2">PKR {artwork.price.toLocaleString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 self-center text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(artwork.id)}
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator className="my-8" />

              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-serif font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-foreground">PKR {totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" size="lg" asChild>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" size="lg" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>

              <div className="mt-6 text-center">
                <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
