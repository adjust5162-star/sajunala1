export type Gender = "male" | "female" | "other";

export type CalendarType = "solar" | "lunar";

export type SajuInput = {
  name: string;
  gender: Gender;
  birthDate: string;
  birthTime?: string;
  isBirthTimeUnknown: boolean;
  calendarType: CalendarType;
  birthPlace: string;
};

export type Pillar = {
  label: "year" | "month" | "day" | "hour";
  koreanLabel: string;
  stem: string;
  branch: string;
};

export type FiveElementScore = {
  element: "wood" | "fire" | "earth" | "metal" | "water";
  koreanLabel: string;
  score: number;
};

export type SajuResult = {
  inputHash: string;
  input: SajuInput;
  pillars: Pillar[];
  fiveElements: FiveElementScore[];
  tenGods: {
    summary: string;
    items: string[];
  };
  twelveShinsal: {
    items: string[];
  };
  daewoon: {
    startAge: number;
    timeline: Array<{
      ageRange: string;
      label: string;
    }>;
  };
  sewoon: {
    year: number;
    label: string;
  };
  trueSolarTime: {
    applied: false;
    note: string;
  };
  meta: {
    calculationMode: "placeholder";
    version: string;
  };
};
