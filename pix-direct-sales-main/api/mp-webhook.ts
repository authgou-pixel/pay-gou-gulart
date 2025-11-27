import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL as string;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(200).json({ ok: true });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let paymentId = "";
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      paymentId = body?.data?.id || body?.id || body?.resource?.id || body?.payment?.id || "";
    } else {
      const q: any = req.query || {};
      paymentId = q?.id || q?.data_id || "";
    }

    if (!paymentId) {
      return res.status(200).json({ ok: true });
    }

    const { data: sale } = await supabase
      .from("sales")
      .select("product_id,seller_id,buyer_email")
      .eq("payment_id", paymentId)
      .maybeSingle();

    if (!sale) {
      return res.status(200).json({ ok: true });
    }

    const { data: mpConfig } = await supabase
      .from("mercado_pago_config")
      .select("access_token")
      .eq("user_id", sale.seller_id)
      .single();

    if (!mpConfig) {
      return res.status(200).json({ ok: true });
    }

    const resp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpConfig.access_token}` },
    });
    const data = await resp.json();
    if (!resp.ok) {
      return res.status(200).json({ ok: true });
    }

    const status = data?.status || "pending";

    await supabase.from("sales").update({ payment_status: status }).eq("payment_id", paymentId);
    await supabase
      .from("memberships")
      .update({ status })
      .eq("product_id", sale.product_id)
      .eq("buyer_email", sale.buyer_email);

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(200).json({ ok: true });
  }
}

