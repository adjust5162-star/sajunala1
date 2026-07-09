import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createBrowserSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }

  return createClient(supabaseUrl, supabasePublishableKey);
}
