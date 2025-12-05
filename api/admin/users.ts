import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

async function authorize(req: VercelRequest) {
  const SUPABASE_URL = process.env.SUPABASE_URL as string;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return { ok: false, status: 500 } as const;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const token = typeof authHeader === "string" && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return { ok: false, status: 401 } as const;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user?.email) return { ok: false, status: 401 } as const;
  const raw = process.env.ADMIN_EMAILS || "authgou@gmail.com";
  const admins = raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const isAdmin = admins.includes((data.user.email || "").toLowerCase());
  if (!isAdmin) return { ok: false, status: 403 } as const;
  return { ok: true, supabase, email: data.user.email! } as const;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const auth = await authorize(req);
  if (!auth.ok) return res.status(auth.status).json({ error: "Unauthorized" });
  try {
    const { data, error } = await auth.supabase
      .from("profiles")
      .select("id,email,name")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: "Failed to load users" });
    return res.status(200).json({ users: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Unexpected error" });
  }
}
