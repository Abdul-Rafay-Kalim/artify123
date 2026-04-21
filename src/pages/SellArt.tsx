import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Sparkles, Loader2, Trash2, Palette, Info, Pencil } from "lucide-react";
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
  avatar_url?: string | null;
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
  description: string | null;
  year: number | null;
  dimensions: string | null;
}

type ListingArtistMode = "self" | "other";

interface ListingMeta {
  paintingDate: string | null;
  quantity: number;
  placementGuidance: string | null;
  artistNote: string | null;
  additionalImageUrls: string[];
}

const SellArt = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const accountRole = ((user?.user_metadata?.role as string | undefined) || "buyer").toLowerCase();
  const isSeller = accountRole === "seller";

  // Artist profile state
  const [artistProfile, setArtistProfile] = useState<ArtistProfileData | null>(null);
  const [artistName, setArtistName] = useState("");
  const [artistAvatarUrl, setArtistAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [specialtiesInput, setSpecialtiesInput] = useState("");
  const [generatingIntro, setGeneratingIntro] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Artwork listing state
  const [title, setTitle] = useState("");
  const [artArtistName, setArtArtistName] = useState("");
  const [listingArtistMode, setListingArtistMode] = useState<ListingArtistMode>("self");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [price, setPrice] = useState("");
  const [genre, setGenre] = useState("");
  const [medium, setMedium] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [paintingDate, setPaintingDate] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [placementGuidance, setPlacementGuidance] = useState("");
  const [artistNote, setArtistNote] = useState("");
  const [payoutConsent, setPayoutConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null);

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

  // Ensure user metadata (role) is fresh — refresh session once on mount
  useEffect(() => {
    if (user) {
      supabase.auth.refreshSession().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });

  const fetchArtistProfile = async () => {
    const { data } = await supabase
      .from("artist_profiles" as any)
      .select("*")
      .eq("user_id", user!.id)
      .single();

    const fallbackName = [user?.user_metadata?.first_name, user?.user_metadata?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    const fallbackAvatar = typeof user?.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : "";

    if (data) {
      const p = data as any;
      setArtistProfile(p);
      setArtistName(p.artist_name);
      setArtistAvatarUrl(p.avatar_url || "");
      setBio(p.bio || "");
      setSpecialtiesInput((p.specialties || []).join(", "));
    } else {
      setArtistName((current) => current || fallbackName);
      setArtistAvatarUrl((current) => current || fallbackAvatar);
    }
  };

  const handleArtistAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      setArtistAvatarUrl(dataUrl);
    } catch (e: any) {
      toast({ title: "Failed to load image", description: e.message, variant: "destructive" });
    }
  };

  const handleArtworkImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      setImageUrls((prev) => {
        const next = [...prev];
        next[index] = dataUrl;
        return next;
      });
    } catch (e: any) {
      toast({ title: "Failed to load image", description: e.message, variant: "destructive" });
    }
  };

  const parseListingDescription = (rawDescription: string | null | undefined) => {
    const fallbackMeta: ListingMeta = {
      paintingDate: null,
      quantity: 1,
      placementGuidance: null,
      artistNote: null,
      additionalImageUrls: [],
    };

    if (!rawDescription) {
      return { cleanDescription: "", meta: fallbackMeta };
    }

    const marker = "\n\nARTIFY_META:";
    const metaIndex = rawDescription.indexOf(marker);

    if (metaIndex === -1) {
      return { cleanDescription: rawDescription, meta: fallbackMeta };
    }

    const cleanDescription = rawDescription.slice(0, metaIndex).trim();
    const metaRaw = rawDescription.slice(metaIndex + marker.length);

    try {
      const parsedMeta = JSON.parse(metaRaw) as Partial<ListingMeta>;
      return {
        cleanDescription,
        meta: {
          paintingDate: parsedMeta.paintingDate || null,
          quantity: parsedMeta.quantity || 1,
          placementGuidance: parsedMeta.placementGuidance || null,
          artistNote: parsedMeta.artistNote || null,
          additionalImageUrls: Array.isArray(parsedMeta.additionalImageUrls) ? parsedMeta.additionalImageUrls.filter(Boolean) : [],
        },
      };
    } catch {
      return { cleanDescription: rawDescription, meta: fallbackMeta };
    }
  };

  const resetArtworkForm = () => {
    setEditingArtworkId(null);
    setTitle("");
    setArtArtistName("");
    setListingArtistMode("self");
    setDescription("");
    setImageUrls([""]);
    setPrice("");
    setGenre("");
    setMedium("");
    setDimensions("");
    setPaintingDate("");
    setQuantity("1");
    setPlacementGuidance("");
    setArtistNote("");
    setPayoutConsent(false);
  };

  const startEditingArtwork = (art: ListedArtwork) => {
    const { cleanDescription, meta } = parseListingDescription(art.description);
    const isOwnArtwork = art.artist_name.trim().toLowerCase() === artistName.trim().toLowerCase();

    setEditingArtworkId(art.id);
    setTitle(art.title || "");
    setListingArtistMode(isOwnArtwork ? "self" : "other");
    setArtArtistName(isOwnArtwork ? "" : art.artist_name || "");
    setDescription(cleanDescription);
    setImageUrls([art.image_url || "", ...meta.additionalImageUrls]);
    setPrice(art.price ? String(art.price) : "");
    setGenre(art.genre || "");
    setMedium(art.medium || "");
    setDimensions(art.dimensions || "");
    setPaintingDate(meta.paintingDate || (art.year ? `${art.year}-01-01` : ""));
    setQuantity(String(meta.quantity || 1));
    setPlacementGuidance(meta.placementGuidance || "");
    setArtistNote(meta.artistNote || "");
    setPayoutConsent(true);
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
    if (!artistAvatarUrl.trim()) {
      toast({ title: "Artist picture is required", description: "Upload an artist photo or avatar before saving your profile.", variant: "destructive" });
      return;
    }
    setSavingProfile(true);
    const specialties = specialtiesInput.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      if (artistProfile) {
        await supabase
          .from("artist_profiles" as any)
          .update({ artist_name: artistName, avatar_url: artistAvatarUrl || null, bio, specialties } as any)
          .eq("id", artistProfile.id);
      } else {
        const { data, error } = await supabase
          .from("artist_profiles" as any)
          .insert({ user_id: user!.id, artist_name: artistName, avatar_url: artistAvatarUrl || null, bio, specialties } as any)
          .select()
          .single();
        if (error) throw error;
        setArtistProfile(data as any);
      }

      await supabase.auth.updateUser({
        data: {
          ...(user?.user_metadata || {}),
          avatar_url: artistAvatarUrl,
          artist_name: artistName,
        },
      });

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

    if (!isSeller) {
      toast({
        title: "Seller account required",
        description: "Only sellers can list artworks for sale.",
        variant: "destructive",
      });
      return;
    }

    const resolvedArtistName =
      listingArtistMode === "other"
        ? artArtistName.trim()
        : (artistName || user.user_metadata?.first_name || "").trim();

    if (!resolvedArtistName) {
      toast({
        title: "Artist name is required",
        description:
          listingArtistMode === "other"
            ? "Enter the artist name for this listing."
            : "Set your artist profile name first.",
        variant: "destructive",
      });
      return;
    }

    const primaryImage = imageUrls[0]?.trim();
    if (!primaryImage) {
      toast({
        title: "Main image is required",
        description: "At least one image URL is mandatory to list a painting.",
        variant: "destructive",
      });
      return;
    }

    const parsedQuantity = Number.parseInt(quantity || "1", 10);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
      toast({
        title: "Invalid quantity",
        description: "Quantity must be at least 1.",
        variant: "destructive",
      });
      return;
    }

    const additionalImages = imageUrls
      .slice(1)
      .map((url) => url.trim())
      .filter(Boolean);

    const listingMeta = {
      paintingDate: paintingDate || null,
      quantity: parsedQuantity,
      placementGuidance: placementGuidance || null,
      artistNote: artistNote || null,
      additionalImageUrls: additionalImages,
    };

    const descriptionWithMeta = `${description.trim()}\n\nARTIFY_META:${JSON.stringify(listingMeta)}`.trim();

    if (!editingArtworkId && !payoutConsent) {
      toast({
        title: "Please confirm payout terms",
        description: "You must acknowledge the 20% platform commission before listing.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        seller_id: user.id,
        title: title.trim(),
        artist_name: resolvedArtistName,
        description: descriptionWithMeta,
        image_url: primaryImage,
        price: parseFloat(price),
        genre: genre || null,
        medium: medium || null,
        year: paintingDate ? new Date(paintingDate).getFullYear() : null,
        dimensions: dimensions || null,
      };

      const query = editingArtworkId
        ? supabase.from("listed_artworks" as any).update(payload as any).eq("id", editingArtworkId)
        : supabase.from("listed_artworks" as any).insert(payload as any);

      const { error } = await query;

      if (error) throw error;

      toast({
        title: editingArtworkId ? "Artwork updated!" : "Artwork listed!",
        description: editingArtworkId ? "Your changes are now live." : "It's now visible on the Explore page.",
      });
      resetArtworkForm();
      await fetchMyListings();
    } catch (e: any) {
      toast({ title: editingArtworkId ? "Error updating artwork" : "Error listing artwork", description: e.message, variant: "destructive" });
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
          <h1 className="page-title font-serif font-bold text-foreground opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Sell Your Art
          </h1>
          <p className="text-muted-foreground mt-2 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.25s" }}>
            Set up your artist profile and list artworks for sale.
          </p>

          {!isSeller && (
            <Card className="mb-8 border-amber-400/30 bg-amber-50/80 opacity-0 animate-fade-in" style={{ animationDelay: "0.28s" }}>
              <CardContent className="pt-6">
                <h2 className="font-serif text-2xl text-amber-950">Seller account required</h2>
                <p className="mt-2 text-sm text-amber-900/80">
                  Your account is currently set as a buyer. Buyers can collect and purchase art, but cannot publish listings.
                  Sign up or log in as a seller to list your own work or represent other artists.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Artist Profile Section */}
          <Card className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Palette className="w-5 h-5" /> Artist Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="artistAvatar">Artist Picture *</Label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="h-24 w-24 overflow-hidden rounded-full border border-border bg-secondary">
                    {artistAvatarUrl ? (
                      <img src={artistAvatarUrl} alt={artistName || "Artist preview"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="artistAvatar"
                      type="file"
                      accept="image/*"
                      onChange={handleArtistAvatarUpload}
                      className="mt-1"
                      disabled={!isSeller}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">Upload your profile picture directly from your computer. This image is required and will appear in The Artists Behind the Work.</p>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="artistName">Artist Name *</Label>
                <Input id="artistName" value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Your artist name" className="mt-1" disabled={!isSeller} />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about your background..." className="mt-1" rows={3} disabled={!isSeller} />
              </div>
              <div>
                <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                <Input id="specialties" value={specialtiesInput} onChange={(e) => setSpecialtiesInput(e.target.value)} placeholder="Oil Painting, Abstract, Sculpture" className="mt-1" disabled={!isSeller} />
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button onClick={saveArtistProfile} disabled={savingProfile || !isSeller}>
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {artistProfile ? "Update Profile" : "Create Profile"}
                </Button>
                {artistProfile && (
                  <Button variant="outline" onClick={generateIntro} disabled={generatingIntro || !isSeller} className="gap-2">
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
                <Upload className="w-5 h-5" /> {editingArtworkId ? "Edit Artwork" : "List an Artwork"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitArtwork} className="space-y-4">
                {editingArtworkId && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
                    Editing your previously uploaded artwork. Update the fields below and save your changes.
                  </div>
                )}
                <div>
                  <Label>Listing For</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={listingArtistMode === "self" ? "default" : "outline"}
                      onClick={() => setListingArtistMode("self")}
                      disabled={!isSeller}
                    >
                      My own artwork
                    </Button>
                    <Button
                      type="button"
                      variant={listingArtistMode === "other" ? "default" : "outline"}
                      onClick={() => setListingArtistMode("other")}
                      disabled={!isSeller}
                    >
                      Another artist's artwork
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Painting Name *</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Painting name" required className="mt-1" disabled={!isSeller} />
                  </div>
                  <div>
                    <Label htmlFor="artArtist">Artist Name *</Label>
                    <Input
                      id="artArtist"
                      value={listingArtistMode === "self" ? (artistName || "") : artArtistName}
                      onChange={(e) => setArtArtistName(e.target.value)}
                      placeholder={listingArtistMode === "self" ? (artistName || "Your profile name") : "Artist name"}
                      className="mt-1"
                      required={listingArtistMode === "other"}
                      disabled={!isSeller || listingArtistMode === "self"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paintingDate">Date *</Label>
                    <Input id="paintingDate" type="date" value={paintingDate} onChange={(e) => setPaintingDate(e.target.value)} required className="mt-1" disabled={!isSeller} />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (PKR) *</Label>
                    <Input id="price" type="number" min="1" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1000" required className="mt-1" disabled={!isSeller} />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" required className="mt-1" disabled={!isSeller} />
                  </div>
                  <div>
                    <Label htmlFor="dimensions">Size</Label>
                    <Input id="dimensions" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder='24" × 36"' className="mt-1" disabled={!isSeller} />
                  </div>
                  <div>
                    <Label htmlFor="medium">Material</Label>
                    <Input id="medium" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="Oil on Canvas, Acrylic, etc." className="mt-1" disabled={!isSeller} />
                  </div>
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Abstract, Portrait, etc." className="mt-1" disabled={!isSeller} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the artwork..." className="mt-1" rows={3} disabled={!isSeller} />
                </div>
                <div>
                  <Label htmlFor="placementGuidance">Placement Guidance</Label>
                  <Textarea id="placementGuidance" value={placementGuidance} onChange={(e) => setPlacementGuidance(e.target.value)} placeholder="Best in living room with warm lighting, eye-level placement, etc." className="mt-1" rows={2} disabled={!isSeller} />
                </div>
                <div>
                  <Label htmlFor="artistNote">Artist's Note</Label>
                  <Textarea id="artistNote" value={artistNote} onChange={(e) => setArtistNote(e.target.value)} placeholder="Share the story, intent, or inspiration behind this piece." className="mt-1" rows={3} disabled={!isSeller} />
                </div>
                <div className="space-y-2">
                  <Label>Painting Pictures (1 required, more optional)</Label>
                  {imageUrls.map((url, index) => (
                    <div key={`image-url-${index}`} className="rounded-xl border border-border p-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="h-24 w-24 overflow-hidden rounded-lg border border-border bg-secondary">
                          {url ? (
                            <img src={url} alt={`Artwork preview ${index + 1}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-center text-xs text-muted-foreground px-2">
                              No image selected
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleArtworkImageUpload(index, e)}
                            required={index === 0 && !url}
                            className="mt-1"
                            disabled={!isSeller}
                          />
                          <p className="mt-2 text-xs text-muted-foreground">
                            {index === 0 ? "Main painting image from your computer." : `Additional painting image ${index} from your computer.`}
                          </p>
                        </div>
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-3"
                          onClick={() => setImageUrls((prev) => prev.filter((_, idx) => idx !== index))}
                          disabled={!isSeller}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setImageUrls((prev) => [...prev, ""])}
                    disabled={!isSeller}
                  >
                    Add Another Picture
                  </Button>
                </div>

                <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4">
                  <p className="flex items-start gap-2 text-sm text-amber-950">
                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      Payout notice: If this artwork is sold through Artify, the buyer's payment will first be received by Artify. We will deduct a 20% platform commission, then transfer the remaining 80% to your registered payout account.
                    </span>
                  </p>
                  <label className="mt-3 flex items-start gap-2 text-sm text-amber-900/90">
                    <input
                      type="checkbox"
                      checked={payoutConsent}
                      onChange={(e) => setPayoutConsent(e.target.checked)}
                      disabled={!isSeller}
                      className="mt-1"
                    />
                    <span>I understand and agree to these payout terms for this listing.</span>
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={submitting || !isSeller} className="gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {editingArtworkId ? "Save Changes" : "List Artwork"}
                  </Button>
                  {editingArtworkId && (
                    <Button type="button" variant="outline" onClick={resetArtworkForm} disabled={submitting || !isSeller}>
                      Cancel Editing
                    </Button>
                  )}
                </div>
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
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground">PKR {Number(art.price).toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditingArtwork(art)} aria-label="Edit artwork">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteArtwork(art.id)} aria-label="Delete artwork">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
