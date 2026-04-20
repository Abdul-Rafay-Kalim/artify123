import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Gateway = "jazzcash" | "easypaisa";

interface RequestBody {
  gateway: Gateway;
  orderId: string;
  amountPkr: number;
  customer: {
    name?: string;
    email?: string;
    phone?: string;
  };
  description?: string;
}

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function formatJazzDateTime(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}${hh}${mi}${ss}`;
}

function formatEasyPaisaExpiry(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd} ${hh}${mi}${ss}`;
}

async function hmacSha256Hex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function buildJazzCashRedirect(body: RequestBody) {
  const merchantId = getRequiredEnv("JAZZCASH_MERCHANT_ID");
  const password = getRequiredEnv("JAZZCASH_PASSWORD");
  const integritySalt = getRequiredEnv("JAZZCASH_INTEGRITY_SALT");
  const actionUrl =
    Deno.env.get("JAZZCASH_API_URL") ||
    "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction";

  const now = new Date();
  const expiry = new Date(now.getTime() + 60 * 60 * 1000);
  const ppTxnDateTime = formatJazzDateTime(now);
  const ppTxnExpiryDateTime = formatJazzDateTime(expiry);
  const amountPaisa = Math.round(body.amountPkr * 100);

  const fields: Record<string, string> = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: merchantId,
    pp_Password: password,
    pp_TxnRefNo: body.orderId,
    pp_Amount: String(amountPaisa),
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: ppTxnDateTime,
    pp_BillReference: body.orderId,
    pp_Description: body.description || `Artify payment for order ${body.orderId}`,
    pp_TxnExpiryDateTime: ppTxnExpiryDateTime,
    pp_ReturnURL: getRequiredEnv("JAZZCASH_RETURN_URL"),
    ppmpf_1: body.customer.phone || "",
  };

  const keysForHash = Object.keys(fields)
    .filter((key) => fields[key] !== "")
    .sort();
  const secureHashPayload = [integritySalt, ...keysForHash.map((key) => fields[key])].join("&");
  fields.pp_SecureHash = await hmacSha256Hex(integritySalt, secureHashPayload);

  return {
    gateway: "jazzcash",
    redirect: {
      method: "POST",
      actionUrl,
      fields,
    },
  };
}

async function buildEasyPaisaRedirect(body: RequestBody) {
  const storeId = getRequiredEnv("EASYPAISA_STORE_ID");
  const hashKey = getRequiredEnv("EASYPAISA_HASH_KEY");
  const actionUrl = Deno.env.get("EASYPAISA_API_URL") || "https://easypay.easypaisa.com.pk/easypay/Index.jsf";

  const expiry = new Date(Date.now() + 60 * 60 * 1000);
  const amountFormatted = body.amountPkr.toFixed(2);
  const postBackURL = getRequiredEnv("EASYPAISA_POST_BACK_URL");

  const fields: Record<string, string> = {
    storeId,
    amount: amountFormatted,
    postBackURL,
    orderRefNum: body.orderId,
    expiryDate: formatEasyPaisaExpiry(expiry),
    autoRedirect: "1",
    paymentMethod: "InitialRequest",
    emailAddr: body.customer.email || "",
    mobileNum: body.customer.phone || "",
  };

  const hashPayload = [
    fields.amount,
    fields.storeId,
    fields.postBackURL,
    fields.orderRefNum,
    fields.expiryDate,
    fields.autoRedirect,
    fields.paymentMethod,
  ].join("&");

  fields.merchantHashedReq = await hmacSha256Hex(hashKey, hashPayload);

  return {
    gateway: "easypaisa",
    redirect: {
      method: "POST",
      actionUrl,
      fields,
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as RequestBody;
    if (!body.orderId || !body.gateway || !body.amountPkr || body.amountPkr <= 0) {
      return new Response(JSON.stringify({ error: "Invalid payment request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = body.gateway === "jazzcash"
      ? await buildJazzCashRedirect(body)
      : await buildEasyPaisaRedirect(body);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("create-payment-session error", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
