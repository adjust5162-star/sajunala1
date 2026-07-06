import type { CalendarType, Gender } from "../saju/types";

export type InputHashSource = {
  name: string;
  gender: Gender;
  birthDate: string;
  birthTime?: string | null;
  isBirthTimeUnknown: boolean;
  calendarType: CalendarType;
  birthPlace?: string | null;
};

export type NormalizedInputHashSource = {
  birthDate: string;
  birthPlace: string | null;
  birthTime: string | null;
  calendarType: CalendarType;
  gender: Gender;
  isBirthTimeUnknown: boolean;
  name: string;
};
