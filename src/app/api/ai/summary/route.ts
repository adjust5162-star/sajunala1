import { NextResponse } from "next/server";
import { z } from "zod";

const aiSummaryRequestSchema = z.object({
  plan: z.literal("free"),
  section: z.literal("free_summary"),
  tone: z.string().min(1),
  saju: z.record(z.unknown()),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = aiSummaryRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_INPUT",
          message: "입력값을 확인해 주세요.",
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: "AI_NOT_CONFIGURED",
        message: "AI 요약 기능은 아직 연결되지 않았습니다.",
        meta: {
          plan: parsed.data.plan,
          section: parsed.data.section,
          targetKoreanChars: 900,
          maxKoreanChars: 1500,
        },
      },
      { status: 501 },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_INPUT",
        message: "입력값을 확인해 주세요.",
        issues: [],
      },
      { status: 400 },
    );
  }
}
