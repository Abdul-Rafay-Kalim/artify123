import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Returns = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-8">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <h1 className="page-title mb-3 font-serif font-bold">
            Refund Policy
          </h1>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            At Artify, we provide a platform for buying and selling art,
            including digital artworks and creative services. Please review our
            refund policy carefully before making a purchase.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">No Refund Policy</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                All transactions on Artify are final and non-refundable. Once an artwork or service is purchased, refunds will not be issued.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Digital and Creative Nature of Products</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Most artworks are digital or custom-made.</li>
                <li>Once delivered or accessed, they cannot be returned.</li>
                <li>Each piece is unique and created with effort.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Buyer Responsibility</h2>
              <p className="mb-2 text-sm text-muted-foreground">By making a purchase on Artify, you agree to:</p>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Carefully review artwork details, pricing, and previews.</li>
                <li>Understand what you are purchasing before confirming the order.</li>
                <li>Accept that refunds are not applicable.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Seller Responsibility</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Sellers must provide accurate descriptions and previews. Any misleading information may lead to action by Artify.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Support and Issue Resolution</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>In case of any issue, you can contact support.</li>
                <li>We may assist in resolving disputes between buyers and sellers.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Contact Us</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                For any questions or concerns regarding your order, contact us at:{" "}
                <a href="mailto:support@artify.com" className="underline">
                  [your email here]
                </a>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Update this placeholder with your real support email address.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Returns;
