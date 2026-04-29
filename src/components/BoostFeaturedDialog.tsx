import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type BoostTarget = "listed_artworks" | "services";

interface BoostFeaturedDialogProps {
  recordId: string;
  table: BoostTarget;
  itemTitle: string;
  isAlreadyFeatured?: boolean;
  featuredUntil?: string | null;
  onBoosted?: () => void;
  trigger?: React.ReactNode;
}

const PLANS = [
  { days: 3, price: 500, label: "3 days" },
  { days: 7, price: 1000, label: "7 days" },
  { days: 30, price: 3000, label: "30 days" },
];

const PAYMENT_METHODS = [
  { id: "easypaisa", label: "EasyPaisa" },
  { id: "jazzcash", label: "JazzCash" },
];

const BoostFeaturedDialog = ({
  recordId,
  table,
  itemTitle,
  isAlreadyFeatured,
  featuredUntil,
  onBoosted,
  trigger,
}: BoostFeaturedDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const [paymentMethod, setPaymentMethod] = useState("easypaisa");
  const [step, setStep] = useState<"select" | "paying" | "success">("select");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const plan = PLANS.find((p) => p.days === selectedDays)!;
  const stillFeatured =
    isAlreadyFeatured && featuredUntil && new Date(featuredUntil) > new Date();

  const handlePay = async () => {
    setLoading(true);
    setStep("paying");
    // Simulated payment delay
    await new Promise((r) => setTimeout(r, 1500));

    const featuredUntilDate = new Date();
    // If still featured, extend from current expiry
    const baseDate = stillFeatured ? new Date(featuredUntil!) : new Date();
    featuredUntilDate.setTime(
      baseDate.getTime() + selectedDays * 24 * 60 * 60 * 1000
    );

    const { error } = await (supabase as any)
      .from(table)
      .update({
        is_featured: true,
        featured_until: featuredUntilDate.toISOString(),
      })
      .eq("id", recordId);

    setLoading(false);
    if (error) {
      toast({
        title: "Boost failed",
        description: error.message,
        variant: "destructive",
      });
      setStep("select");
      return;
    }

    setStep("success");
    toast({
      title: "Listing boosted!",
      description: `"${itemTitle}" is now featured for ${selectedDays} days.`,
    });
    onBoosted?.();
  };

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) {
      // Reset after close animation
      setTimeout(() => {
        setStep("select");
        setSelectedDays(7);
        setPaymentMethod("easypaisa");
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {stillFeatured ? "Extend Boost" : "Boost"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        {step === "success" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif">
                <Sparkles className="w-5 h-5 text-primary" />
                You're featured!
              </DialogTitle>
              <DialogDescription>
                "{itemTitle}" will appear at the top of search results and the
                homepage for the next {selectedDays} days.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => handleClose(false)} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif">
                <Sparkles className="w-5 h-5 text-primary" />
                Boost to Featured
              </DialogTitle>
              <DialogDescription>
                Featured listings appear at the top of the homepage and explore
                pages, getting up to 5x more views.
              </DialogDescription>
            </DialogHeader>

            {stillFeatured && (
              <div className="rounded-md bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                Currently featured until{" "}
                {new Date(featuredUntil!).toLocaleDateString()}. Boosting will
                extend from that date.
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Choose duration
                </Label>
                <RadioGroup
                  value={String(selectedDays)}
                  onValueChange={(v) => setSelectedDays(Number(v))}
                  className="grid grid-cols-3 gap-2"
                >
                  {PLANS.map((p) => (
                    <Label
                      key={p.days}
                      htmlFor={`plan-${p.days}`}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-3 cursor-pointer transition-colors ${
                        selectedDays === p.days
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem
                        value={String(p.days)}
                        id={`plan-${p.days}`}
                        className="sr-only"
                      />
                      <span className="text-xs text-muted-foreground">
                        {p.label}
                      </span>
                      <span className="font-serif font-semibold">
                        PKR {p.price.toLocaleString()}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Payment method
                </Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-2 gap-2"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <Label
                      key={m.id}
                      htmlFor={`pm-${m.id}`}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                        paymentMethod === m.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem
                        value={m.id}
                        id={`pm-${m.id}`}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{m.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">
                  PKR {plan.price.toLocaleString()}
                </span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handlePay} disabled={loading} className="gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Pay PKR {plan.price.toLocaleString()}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BoostFeaturedDialog;
