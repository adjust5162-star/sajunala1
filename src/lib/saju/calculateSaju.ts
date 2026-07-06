import { createInputHash } from "../cache/inputHash";
import { calculateDaewoon } from "./calculateDaewoon";
import { calculateFiveElements } from "./calculateFiveElements";
import { calculatePillars } from "./calculatePillars";
import { calculateSewoon } from "./calculateSewoon";
import { calculateTenGods } from "./calculateTenGods";
import { calculateTwelveShinsal } from "./calculateTwelveShinsal";
import { getTrueSolarTimePlaceholder } from "./trueSolarTime";
import type { SajuInput, SajuResult } from "./types";

export function calculateSaju(input: SajuInput): SajuResult {
  const pillars = calculatePillars(input);

  return {
    inputHash: createInputHash(input),
    input,
    pillars,
    fiveElements: calculateFiveElements(pillars),
    tenGods: calculateTenGods(pillars),
    twelveShinsal: calculateTwelveShinsal(pillars),
    daewoon: calculateDaewoon(input),
    sewoon: calculateSewoon(),
    trueSolarTime: getTrueSolarTimePlaceholder(input),
    meta: {
      calculationMode: "placeholder",
      version: "0.1.0",
    },
  };
}
