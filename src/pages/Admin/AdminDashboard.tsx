import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Plus,
  Trash2,
  Settings,
  Image,
  Tag,
  FileText,
  Home,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/contexts/AdminContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useToast } from "@/hooks/use-toast";
import { artworks as staticArtworks } from "@/data/artworks";
import { supabase } from "@/integrations/supabase/client";

interface Art {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface Deal {
  id: string;
  title: string;
  discount: number;
  code: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, adminCredentials, updateCredentials } =
    useAdmin();
  const {
    paymentClaims,
    verifyClaim,
    rejectClaim,
    getTotalQuantity,
    setTotalQuantity,
    getSoldQuantity,
    getBookedQuantity,
    getAvailableQuantity,
  } = useInventory();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<
    "art" | "news" | "deals" | "images" | "payments" | "featured" | "settings"
  >("art");

  // Art management
  const [artList, setArtList] = useState<Art[]>([]);
  const [newArt, setNewArt] = useState({ title: "", artist: "", price: "" });

  // Featured management
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);

  const fetchFeaturedData = async () => {
    const [{ data: a }, { data: s }] = await Promise.all([
      (supabase as any)
        .from("listed_artworks")
        .select("id,title,artist_name,price,image_url,is_featured,featured_until,created_at")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false }),
      (supabase as any)
        .from("services")
        .select("id,title,artist_name,price,image_url,is_featured,featured_until,delivery_days,created_at")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);
    setFeaturedListings((a as any[]) || []);
    setFeaturedServices((s as any[]) || []);
  };

  useEffect(() => {
    if (activeTab === "featured") fetchFeaturedData();
  }, [activeTab]);

  const toggleFeatured = async (
    table: "listed_artworks" | "services",
    row: any
  ) => {
    const isCurrentlyActive =
      row.is_featured &&
      row.featured_until &&
      new Date(row.featured_until) > new Date();

    const update = isCurrentlyActive
      ? { is_featured: false, featured_until: null }
      : {
          is_featured: true,
          featured_until: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };

    const { error } = await (supabase as any)
      .from(table)
      .update(update)
      .eq("id", row.id);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: isCurrentlyActive ? "Featured removed" : "Marked as featured (7 days)",
    });
    fetchFeaturedData();
  };

  // News management
  const [newsList, setNewsList] = useState<News[]>([]);
  const [newNews, setNewNews] = useState({ title: "", content: "" });

  // Deals management
  const [dealList, setDealList] = useState<Deal[]>([]);
  const [newDeal, setNewDeal] = useState({
    title: "",
    discount: "",
    code: "",
  });

  // Images storage
  const [heroImages, setHeroImages] = useState({
    heroSection: "",
    forCollector: "",
    forArtists: "",
    forWorld: "",
  });

  // Artists images
  const [artistsImages, setArtistsImages] = useState<Array<{
    id: string;
    name: string;
    image: string;
    uploadedDate: string;
  }>>([]);

  // Settings
  const [newUsername, setNewUsername] = useState(adminCredentials.username);
  const [newPassword, setNewPassword] = useState(adminCredentials.password);
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});

  const inventoryArtworks = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>();

    staticArtworks.forEach((art) => {
      map.set(art.id, { id: art.id, title: art.title });
    });

    paymentClaims.forEach((claim) => {
      claim.items.forEach((item) => {
        if (!map.has(item.artworkId)) {
          map.set(item.artworkId, { id: item.artworkId, title: item.title });
        }
      });
    });

    return Array.from(map.values());
  }, [paymentClaims]);

  useEffect(() => {
    setQuantityInputs((prev) => {
      const next = { ...prev };
      inventoryArtworks.forEach((art) => {
        if (!next[art.id]) {
          next[art.id] = String(getTotalQuantity(art.id, 1));
        }
      });
      return next;
    });
  }, [inventoryArtworks, getTotalQuantity]);

  // Load data from localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }

    const saved = localStorage.getItem("artifyAdminData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setArtList(data.art || []);
        setNewsList(data.news || []);
        setDealList(data.deals || []);
        setHeroImages(data.heroImages || heroImages);
        setArtistsImages(data.artistsImages || []);
      } catch (e) {
        console.error("Failed to load admin data", e);
      }
    }
  }, [isLoggedIn, navigate]);

  // Save data to localStorage
  const saveData = () => {
    const data = {
      art: artList,
      news: newsList,
      deals: dealList,
      heroImages,
      artistsImages,
    };
    localStorage.setItem("artifyAdminData", JSON.stringify(data));
    toast({
      title: "Success",
      description: "Data saved successfully",
    });
  };

  // Art operations
  const addArt = () => {
    if (!newArt.title || !newArt.artist || !newArt.price) {
      toast({
        title: "Error",
        description: "Please fill all art fields",
        variant: "destructive",
      });
      return;
    }
    const art: Art = {
      id: Date.now().toString(),
      title: newArt.title,
      artist: newArt.artist,
      price: parseFloat(newArt.price),
      image: "",
    };
    setArtList([...artList, art]);
    setNewArt({ title: "", artist: "", price: "" });
    saveData();
  };

  const removeArt = (id: string) => {
    setArtList(artList.filter((a) => a.id !== id));
    saveData();
  };

  // News operations
  const addNews = () => {
    if (!newNews.title || !newNews.content) {
      toast({
        title: "Error",
        description: "Please fill all news fields",
        variant: "destructive",
      });
      return;
    }
    const news: News = {
      id: Date.now().toString(),
      title: newNews.title,
      content: newNews.content,
      date: new Date().toLocaleDateString(),
    };
    setNewsList([...newsList, news]);
    setNewNews({ title: "", content: "" });
    saveData();
  };

  const removeNews = (id: string) => {
    setNewsList(newsList.filter((n) => n.id !== id));
    saveData();
  };

  // Deals operations
  const addDeal = () => {
    if (!newDeal.title || !newDeal.discount || !newDeal.code) {
      toast({
        title: "Error",
        description: "Please fill all deal fields",
        variant: "destructive",
      });
      return;
    }
    const deal: Deal = {
      id: Date.now().toString(),
      title: newDeal.title,
      discount: parseFloat(newDeal.discount),
      code: newDeal.code.toUpperCase(),
    };
    setDealList([...dealList, deal]);
    setNewDeal({ title: "", discount: "", code: "" });
    saveData();
  };

  const removeDeal = (id: string) => {
    setDealList(dealList.filter((d) => d.id !== id));
    saveData();
  };

  // Image upload handlers
  const handleImageUpload = (
    type: "heroSection" | "forCollector" | "forArtists" | "forWorld",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setHeroImages({ ...heroImages, [type]: imageData });
        localStorage.setItem(`heroImage_${type}`, imageData);
        toast({
          title: "Success",
          description: `Image updated for ${type}`,
        });
        saveData();
      };
      reader.readAsDataURL(file);
    }
  };

  // Add artist image for demo/removal
  const addArtistImage = () => {
    const newImage = {
      id: Date.now().toString(),
      name: `Artist ${artistsImages.length + 1}`,
      image: "",
      uploadedDate: new Date().toLocaleDateString(),
    };
    setArtistsImages([...artistsImages, newImage]);
    saveData();
  };

  const removeArtistImage = (id: string) => {
    setArtistsImages(artistsImages.filter((img) => img.id !== id));
    saveData();
  };

  const updateArtistImageUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setArtistsImages(
          artistsImages.map((img) =>
            img.id === id ? { ...img, image: imageData } : img
          )
        );
        saveData();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6" />
            <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { id: "art", label: "Art Management", icon: FileText },
              { id: "news", label: "News & Updates", icon: FileText },
              { id: "deals", label: "Deals & Discounts", icon: Tag },
              { id: "images", label: "Hero Images", icon: Image },
              { id: "payments", label: "Payments", icon: Tag },
              { id: "featured", label: "Featured Listings", icon: Sparkles },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | "art"
                      | "news"
                      | "deals"
                      | "images"
                      | "payments"
                      | "featured"
                      | "settings"
                  )
                }
                className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Art Management */}
        {activeTab === "art" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-4">Add New Art</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <Input
                  placeholder="Art Title"
                  value={newArt.title}
                  onChange={(e) =>
                    setNewArt({ ...newArt, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Artist Name"
                  value={newArt.artist}
                  onChange={(e) =>
                    setNewArt({ ...newArt, artist: e.target.value })
                  }
                />
                <Input
                  placeholder="Price (PKR)"
                  type="number"
                  value={newArt.price}
                  onChange={(e) =>
                    setNewArt({ ...newArt, price: e.target.value })
                  }
                />
                <Button
                  onClick={addArt}
                  className="bg-gradient-to-r from-orange-500 to-red-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Art
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-4">
                Art List ({artList.length})
              </h2>
              <div className="space-y-2">
                {artList.length === 0 ? (
                  <p className="text-gray-500">No art items added yet</p>
                ) : (
                  artList.map((art) => (
                    <div
                      key={art.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                    >
                      <div>
                        <p className="font-medium">{art.title}</p>
                        <p className="text-sm text-gray-600">
                          by {art.artist} - PKR {art.price.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArt(art.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* News Management */}
        {activeTab === "news" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-4">Add News</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  placeholder="News Title"
                  value={newNews.title}
                  onChange={(e) =>
                    setNewNews({ ...newNews, title: e.target.value })
                  }
                />
                <div>
                  <input
                    type="text"
                    placeholder="News Content"
                    value={newNews.content}
                    onChange={(e) =>
                      setNewNews({ ...newNews, content: e.target.value })
                    }
                    className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <Button
                  onClick={addNews}
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-fit"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add News
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-4">
                News List ({newsList.length})
              </h2>
              <div className="space-y-2">
                {newsList.length === 0 ? (
                  <p className="text-gray-500">No news items added yet</p>
                ) : (
                  newsList.map((news) => (
                    <div
                      key={news.id}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded border"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{news.title}</p>
                        <p className="text-sm text-gray-600">{news.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{news.date}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNews(news.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Deals Management */}
        {activeTab === "deals" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-4">Add Deal</h2>
              <div className="grid md:grid-cols-5 gap-4">
                <Input
                  placeholder="Deal Title"
                  value={newDeal.title}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Discount %"
                  type="number"
                  value={newDeal.discount}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, discount: e.target.value })
                  }
                />
                <Input
                  placeholder="Promo Code"
                  value={newDeal.code}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, code: e.target.value })
                  }
                />
                <Button
                  onClick={addDeal}
                  className="bg-gradient-to-r from-orange-500 to-red-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Deal
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-4">
                Deals List ({dealList.length})
              </h2>
              <div className="space-y-2">
                {dealList.length === 0 ? (
                  <p className="text-gray-500">No deals added yet</p>
                ) : (
                  dealList.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                    >
                      <div>
                        <p className="font-medium">{deal.title}</p>
                        <p className="text-sm text-gray-600">
                          {deal.discount}% OFF - Code: {deal.code}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDeal(deal.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hero Images Management */}
        {activeTab === "images" && (
          <div className="space-y-6">
            {/* Hero Section Image */}
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-4">
                Hero Section Image
              </h2>
              <div className="space-y-4">
                {heroImages.heroSection && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Current Image:</p>
                    <img
                      src={heroImages.heroSection}
                      alt="Hero Section"
                      className="max-w-xs h-auto rounded border"
                    />
                  </div>
                )}
                <label className="cursor-pointer">
                  <Button variant="outline" type="button">
                    <Image className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("heroSection", e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {[
              { key: "forCollector", label: "For Collector Image" },
              { key: "forArtists", label: "For Artists Image" },
              { key: "forWorld", label: "For World Image" },
            ].map((item) => (
              <div key={item.key} className="bg-white rounded-lg p-6 border">
                <h2 className="text-xl font-serif font-bold mb-4">
                  {item.label}
                </h2>
                <div className="space-y-4">
                  {heroImages[item.key as keyof typeof heroImages] && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Current Image:</p>
                      <img
                        src={
                          heroImages[item.key as keyof typeof heroImages]
                        }
                        alt={item.label}
                        className="max-w-xs h-auto rounded border"
                      />
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <Button variant="outline" type="button">
                      <Image className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(
                          item.key as "forCollector" | "forArtists" | "forWorld",
                          e
                        )
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ))}

            {/* Artists Images Management */}
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-4">
                Artists Uploaded Images ({artistsImages.length})
              </h2>
              <Button
                onClick={addArtistImage}
                className="mb-4 bg-gradient-to-r from-orange-500 to-red-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Artist Image
              </Button>
              <div className="space-y-3">
                {artistsImages.length === 0 ? (
                  <p className="text-gray-500">No artist images</p>
                ) : (
                  artistsImages.map((img) => (
                    <div
                      key={img.id}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded border"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{img.name}</p>
                        <p className="text-xs text-gray-500 mb-2">
                          Uploaded: {img.uploadedDate}
                        </p>
                        {img.image && (
                          <img
                            src={img.image}
                            alt={img.name}
                            className="max-w-xs h-auto rounded border mb-2"
                          />
                        )}
                        {!img.image && (
                          <label className="cursor-pointer inline-block">
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                            >
                              <Image className="w-4 h-4 mr-2" />
                              Upload Image
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                updateArtistImageUpload(img.id, e)
                              }
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArtistImage(img.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-4">Payment Verification</h2>
              {paymentClaims.length === 0 ? (
                <p className="text-gray-500">No payment claims submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {paymentClaims.map((claim) => (
                    <div key={claim.id} className="rounded-lg border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <p className="font-medium">Ref: {claim.referenceNumber}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            claim.status === "verified"
                              ? "bg-green-100 text-green-700"
                              : claim.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {claim.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">
                        {claim.customerName} | {claim.customerEmail} | {claim.customerPhone}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Amount: PKR {claim.amount.toLocaleString()} | Submitted: {new Date(claim.submittedAt).toLocaleString()}
                      </p>

                      <div className="mb-3 text-sm text-gray-700">
                        {claim.items.map((item) => (
                          <p key={`${claim.id}-${item.artworkId}`}>
                            {item.title} x {item.quantity} (PKR {item.unitPrice.toLocaleString()} each)
                          </p>
                        ))}
                      </div>

                      {claim.screenshotDataUrl && (
                        <img
                          src={claim.screenshotDataUrl}
                          alt={`Payment proof ${claim.referenceNumber}`}
                          className="max-h-64 rounded border mb-3"
                        />
                      )}

                      {claim.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              verifyClaim(claim.id);
                              toast({ title: "Payment verified" });
                            }}
                          >
                            Mark Paid
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              rejectClaim(claim.id);
                              toast({ title: "Payment marked unpaid" });
                            }}
                          >
                            Mark Unpaid
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-4">Inventory Status</h2>
              <div className="space-y-3">
                {inventoryArtworks.map((art) => {
                  const sold = getSoldQuantity(art.id);
                  const booked = getBookedQuantity(art.id);
                  const available = getAvailableQuantity(art.id, 1);

                  return (
                    <div key={art.id} className="rounded border p-3">
                      <p className="font-medium mb-2">{art.title}</p>
                      <div className="grid gap-2 md:grid-cols-5 md:items-center">
                        <Input
                          type="number"
                          min={0}
                          value={quantityInputs[art.id] ?? ""}
                          onChange={(e) =>
                            setQuantityInputs((prev) => ({
                              ...prev,
                              [art.id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            const parsed = Number(quantityInputs[art.id] || "0");
                            setTotalQuantity(art.id, parsed);
                            toast({ title: "Quantity updated" });
                          }}
                        >
                          Save Qty
                        </Button>
                        <p className="text-sm text-gray-600">Sold: {sold}</p>
                        <p className="text-sm text-gray-600">Booked: {booked}</p>
                        <p className="text-sm font-medium text-gray-800">Available: {available}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "featured" && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  Featured Artworks
                </h2>
                <span className="text-sm text-gray-500">
                  {featuredListings.filter((r) => r.is_featured && r.featured_until && new Date(r.featured_until) > new Date()).length} active
                </span>
              </div>
              {featuredListings.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">No artwork listings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-gray-500 border-b">
                      <tr>
                        <th className="py-2 pr-4">Item</th>
                        <th className="py-2 pr-4">Artist</th>
                        <th className="py-2 pr-4">Price</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featuredListings.map((row) => {
                        const active = row.is_featured && row.featured_until && new Date(row.featured_until) > new Date();
                        return (
                          <tr key={row.id} className="border-b last:border-0">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-3">
                                {row.image_url && (
                                  <img src={row.image_url} alt={row.title} className="w-12 h-12 rounded object-cover" />
                                )}
                                <span className="font-medium">{row.title}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-gray-600">{row.artist_name}</td>
                            <td className="py-3 pr-4">PKR {Number(row.price).toLocaleString()}</td>
                            <td className="py-3 pr-4">
                              {active ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-xs font-medium">
                                  <Sparkles className="w-3 h-3" /> Featured · until {new Date(row.featured_until).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">Standard</span>
                              )}
                            </td>
                            <td className="py-3 pr-4">
                              <Button
                                size="sm"
                                variant={active ? "outline" : "default"}
                                onClick={() => toggleFeatured("listed_artworks", row)}
                              >
                                {active ? "Unfeature" : "Feature 7d"}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-orange-500" />
                  Featured Services
                </h2>
                <span className="text-sm text-gray-500">
                  {featuredServices.filter((r) => r.is_featured && r.featured_until && new Date(r.featured_until) > new Date()).length} active
                </span>
              </div>
              {featuredServices.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">No services yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-gray-500 border-b">
                      <tr>
                        <th className="py-2 pr-4">Service</th>
                        <th className="py-2 pr-4">Artist</th>
                        <th className="py-2 pr-4">Price</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featuredServices.map((row) => {
                        const active = row.is_featured && row.featured_until && new Date(row.featured_until) > new Date();
                        return (
                          <tr key={row.id} className="border-b last:border-0">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-3">
                                {row.image_url && (
                                  <img src={row.image_url} alt={row.title} className="w-12 h-12 rounded object-cover" />
                                )}
                                <span className="font-medium">{row.title}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-gray-600">{row.artist_name}</td>
                            <td className="py-3 pr-4">PKR {Number(row.price).toLocaleString()}</td>
                            <td className="py-3 pr-4">
                              {active ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-xs font-medium">
                                  <Sparkles className="w-3 h-3" /> Featured · until {new Date(row.featured_until).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">Standard</span>
                              )}
                            </td>
                            <td className="py-3 pr-4">
                              <Button
                                size="sm"
                                variant={active ? "outline" : "default"}
                                onClick={() => toggleFeatured("services", row)}
                              >
                                {active ? "Unfeature" : "Feature 7d"}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-serif font-bold mb-6">
                Change Admin Credentials
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Username
                  </label>
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {
                    if (!newPassword.trim()) {
                      toast({
                        title: "Error",
                        description: "Password cannot be empty",
                        variant: "destructive",
                      });
                      return;
                    }
                    updateCredentials(newUsername, newPassword);
                    toast({
                      title: "Success",
                      description: "Credentials updated successfully",
                    });
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500"
                >
                  Update Credentials
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
