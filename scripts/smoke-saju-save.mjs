const baseUrl = process.env.SAJU_API_BASE_URL ?? "http://127.0.0.1:3000";
const endpoint = new URL("/api/saju/save", baseUrl);

const validPayload = {
  input_hash: "a".repeat(64),
  result: {
    pillars: {},
    fiveElements: {},
    tenGods: {},
    twelveShinsal: {},
    daewoon: [],
    sewoon: [],
    warnings: [],
  },
};

const invalidPayload = {
  ...validPayload,
  input_hash: "bad",
};

async function postJson(payload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await response.json();

  return { response, json };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const anonymous = await postJson(validPayload);
assert([401, 503].includes(anonymous.response.status), `Expected HTTP 401 or 503, got ${anonymous.response.status}`);
assert(
  ["AUTH_REQUIRED", "SUPABASE_NOT_CONFIGURED"].includes(anonymous.json.error),
  `Expected AUTH_REQUIRED or SUPABASE_NOT_CONFIGURED, got ${anonymous.json.error}`,
);
console.log("Anonymous save guard passed");

const invalid = await postJson(invalidPayload);
assert(invalid.response.status === 400, `Expected invalid request HTTP 400, got ${invalid.response.status}`);
assert(invalid.json.ok === false, "Expected invalid request ok: false");
assert(invalid.json.error === "INVALID_INPUT", `Expected INVALID_INPUT, got ${invalid.json.error}`);
console.log("Invalid save request passed");

console.log("All saju save smoke tests passed");
