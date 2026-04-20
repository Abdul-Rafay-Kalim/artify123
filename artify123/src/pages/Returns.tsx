import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Returns = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Return Policy
          </h1>
          <p className="mb-6 text-muted-foreground">
            At Artify we want you to be completely satisfied with your
            purchase. If your order doesn’t meet your expectations, you may
            return eligible items within 30 days of delivery.
          </p>
          <ul className="list-disc list-inside mb-6">
            <li>Original packaging and condition required</li>
            <li>Artwork must not be damaged or altered</li>
            <li>Shipping costs are non‑refundable unless the return is due to
              our error</li>
          </ul>
          <p className="mb-6 text-muted-foreground">
            To start a return, contact us at{' '}
            <a href="mailto:support@artify.com" className="underline">
              support@artify.com
            </a>{' '}
            with your order number. We’ll provide instructions and a return
            shipping label if applicable.
          </p>
          <p className="text-muted-foreground">
            Returns are processed within 5–7 business days of receipt. Once
            approved, refunds will be issued to the original payment method.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Returns;
