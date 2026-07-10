import { NextResponse } from "next/server";
import { getSupabaseBrowserKey, getSupabaseUrl } from "../../../../lib/supabase/env";

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
  const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serverSupabaseUrl = process.env.SUPABASE_URL;
  const supabaseUrl = getSupabaseUrl();
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serverSupabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  const supabaseBrowserKey = getSupabaseBrowserKey();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return NextResponse.json({
    ok: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(supabaseUrl),
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: Boolean(supabasePublishableKey),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(supabaseAnonKey),
      SUPABASE_URL: Boolean(serverSupabaseUrl),
      SUPABASE_PUBLISHABLE_KEY: Boolean(serverSupabasePublishableKey),
      SUPABASE_BROWSER_KEY_AVAILABLE: Boolean(supabaseBrowserKey),
      NEXT_PUBLIC_SITE_URL: Boolean(siteUrl),
    },
    supabaseUrlWasNormalized: Boolean(rawSupabaseUrl && supabaseUrl && rawSupabaseUrl !== supabaseUrl),
    supabaseUrlHost: getSupabaseUrlHost(supabaseUrl),
    environment: process.env.NODE_ENV || "unknown",
  });
}
