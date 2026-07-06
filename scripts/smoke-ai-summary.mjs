const baseUrl = process.env.SAJU_API_BASE_URL ?? "http://127.0.0.1:3000";
const endpoint = new URL("/api/ai/summary", baseUrl);

const validPayload = {
  plan: "free",
  section: "free_summary",
  tone: "professional",
  saju: {},
};

const invalidPayload = {
  plan: "pro",
  section: "free_summary",
  tone: "professional",
  saju: null,
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

const valid = await postJson(validPayload);
assert(valid.response.status === 501, `Expected valid request HTTP 501, got ${valid.response.status}`);
assert(valid.json.ok === false, "Expected valid request ok: false");
assert(valid.json.error === "AI_NOT_CONFIGURED", `Expected AI_NOT_CONFIGURED, got ${valid.json.error}`);
assert(valid.json.meta?.plan === "free", "Expected meta.plan free");
assert(valid.json.meta?.section === "free_summary", "Expected meta.section free_summary");
assert(valid.json.meta?.targetKoreanChars === 900, "Expected targetKoreanChars 900");
assert(valid.json.meta?.maxKoreanChars === 1500, "Expected maxKoreanChars 1500");

const invalid = await postJson(invalidPayload);
assert(invalid.response.status === 400, `Expected invalid request HTTP 400, got ${invalid.response.status}`);
assert(invalid.json.ok === false, "Expected invalid request ok: false");
assert(invalid.json.error === "INVALID_INPUT", `Expected INVALID_INPUT, got ${invalid.json.error}`);

console.log("AI summary smoke test passed.");
