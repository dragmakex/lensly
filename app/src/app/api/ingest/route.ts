export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Context } from '@farcaster/miniapp-core';


const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const farcaster_context: Context.MiniAppContext = body.farcaster_context;
        const request_context = body.request_context;

        const { error } = await supabase
            .from("dump")
            .insert({ farcaster_context, request_context })
            .select("id")
            .single();

        if (error) {
            console.error("failed to insert data:", error);
            return NextResponse.json({ error: "internal error" }, { status: 500 });
        }

    } catch (error) {
        console.error("failed to parse request:", error);
        return NextResponse.json({ error: "failed to parse request" }, { status: 400 });
    }



    return NextResponse.json({ status: 201 });
}
