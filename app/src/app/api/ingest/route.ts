// app/api/ingest/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Context } from "@farcaster/miniapp-core";

// --- CORS helpers (wildcard) ---
function applyCORS(req: NextRequest, res: NextResponse) {
  // Allow all origins (no credentials)
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Vary", "Origin");

  // Methods your route supports
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  // Echo requested headers, or allow common ones
  res.headers.set(
    "Access-Control-Allow-Headers",
    req.headers.get("access-control-request-headers") ?? "Content-Type, Authorization"
  );

  // Optional: cache preflight for 1 hour
  res.headers.set("Access-Control-Max-Age", "3600");

  // DO NOT set Allow-Credentials with a wildcard origin
  return res;
}

// Preflight handler
export async function OPTIONS(req: NextRequest) {
  return applyCORS(req, new NextResponse(null, { status: 204 }));
}

// --- Your handler ---
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const farcaster_context: Context.MiniAppContext = body.farcaster_context;
    const request_context = body.request_context;

    const { error } = await supabase
      .from("dump")
      .insert({ farcaster_context, request_context })
      .select("id")
      .single();

    if (error) {
      console.error("failed to insert data:", error);
      return applyCORS(req, NextResponse.json({ error: "internal error" }, { status: 500 }));
    }

    return applyCORS(req, NextResponse.json({ ok: true }, { status: 201 }));
  } catch (err) {
    console.error("failed to parse request:", err);
    return applyCORS(req, NextResponse.json({ error: "failed to parse request" }, { status: 400 }));
  }
}
