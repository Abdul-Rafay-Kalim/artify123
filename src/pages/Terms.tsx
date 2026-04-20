import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-8">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <h1 className="page-title mb-3 font-serif font-bold">Terms of Service</h1>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Welcome to Artify. By accessing or using Artify, you agree to these Terms of Service.
            If you do not agree, please do not use the platform.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">1. Platform Role</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Artify is a marketplace that connects buyers and sellers of artworks and creative services.
                Artify facilitates listings and communication but is not the creator of listed works unless
                explicitly stated.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">2. Account Eligibility</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                You must provide accurate account information and keep your credentials secure. You are
                responsible for activities under your account.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">3. Buyer Terms</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Review artwork details and pricing before purchase.</li>
                <li>Respect artist rights and license limitations.</li>
                <li>Complete payments through approved checkout methods.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">4. Seller Terms</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Provide truthful descriptions, pricing, and previews.</li>
                <li>Only upload work you are authorized to sell.</li>
                <li>Comply with applicable copyright and consumer laws.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">5. Intellectual Property</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Artists retain ownership of their original content unless otherwise agreed. Buyers receive only
                the rights explicitly granted at purchase.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">6. Payments and Fees</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Payments are processed by third-party providers. Artify may apply service fees and may update
                fee structures with notice where required.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">7. Prohibited Conduct</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>No fraudulent listings or impersonation.</li>
                <li>No copyright infringement or unauthorized resale.</li>
                <li>No misuse of the platform, data scraping, or abusive behavior.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">8. Limitation of Liability</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                To the maximum extent permitted by law, Artify is not liable for indirect, incidental, or
                consequential losses arising from platform use or transactions between users.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">9. Suspension and Termination</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                We may suspend or remove accounts that violate these terms, applicable law, or platform safety
                standards.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">10. Changes to Terms</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Artify may update these terms from time to time. Continued use after updates means acceptance
                of the revised terms.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4 md:col-span-2">
              <h2 className="mb-2 text-lg font-serif font-semibold">Contact</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Questions about these Terms can be sent to:{" "}
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

export default Terms;
