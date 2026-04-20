import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            About Us
          </h1>
          <p className="mb-6 text-muted-foreground">
            Artify is a community-driven marketplace where collectors and
            creators come together to celebrate original art. Founded in 2026,
            our mission is to make exceptional artworks accessible to everyone
            while empowering artists with a fair, transparent platform.
          </p>
          <p className="mb-6 text-muted-foreground">
            Whether you’re looking to start your first collection or share your
            vision with the world, Artify provides the tools and support you
            need.
          </p>
          <p className="text-muted-foreground">
            <strong>Our values:</strong> authenticity, respect for creatives,
            and a passion for discovery.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
