import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-8">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <h1 className="page-title mb-3 font-serif font-bold">Privacy Policy</h1>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            At Artify, we respect your privacy and are committed to protecting your personal
            information. This policy explains how we collect, use, and safeguard your data.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Information We Collect</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Name and email address.</li>
                <li>Account details (login info).</li>
                <li>Payment-related information (securely processed).</li>
                <li>User activity on the platform (buying and selling behavior).</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">How We Use Your Information</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Create and manage your account.</li>
                <li>Process transactions between buyers and sellers.</li>
                <li>Improve our platform and user experience.</li>
                <li>Communicate important updates or support responses.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Data Protection</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Your data is kept secure and confidential.</li>
                <li>We do not sell or share your personal information with third parties.</li>
                <li>Payment data is handled through secure payment gateways.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Cookies</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Improve website performance.</li>
                <li>Remember user preferences.</li>
                <li>Analyze user activity.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Third-Party Services</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                We may use trusted third-party services (like payment providers), but they are responsible for their own privacy practices.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">User Rights</h2>
              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
                <li>Access your personal data.</li>
                <li>Request updates or corrections.</li>
                <li>Delete your account (if applicable).</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Changes to This Policy</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Artify may update this policy at any time. Changes will be reflected on this page.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 text-lg font-serif font-semibold">Contact Us</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                If you have any questions about this Privacy Policy, contact us at:{" "}
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

export default Privacy;
