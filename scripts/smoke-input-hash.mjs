const { createInputHash } = await import("../src/lib/cache/inputHash.ts");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const baseInput = {
  name: " 홍길동 ",
  gender: "male",
  birthDate: "1990-01-01",
  birthTime: "09:30",
  isBirthTimeUnknown: false,
  calendarType: "solar",
  birthPlace: " 서울특별시 ",
};

const sameNormalizedInput = {
  birthPlace: "서울특별시",
  calendarType: "solar",
  isBirthTimeUnknown: false,
  birthTime: "09:30",
  birthDate: "1990-01-01",
  gender: "male",
  name: "홍길동",
};

const unknownTimeInput = {
  ...baseInput,
  birthTime: "22:00",
  isBirthTimeUnknown: true,
};

const sameUnknownTimeInput = {
  ...baseInput,
  birthTime: null,
  isBirthTimeUnknown: true,
};

const emptyPlaceInput = {
  ...baseInput,
  birthPlace: "",
};

const nullPlaceInput = {
  ...baseInput,
  birthPlace: null,
};

const hash = createInputHash(baseInput);
assert(/^[a-f0-9]{64}$/.test(hash), "Expected hash to be 64 lowercase hex chars");
assert(hash === createInputHash(sameNormalizedInput), "Expected same normalized input to produce same hash");
assert(hash !== createInputHash({ ...baseInput, birthDate: "1990-01-02" }), "Expected different input to produce different hash");
assert(createInputHash(unknownTimeInput) === createInputHash(sameUnknownTimeInput), "Expected unknown birth time to ignore birthTime");
assert(createInputHash(emptyPlaceInput) === createInputHash(nullPlaceInput), "Expected empty birthPlace to normalize to null");

console.log("Input hash smoke test passed.");
