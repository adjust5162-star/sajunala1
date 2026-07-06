import { z } from "zod";

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "출생 시간을 확인해 주세요.");

export const sajuInputSchema = z
  .object({
    name: z.string().trim().min(1, "이름을 입력해 주세요.").max(40, "이름은 40자 이하로 입력해 주세요."),
    gender: z.enum(["male", "female", "other"], {
      required_error: "성별을 선택해 주세요.",
      invalid_type_error: "성별을 선택해 주세요.",
    }),
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "생년월일을 선택해 주세요.")
      .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), "생년월일을 확인해 주세요."),
    birthTime: timeSchema.optional().or(z.literal("")),
    isBirthTimeUnknown: z.boolean(),
    calendarType: z.enum(["solar", "lunar"], {
      required_error: "달력 기준을 선택해 주세요.",
      invalid_type_error: "달력 기준을 선택해 주세요.",
    }),
    birthPlace: z
      .string()
      .trim()
      .min(1, "출생지를 입력해 주세요.")
      .max(80, "출생지는 80자 이하로 입력해 주세요."),
  })
  .superRefine((value, context) => {
    if (!value.isBirthTimeUnknown && !value.birthTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthTime"],
        message: "출생 시간을 입력하거나 모름을 선택해 주세요.",
      });
    }
  });

export type SajuInputDto = z.infer<typeof sajuInputSchema>;
