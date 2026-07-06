const baseUrl = process.env.SAJU_API_BASE_URL ?? "http://127.0.0.1:3000";
const endpoint = new URL("/api/health", baseUrl);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const response = await fetch(endpoint);
const json = await response.json();

assert(response.status === 200, `Expected HTTP 200, got ${response.status}`);
assert(json.ok === true, "Expected ok: true");
assert(json.status === "healthy", `Expected status healthy, got ${json.status}`);
assert(json.app === "바른명리 AI", `Expected app 바른명리 AI, got ${json.app}`);
assert(typeof json.timestamp === "string", "Expected timestamp string");
assert(!Number.isNaN(Date.parse(json.timestamp)), "Expected ISO timestamp");
assert(typeof json.environment === "string", "Expected environment string");

console.log("Health smoke test passed.");
