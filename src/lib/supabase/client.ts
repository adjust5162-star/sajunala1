import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserKey, getSupabaseUrl } from "./env";

export function createBrowserSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = getSupabaseUrl();
  const supabasePublishableKey = getSupabaseBrowserKey();

  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }

  return createClient(supabaseUrl, supabasePublishableKey);
}
