import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export interface LikedArtwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: string;
  href?: string;
  source: string;
}

interface LikedContextType {
  likedItems: LikedArtwork[];
  totalLiked: number;
  isLiked: (id: string) => boolean;
  toggleLike: (item: LikedArtwork) => void;
  removeLike: (id: string) => void;
  clearLikes: () => void;
}

const STORAGE_KEY_PREFIX = "artify_liked_items";

const LikedContext = createContext<LikedContextType | undefined>(undefined);

const getStoredLikes = (userId: string): LikedArtwork[] => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}:${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LikedArtwork[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const LikedProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const [likedItems, setLikedItems] = useState<LikedArtwork[]>([]);

  const activeUserId = user?.id ?? null;

  useEffect(() => {
    if (loading) return;
    if (!activeUserId) {
      setLikedItems([]);
      return;
    }
    setLikedItems(getStoredLikes(activeUserId));
  }, [activeUserId, loading]);

  const persist = (items: LikedArtwork[]) => {
    setLikedItems(items);
    if (!activeUserId) return;
    localStorage.setItem(`${STORAGE_KEY_PREFIX}:${activeUserId}`, JSON.stringify(items));
  };

  const isLiked = (id: string) => likedItems.some((item) => item.id === id);

  const toggleLike = (item: LikedArtwork) => {
    if (isLiked(item.id)) {
      persist(likedItems.filter((liked) => liked.id !== item.id));
      return;
    }
    persist([item, ...likedItems]);
  };

  const removeLike = (id: string) => {
    persist(likedItems.filter((item) => item.id !== id));
  };

  const clearLikes = () => {
    persist([]);
  };

  const value = useMemo(
    () => ({ likedItems, totalLiked: likedItems.length, isLiked, toggleLike, removeLike, clearLikes }),
    [likedItems],
  );

  return <LikedContext.Provider value={value}>{children}</LikedContext.Provider>;
};

export const useLikedArtworks = () => {
  const context = useContext(LikedContext);
  if (!context) throw new Error("useLikedArtworks must be used within LikedProvider");
  return context;
};
