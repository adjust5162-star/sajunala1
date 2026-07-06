import { NextResponse } from "next/server";
import { createInputHash } from "../../../../lib/cache/inputHash";
import { calculateSaju } from "../../../../lib/saju/calculateSaju";
import { sajuInputSchema } from "../../../../lib/saju/validators";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = sajuInputSchema.safeParse(body);

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

    const input = {
      ...parsed.data,
      birthTime: parsed.data.birthTime || undefined,
    };
    const result = calculateSaju(input);

    return NextResponse.json({
      ok: true,
      data: result,
      meta: {
        input_hash: createInputHash(input),
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "사주 계산 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
