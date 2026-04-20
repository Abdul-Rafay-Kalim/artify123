import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: "Message ready to review",
      description: "Your note has been captured on the page. Connect this form to your backend when you're ready to send it.",
    });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <section className="mx-auto w-full max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="page-title font-serif leading-tight">Contact</h1>
              <p className="mt-2 text-sm text-foreground/60">Send us a message and we will get back to you.</p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="rounded-[1.5rem] border border-foreground/10 bg-white p-6 md:p-8"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/50">Name</label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    required
                    className="h-14 rounded-2xl border-foreground/10 bg-[#fbf7f1] px-5 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/50">Email</label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-14 rounded-2xl border-foreground/10 bg-[#fbf7f1] px-5 text-base"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="contact-subject" className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/50">Subject</label>
                  <Input
                    id="contact-subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Collector support, shipping issue, artist application..."
                    required
                    className="h-14 rounded-2xl border-foreground/10 bg-[#fbf7f1] px-5 text-base"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/50">Message</label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell us what you need, which artwork you're considering, or what kind of support would help most."
                    required
                    className="min-h-[180px] rounded-[1.5rem] border-foreground/10 bg-[#fbf7f1] px-5 py-4 text-base"
                  />
                </div>
              </div>

              <div className="mt-8">
                <Button type="submit" className="h-12 rounded-full bg-foreground px-6 text-sm font-semibold uppercase tracking-[0.18em] text-background hover:bg-foreground/90">
                  Send Message
                </Button>
              </div>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
