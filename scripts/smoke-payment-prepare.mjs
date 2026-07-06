const baseUrl = process.env.SAJU_API_BASE_URL ?? "http://127.0.0.1:3000";
const endpoint = new URL("/api/payment/prepare", baseUrl);
const inputHash = "a".repeat(64);

const validPayload = {
  input_hash: inputHash,
  product: "pro_report",
  amount: 9900,
  currency: "KRW",
};

const invalidPayload = {
  input_hash: "not-a-hash",
  product: "pro_report",
  amount: 1000,
  currency: "KRW",
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
assert(valid.json.error === "PAYMENT_NOT_CONFIGURED", `Expected PAYMENT_NOT_CONFIGURED, got ${valid.json.error}`);
assert(valid.json.meta?.product === "pro_report", "Expected product pro_report");
assert(valid.json.meta?.currency === "KRW", "Expected currency KRW");
assert(valid.json.meta?.amount === 9900, "Expected amount 9900");
assert(valid.json.meta?.input_hash === inputHash, "Expected echoed input_hash");

const invalid = await postJson(invalidPayload);
assert(invalid.response.status === 400, `Expected invalid request HTTP 400, got ${invalid.response.status}`);
assert(invalid.json.ok === false, "Expected invalid request ok: false");
assert(invalid.json.error === "INVALID_INPUT", `Expected INVALID_INPUT, got ${invalid.json.error}`);

console.log("Payment prepare smoke test passed.");
