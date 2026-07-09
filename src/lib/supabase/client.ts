import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserKey, getSupabaseUrl } from "./env";

export function createBrowserSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = getSupabaseUrl();
  const supabasePublishableKey = getSupabaseBrowserKey();

  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
