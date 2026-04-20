import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Copy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useInventory } from "@/contexts/InventoryContext";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

type CheckoutStep = "details" | "payment" | "submitted";

interface BankDetails {
  referenceNumber: string;
  accountTitle: string;
  accountNumber: string;
  bankName: string;
}

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { createPaymentClaim } = useInventory();

  const [step, setStep] = useState<CheckoutStep>("details");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [paymentDone, setPaymentDone] = useState<boolean | null>(null);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState("");
  const [payableAmount, setPayableAmount] = useState(0);
  const [cartSnapshot, setCartSnapshot] = useState(items);

  const generateReferenceNumber = (): string => {
    const date = new Date();
    const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${dateStr}-${random}`;
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const refNum = generateReferenceNumber();
    setPayableAmount(totalPrice);
    setCartSnapshot(items);
    setBankDetails({
      referenceNumber: refNum,
      accountTitle: "WALEEJA MAHMOOD",
      accountNumber: "0111638124",
      bankName: "Meezaan Bank",
    });
    setStep("payment");
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotDataUrl((event.target?.result as string) || "");
    };
    reader.readAsDataURL(file);
  };

  const submitPaymentClaim = () => {
    if (!bankDetails) return;

    if (paymentDone !== true) {
      toast({ title: "Please confirm if you have completed payment", variant: "destructive" });
      return;
    }

    if (!screenshotDataUrl) {
      toast({ title: "Please upload your payment screenshot", variant: "destructive" });
      return;
    }

    createPaymentClaim({
      referenceNumber: bankDetails.referenceNumber,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      amount: payableAmount,
      screenshotDataUrl,
      items: cartSnapshot.map((item) => ({
        artworkId: item.artwork.id,
        title: item.artwork.title,
        quantity: item.quantity,
        unitPrice: item.artwork.price,
      })),
    });

    clearCart();
    setStep("submitted");
    toast({ title: "Payment proof submitted", description: "Admin will verify your transfer shortly." });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16">
          <div className="container mx-auto px-4 max-w-xl text-center py-16">
            <p className="text-muted-foreground">Checking your account...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16">
          <div className="container mx-auto px-4 max-w-xl text-center py-16">
            <h1 className="page-title font-serif font-bold text-foreground mb-3">Login Required</h1>
            <p className="text-muted-foreground mb-6">
              You can add items to your cart, but you must log in before proceeding to payment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/cart">Back to Cart</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0 && step === "details") {
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
          {step === "details" && (
            <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
              <ArrowLeft className="w-3 h-3" /> Back to Cart
            </Link>
          )}

          {step === "details" && (
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h1 className="page-title font-serif font-bold text-foreground mb-2">Checkout</h1>
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
                  Continue to Payment Instructions
                </Button>
              </form>
            </div>
          )}

          {step === "payment" && bankDetails && (
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h1 className="page-title font-serif font-bold text-foreground mb-2">Bank Transfer</h1>
              <p className="text-muted-foreground mb-8">Transfer the exact amount and submit screenshot for verification.</p>

              <Card className="mb-6 border-primary/20 bg-primary/5">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Reference Number</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="font-mono font-bold text-lg text-foreground">{bankDetails.referenceNumber}</p>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(bankDetails.referenceNumber);
                          toast({ title: "Reference copied" });
                        }}
                        className="p-2 hover:bg-secondary rounded"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank</span>
                      <span className="font-medium text-foreground">{bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Title</span>
                      <span className="font-medium text-foreground">{bankDetails.accountTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Number</span>
                      <span className="font-mono font-medium text-foreground">{bankDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-bold text-foreground">PKR {payableAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardContent className="pt-6 space-y-4">
                  <p className="font-medium text-foreground">Have you completed the transfer?</p>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={paymentDone === true ? "default" : "outline"}
                      onClick={() => setPaymentDone(true)}
                    >
                      Yes, I have paid
                    </Button>
                    <Button
                      type="button"
                      variant={paymentDone === false ? "default" : "outline"}
                      onClick={() => setPaymentDone(false)}
                    >
                      Not yet
                    </Button>
                  </div>

                  {paymentDone === false && (
                    <p className="text-sm text-muted-foreground">Complete the transfer first, then select "Yes, I have paid" and upload screenshot.</p>
                  )}

                  {paymentDone === true && (
                    <div className="space-y-2">
                      <Label htmlFor="proof">Upload payment screenshot</Label>
                      <Input id="proof" type="file" accept="image/*" onChange={handleScreenshotUpload} />
                      {screenshotDataUrl && (
                        <img
                          src={screenshotDataUrl}
                          alt="Payment proof"
                          className="w-full max-h-64 object-contain rounded border"
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" size="lg" onClick={submitPaymentClaim}>
                  Submit for Admin Verification
                </Button>
                <Button variant="outline" size="lg" onClick={() => setStep("details")}>
                  Back
                </Button>
              </div>
            </div>
          )}

          {step === "submitted" && bankDetails && (
            <div className="text-center py-20 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CheckCircle className="w-16 h-16 mx-auto text-primary mb-6" />
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Proof Submitted</h2>
              <p className="text-muted-foreground mb-2">Your transfer is now marked as booked until admin verification.</p>
              <p className="text-sm text-muted-foreground mb-8">Reference: {bankDetails.referenceNumber}</p>
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
