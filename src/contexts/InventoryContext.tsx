import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ClaimStatus = "pending" | "verified" | "rejected";

export interface PaymentClaimItem {
  artworkId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface PaymentClaim {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  screenshotDataUrl: string;
  submittedAt: string;
  status: ClaimStatus;
  items: PaymentClaimItem[];
}

interface InventoryRecord {
  artworkId: string;
  totalQuantity: number;
  soldQuantity: number;
}

interface CreatePaymentClaimInput {
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  screenshotDataUrl: string;
  items: PaymentClaimItem[];
}

interface InventoryContextType {
  paymentClaims: PaymentClaim[];
  ensureArtworkRecord: (artworkId: string, defaultQuantity?: number) => void;
  setTotalQuantity: (artworkId: string, totalQuantity: number) => void;
  getTotalQuantity: (artworkId: string, fallbackQuantity?: number) => number;
  getSoldQuantity: (artworkId: string) => number;
  getBookedQuantity: (artworkId: string) => number;
  getAvailableQuantity: (artworkId: string, fallbackQuantity?: number) => number;
  getArtworkStatus: (artworkId: string, fallbackQuantity?: number) => "in-stock" | "booked" | "sold-out";
  isPurchasable: (artworkId: string, fallbackQuantity?: number) => boolean;
  createPaymentClaim: (input: CreatePaymentClaimInput) => PaymentClaim;
  verifyClaim: (claimId: string) => void;
  rejectClaim: (claimId: string) => void;
}

const INVENTORY_STORAGE_KEY = "artifyInventoryRecords";
const CLAIMS_STORAGE_KEY = "artifyPaymentClaims";

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const clampNonNegative = (value: number) => Math.max(0, Number.isFinite(value) ? value : 0);

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>([]);
  const [paymentClaims, setPaymentClaims] = useState<PaymentClaim[]>([]);

  useEffect(() => {
    try {
      const savedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (savedInventory) {
        setInventoryRecords(JSON.parse(savedInventory));
      }

      const savedClaims = localStorage.getItem(CLAIMS_STORAGE_KEY);
      if (savedClaims) {
        setPaymentClaims(JSON.parse(savedClaims));
      }
    } catch (error) {
      console.error("Failed to restore inventory state", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventoryRecords));
  }, [inventoryRecords]);

  useEffect(() => {
    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(paymentClaims));
  }, [paymentClaims]);

  const pendingBookedMap = useMemo(() => {
    const map = new Map<string, number>();
    paymentClaims
      .filter((claim) => claim.status === "pending")
      .forEach((claim) => {
        claim.items.forEach((item) => {
          const current = map.get(item.artworkId) || 0;
          map.set(item.artworkId, current + item.quantity);
        });
      });
    return map;
  }, [paymentClaims]);

  const ensureArtworkRecord = (artworkId: string, defaultQuantity = 1) => {
    setInventoryRecords((prev) => {
      if (prev.some((record) => record.artworkId === artworkId)) {
        return prev;
      }

      return [
        ...prev,
        {
          artworkId,
          totalQuantity: clampNonNegative(defaultQuantity) || 1,
          soldQuantity: 0,
        },
      ];
    });
  };

  const getRecord = (artworkId: string, fallbackQuantity = 1): InventoryRecord => {
    const found = inventoryRecords.find((record) => record.artworkId === artworkId);
    if (found) return found;

    return {
      artworkId,
      totalQuantity: clampNonNegative(fallbackQuantity) || 1,
      soldQuantity: 0,
    };
  };

  const setTotalQuantity = (artworkId: string, totalQuantity: number) => {
    const safeTotal = clampNonNegative(totalQuantity);
    setInventoryRecords((prev) => {
      const found = prev.find((record) => record.artworkId === artworkId);
      if (!found) {
        return [
          ...prev,
          {
            artworkId,
            totalQuantity: safeTotal,
            soldQuantity: 0,
          },
        ];
      }

      return prev.map((record) => {
        if (record.artworkId !== artworkId) return record;
        return {
          ...record,
          totalQuantity: safeTotal,
          soldQuantity: Math.min(record.soldQuantity, safeTotal),
        };
      });
    });
  };

  const getTotalQuantity = (artworkId: string, fallbackQuantity = 1) => getRecord(artworkId, fallbackQuantity).totalQuantity;

  const getSoldQuantity = (artworkId: string) => {
    const found = inventoryRecords.find((record) => record.artworkId === artworkId);
    return found?.soldQuantity || 0;
  };

  const getBookedQuantity = (artworkId: string) => pendingBookedMap.get(artworkId) || 0;

  const getAvailableQuantity = (artworkId: string, fallbackQuantity = 1) => {
    const record = getRecord(artworkId, fallbackQuantity);
    const booked = getBookedQuantity(artworkId);
    return Math.max(record.totalQuantity - record.soldQuantity - booked, 0);
  };

  const getArtworkStatus = (artworkId: string, fallbackQuantity = 1) => {
    const record = getRecord(artworkId, fallbackQuantity);
    const remainingAfterSold = record.totalQuantity - record.soldQuantity;
    if (remainingAfterSold <= 0) return "sold-out";

    const booked = getBookedQuantity(artworkId);
    if (booked > 0) return "booked";

    return "in-stock";
  };

  const isPurchasable = (artworkId: string, fallbackQuantity = 1) => getAvailableQuantity(artworkId, fallbackQuantity) > 0;

  const createPaymentClaim = (input: CreatePaymentClaimInput) => {
    input.items.forEach((item) => ensureArtworkRecord(item.artworkId, item.quantity));

    const claim: PaymentClaim = {
      id: Date.now().toString(),
      referenceNumber: input.referenceNumber,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      amount: input.amount,
      screenshotDataUrl: input.screenshotDataUrl,
      submittedAt: new Date().toISOString(),
      status: "pending",
      items: input.items,
    };

    setPaymentClaims((prev) => [claim, ...prev]);
    return claim;
  };

  const verifyClaim = (claimId: string) => {
    const claim = paymentClaims.find((item) => item.id === claimId);
    if (!claim || claim.status !== "pending") return;

    setInventoryRecords((prev) => {
      const next = [...prev];
      claim.items.forEach((item) => {
        const index = next.findIndex((record) => record.artworkId === item.artworkId);
        if (index < 0) {
          next.push({
            artworkId: item.artworkId,
            totalQuantity: item.quantity,
            soldQuantity: item.quantity,
          });
        } else {
          const record = next[index];
          const soldQuantity = Math.min(record.totalQuantity, record.soldQuantity + item.quantity);
          next[index] = { ...record, soldQuantity };
        }
      });
      return next;
    });

    setPaymentClaims((prev) =>
      prev.map((item) =>
        item.id === claimId
          ? {
              ...item,
              status: "verified",
            }
          : item
      )
    );
  };

  const rejectClaim = (claimId: string) => {
    setPaymentClaims((prev) =>
      prev.map((item) =>
        item.id === claimId
          ? {
              ...item,
              status: "rejected",
            }
          : item
      )
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        paymentClaims,
        ensureArtworkRecord,
        setTotalQuantity,
        getTotalQuantity,
        getSoldQuantity,
        getBookedQuantity,
        getAvailableQuantity,
        getArtworkStatus,
        isPurchasable,
        createPaymentClaim,
        verifyClaim,
        rejectClaim,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
};
