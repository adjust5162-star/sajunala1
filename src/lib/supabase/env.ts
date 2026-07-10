export function getSupabaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;

  if (!rawUrl) {
    return undefined;
  }

  try {
    return new URL(rawUrl).origin;
  } catch {
    return rawUrl;
  }
}

export function getSupabaseBrowserKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY
  );
}
