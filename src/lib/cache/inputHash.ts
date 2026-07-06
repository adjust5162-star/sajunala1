import { createHash } from "crypto";
import type { InputHashSource, NormalizedInputHashSource } from "./types";

export function normalizeInputForHash(input: InputHashSource): NormalizedInputHashSource {
  const birthPlace = input.birthPlace?.trim() ?? "";

  return {
    birthDate: input.birthDate,
    birthPlace: birthPlace.length > 0 ? birthPlace : null,
    birthTime: input.isBirthTimeUnknown ? null : input.birthTime || null,
    calendarType: input.calendarType,
    gender: input.gender,
    isBirthTimeUnknown: input.isBirthTimeUnknown,
    name: input.name.trim(),
  };
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
  const serializedEntries = entries.map(([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`);

  return `{${serializedEntries.join(",")}}`;
}

export function createInputHash(input: InputHashSource): string {
  const normalized = normalizeInputForHash(input);

  return createHash("sha256").update(stableStringify(normalized)).digest("hex");
}
