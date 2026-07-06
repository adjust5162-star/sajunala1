import type { SajuInput } from "./types";

export function getTrueSolarTimePlaceholder(_input: SajuInput) {
  return {
    applied: false as const,
    note: "진태양시 보정은 아직 적용하지 않았습니다.",
  };
}
