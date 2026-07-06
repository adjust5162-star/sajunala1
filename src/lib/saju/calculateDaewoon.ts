import type { SajuInput } from "./types";

export function calculateDaewoon(_input: SajuInput) {
  return {
    startAge: 7,
    timeline: [
      { ageRange: "20-29", label: "성장과 기반 정리" },
      { ageRange: "30-39", label: "역할 확장" },
      { ageRange: "40-49", label: "균형과 선택" },
    ],
  };
}
