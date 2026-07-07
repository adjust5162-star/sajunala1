import { NextResponse } from "next/server";

function getSupabaseUrlHost(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).hostname;
  } catch {
    return "invalid-url";
  }
}

export function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return NextResponse.json({
    ok: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(supabaseUrl),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(supabaseAnonKey),
      NEXT_PUBLIC_SITE_URL: Boolean(siteUrl),
    },
    supabaseUrlHost: getSupabaseUrlHost(supabaseUrl),
    environment: process.env.NODE_ENV || "unknown",
  });
}
