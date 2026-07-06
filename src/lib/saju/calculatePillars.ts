import type { Pillar, SajuInput } from "./types";

export function calculatePillars(input: SajuInput): Pillar[] {
  const hourBranch = input.isBirthTimeUnknown ? "미상" : "자";

  return [
    { label: "year", koreanLabel: "년주", stem: "갑", branch: "자" },
    { label: "month", koreanLabel: "월주", stem: "병", branch: "인" },
    { label: "day", koreanLabel: "일주", stem: "무", branch: "진" },
    { label: "hour", koreanLabel: "시주", stem: input.isBirthTimeUnknown ? "미상" : "임", branch: hourBranch },
  ];
}
