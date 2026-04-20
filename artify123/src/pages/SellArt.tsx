import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Sparkles, Loader2, Trash2, Palette } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

interface ArtistProfileData {
  id: string;
  artist_name: string;
  bio: string;
  introduction: string;
  specialties: string[];
}

interface ListedArtwork {
  id: string;
  title: string;
  artist_name: string;
  price: number;
  genre: string | null;
  medium: string | null;
  image_url: string | null;
}

const SellArt = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Artist profile state
  const [artistProfile, setArtistProfile] = useState<ArtistProfileData | null>(null);
  const [artistName, setArtistName] = useState("");
  const [bio, setBio] = useState("");
  const [specialtiesInput, setSpecialtiesInput] = useState("");
  const [generatingIntro, setGeneratingIntro] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Artwork listing state
  const [title, setTitle] = useState("");
  const [artArtistName, setArtArtistName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [genre, setGenre] = useState("");
  const [medium, setMedium] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [year, setYear] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // My listings
  const [myListings, setMyListings] = useState<ListedArtwork[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchArtistProfile();
      fetchMyListings();
    }
  }, [user]);

  const fetchArtistProfile = async () => {
    const { data } = await supabase
      .from("artist_profiles" as any)
      .select("*")
      .eq("user_id", user!.id)
      .single();
    if (data) {
      const p = data as any;
      setArtistProfile(p);
      setArtistName(p.artist_name);
      setBio(p.bio || "");
      setSpecialtiesInput((p.specialties || []).join(", "));
    }
  };

  const fetchMyListings = async () => {
    const { data } = await supabase
      .from("listed_artworks" as any)
      .select("*")
      .eq("seller_id", user!.id)
      .order("created_at", { ascending: false });
    setMyListings((data as any) || []);
  };

  const generateIntro = async () => {
    if (!artistName.trim()) {
      toast({ title: "Enter your artist name first", variant: "destructive" });
      return;
    }
    setGeneratingIntro(true);
    try {
      const specialties = specialtiesInput.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await supabase.functions.invoke("generate-artist-intro", {
        body: { artistName, bio, specialties },
      });
      if (res.error) throw res.error;
      const intro = res.data?.introduction || "";
      setArtistProfile((prev) => prev ? { ...prev, introduction: intro } : null);

      // Save to DB
      if (artistProfile) {
        await supabase
          .from("artist_profiles" as any)
          .update({ introduction: intro } as any)
          .eq("id", artistProfile.id);
      }
      toast({ title: "AI introduction generated!" });
    } catch (e: any) {
      toast({ title: "Failed to generate intro", description: e.message, variant: "destructive" });
    } finally {
      setGeneratingIntro(false);
    }
  };

  const saveArtistProfile = async () => {
    if (!artistName.trim()) {
      toast({ title: "Artist name is required", variant: "destructive" });
      return;
    }
    setSavingProfile(true);
    const specialties = specialtiesInput.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      if (artistProfile) {
        await supabase
          .from("artist_profiles" as any)
          .update({ artist_name: artistName, bio, specialties } as any)
          .eq("id", artistProfile.id);
      } else {
        const { data, error } = await supabase
          .from("artist_profiles" as any)
          .insert({ user_id: user!.id, artist_name: artistName, bio, specialties } as any)
          .select()
          .single();
        if (error) throw error;
        setArtistProfile(data as any);
      }
      toast({ title: "Artist profile saved!" });
    } catch (e: any) {
      toast({ title: "Error saving profile", description: e.message, variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const submitArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("listed_artworks" as any)
        .insert({
          seller_id: user.id,
          title,
          artist_name: artArtistName || artistName || "Unknown",
          description,
          image_url: imageUrl || null,
          price: parseFloat(price),
          genre: genre || null,
          medium: medium || null,
          dimensions: dimensions || null,
          year: year ? parseInt(year) : null,
        } as any);

      if (error) throw error;

      toast({ title: "Artwork listed!", description: "It's now visible on the Explore page." });
      setTitle("");
      setArtArtistName("");
      setDescription("");
      setImageUrl("");
      setPrice("");
      setGenre("");
      setMedium("");
      setDimensions("");
      setYear("");
      fetchMyListings();
    } catch (e: any) {
      toast({ title: "Error listing artwork", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteArtwork = async (id: string) => {
    const { error } = await supabase
      .from("listed_artworks" as any)
      .delete()
      .eq("id", id);
    if (!error) {
      setMyListings((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Listing removed" });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Sell Your Art
          </h1>
          <p className="text-muted-foreground mt-2 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.25s" }}>
            Set up your artist profile and list artworks for sale.
          </p>

          {/* Artist Profile Section */}
          <Card className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Palette className="w-5 h-5" /> Artist Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="artistName">Artist Name *</Label>
                <Input id="artistName" value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Your artist name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about your background..." className="mt-1" rows={3} />
              </div>
              <div>
                <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                <Input id="specialties" value={specialtiesInput} onChange={(e) => setSpecialtiesInput(e.target.value)} placeholder="Oil Painting, Abstract, Sculpture" className="mt-1" />
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button onClick={saveArtistProfile} disabled={savingProfile}>
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {artistProfile ? "Update Profile" : "Create Profile"}
                </Button>
                {artistProfile && (
                  <Button variant="outline" onClick={generateIntro} disabled={generatingIntro} className="gap-2">
                    {generatingIntro ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {generatingIntro ? "Generating..." : "Generate AI Introduction"}
                  </Button>
                )}
              </div>

              {artistProfile?.introduction && (
                <div className="bg-secondary/50 rounded-xl p-4 mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI-Generated Introduction
                  </p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{artistProfile.introduction}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* List Artwork Form */}
          <Card className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Upload className="w-5 h-5" /> List an Artwork
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitArtwork} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Artwork title" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="artArtist">Artist Name *</Label>
                    <Input id="artArtist" value={artArtistName} onChange={(e) => setArtArtistName(e.target.value)} placeholder={artistName || "Artist name"} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input id="price" type="number" min="1" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1000" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Abstract, Portrait, etc." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="medium">Medium</Label>
                    <Input id="medium" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="Oil on Canvas, Digital, etc." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input id="dimensions" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder='24" × 36"' className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the artwork..." className="mt-1" rows={3} />
                </div>
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  List Artwork
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Listings */}
          {myListings.length > 0 && (
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">My Listings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myListings.map((art) => (
                  <div key={art.id} className="border border-border rounded-xl p-4 bg-card">
                    {art.image_url && (
                      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-secondary">
                        <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className="font-serif font-semibold text-foreground truncate">{art.title}</h3>
                    <p className="text-sm text-muted-foreground">{art.artist_name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-medium text-foreground">PKR {Number(art.price).toLocaleString()}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteArtwork(art.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellArt;
