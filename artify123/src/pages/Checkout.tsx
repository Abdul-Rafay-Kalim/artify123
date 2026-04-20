import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Smartphone, CheckCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

type PaymentMethod = "easypaisa" | "jazzcash";
type CheckoutStep = "details" | "payment" | "processing" | "success";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<CheckoutStep>("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("easypaisa");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setStep("payment");
  };

  const handlePay = () => {
    setStep("processing");
    // Simulate payment processing
    setTimeout(() => {
      setStep("success");
      clearCart();
    }, 3000);
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16">
          <div className="container mx-auto px-4 max-w-xl text-center py-16">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link to="/explore">Browse Artworks</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          {/* Back link */}
          {step === "details" && (
            <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
              <ArrowLeft className="w-3 h-3" /> Back to Cart
            </Link>
          )}

          {/* Step: Details */}
          {step === "details" && (
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Checkout</h1>
              <p className="text-muted-foreground mb-8">Enter your details to continue</p>

              <form onSubmit={handleSubmitDetails} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Muhammad Ali" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="ali@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input id="phone" placeholder="03XX-XXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <Separator className="my-6" />

                {/* Order summary */}
                <div className="space-y-3">
                  <h3 className="font-serif font-semibold text-foreground">Order Summary</h3>
                  {items.map(({ artwork }) => (
                    <div key={artwork.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-4">{artwork.title}</span>
                      <span className="text-foreground font-medium">PKR {artwork.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total</span>
                    <span>PKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Choose Payment Method
                </Button>
              </form>
            </div>
          )}

          {/* Step: Payment method */}
          {step === "payment" && (
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Payment</h1>
              <p className="text-muted-foreground mb-8">Select your payment method</p>

              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                className="space-y-4"
              >
                {/* EasyPaisa */}
                <label htmlFor="easypaisa" className="cursor-pointer">
                  <Card className={`transition-all ${paymentMethod === "easypaisa" ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <RadioGroupItem value="easypaisa" id="easypaisa" />
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[hsl(145,60%,45%)] text-[hsl(0,0%,100%)]">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">EasyPaisa</p>
                        <p className="text-sm text-muted-foreground">Pay via EasyPaisa mobile wallet</p>
                      </div>
                    </CardContent>
                  </Card>
                </label>

                {/* JazzCash */}
                <label htmlFor="jazzcash" className="cursor-pointer">
                  <Card className={`transition-all ${paymentMethod === "jazzcash" ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <RadioGroupItem value="jazzcash" id="jazzcash" />
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[hsl(0,75%,55%)] text-[hsl(0,0%,100%)]">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">JazzCash</p>
                        <p className="text-sm text-muted-foreground">Pay via JazzCash mobile wallet</p>
                      </div>
                    </CardContent>
                  </Card>
                </label>
              </RadioGroup>

              <Separator className="my-6" />

              <div className="flex justify-between font-semibold text-foreground mb-6">
                <span>Total</span>
                <span>PKR {totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" size="lg" onClick={handlePay}>
                  Pay with {paymentMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"}
                </Button>
                <Button variant="outline" size="lg" onClick={() => setStep("details")}>
                  Back
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                🔒 Demo mode — no real payment will be processed
              </p>
            </div>
          )}

          {/* Step: Processing */}
          {step === "processing" && (
            <div className="text-center py-20 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-6" />
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Processing Payment</h2>
              <p className="text-muted-foreground">
                Connecting to {paymentMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"}...
              </p>
              <p className="text-sm text-muted-foreground mt-2">Please wait while we confirm your transaction.</p>
            </div>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div className="text-center py-20 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CheckCircle className="w-16 h-16 mx-auto text-primary mb-6" />
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-2">
                Your order has been confirmed via {paymentMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"}.
              </p>
              <p className="text-sm text-muted-foreground mb-8">A confirmation email will be sent to {email}.</p>
              <Button asChild size="lg">
                <Link to="/explore">Continue Browsing</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
