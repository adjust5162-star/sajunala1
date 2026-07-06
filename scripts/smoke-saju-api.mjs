const baseUrl = process.env.SAJU_API_BASE_URL ?? "http://127.0.0.1:3000";
const endpoint = new URL("/api/saju/calculate", baseUrl);

const validPayload = {
  name: "홍길동",
  gender: "male",
  birthDate: "1990-01-01",
  birthTime: "09:30",
  isBirthTimeUnknown: false,
  calendarType: "solar",
  birthPlace: "서울특별시",
};

const invalidPayload = {
  name: "",
  gender: "male",
  birthDate: "",
  isBirthTimeUnknown: false,
  calendarType: "solar",
  birthPlace: "",
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
assert(valid.response.status === 200, `Expected valid request HTTP 200, got ${valid.response.status}`);
assert(valid.json.ok === true, "Expected valid request ok: true");
assert(typeof valid.json.meta?.input_hash === "string", "Expected meta.input_hash to exist");
assert(/^[a-f0-9]{64}$/.test(valid.json.meta.input_hash), "Expected meta.input_hash to be 64 lowercase hex chars");

const invalid = await postJson(invalidPayload);
assert(invalid.response.status === 400, `Expected invalid request HTTP 400, got ${invalid.response.status}`);
assert(invalid.json.ok === false, "Expected invalid request ok: false");
assert(invalid.json.error === "INVALID_INPUT", `Expected INVALID_INPUT, got ${invalid.json.error}`);

console.log("Saju API smoke test passed.");
