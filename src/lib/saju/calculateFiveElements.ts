import type { FiveElementScore, Pillar } from "./types";

export function calculateFiveElements(_pillars: Pillar[]): FiveElementScore[] {
  return [
    { element: "wood", koreanLabel: "목", score: 35 },
    { element: "fire", koreanLabel: "화", score: 55 },
    { element: "earth", koreanLabel: "토", score: 75 },
    { element: "metal", koreanLabel: "금", score: 40 },
    { element: "water", koreanLabel: "수", score: 50 },
  ];
}
