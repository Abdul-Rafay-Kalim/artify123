import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DeliveryTerms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-8">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <h1 className="page-title mb-3 font-serif font-bold">Delivery Terms</h1>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Artify delivers physical artworks through TCS. The delivery types and shipping conditions
            listed below apply to all shipments handled through our platform.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">1. Delivery Types</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Inter-city delivery</li>
                <li>Inter-province delivery</li>
                <li>Intra-province delivery</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">2. Courier and Conditions</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Deliveries are fulfilled through TCS. All shipment handling, transit timelines,
                and delivery conditions follow TCS terms and conditions.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">3. Shipping Charges</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Shipping charges are calculated based on the selected delivery type and TCS policies.
                Any additional charges applicable under TCS policies remain the responsibility of the buyer.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">4. Buyer Obligations</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Provide accurate delivery address and contact information.</li>
                <li>Ensure someone is available to receive physical shipments when required.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">5. Seller Obligations</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Dispatch sold items within agreed processing windows.</li>
                <li>Package artworks securely to reduce in-transit risk.</li>
                <li>Provide tracking details once shipment is booked through TCS.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">6. Delays and Exceptions</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Delays, exceptions, or service limitations caused by TCS are outside Artify's direct control.
                In such cases, TCS terms and service commitments will apply.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4 md:col-span-2">
              <h2 className="mb-2 text-lg font-serif font-semibold">Contact</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                For delivery-related support, contact:{" "}
                <a href="mailto:support@artify.com" className="underline">
                  [your email here]
                </a>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Replace this placeholder with your real support email address.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryTerms;
