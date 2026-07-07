const baseUrl = process.env.SAJU_API_BASE_URL ?? "http://127.0.0.1:3000";
const endpoint = new URL("/api/debug/public-env", baseUrl);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const response = await fetch(endpoint);
const json = await response.json();

assert(response.status === 200, `Expected HTTP 200, got ${response.status}`);
assert(json.ok === true, "Expected ok: true");
assert(json.env && typeof json.env === "object", "Expected env object");
assert(typeof json.env.NEXT_PUBLIC_SUPABASE_URL === "boolean", "Expected NEXT_PUBLIC_SUPABASE_URL boolean");
assert(typeof json.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "boolean", "Expected NEXT_PUBLIC_SUPABASE_ANON_KEY boolean");
assert(typeof json.env.NEXT_PUBLIC_SITE_URL === "boolean", "Expected NEXT_PUBLIC_SITE_URL boolean");
assert(
  json.supabaseUrlHost === null || typeof json.supabaseUrlHost === "string",
  "Expected supabaseUrlHost string or null",
);
assert(typeof json.environment === "string", "Expected environment string");

console.log("Public env smoke test passed.");
