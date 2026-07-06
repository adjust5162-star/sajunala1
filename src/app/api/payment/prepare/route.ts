import { NextResponse } from "next/server";
import { z } from "zod";
import { PRICING } from "../../../../lib/pricing/config";

const paymentPrepareRequestSchema = z.object({
  input_hash: z.string().regex(/^[a-f0-9]{64}$/),
  product: z.literal("pro_report"),
  amount: z.literal(PRICING.pro_report.amountKrw),
  currency: z.literal("KRW"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = paymentPrepareRequestSchema.safeParse(body);

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
        error: "PAYMENT_NOT_CONFIGURED",
        message: "결제 기능은 아직 연결되지 않았습니다.",
        meta: {
          product: parsed.data.product,
          currency: parsed.data.currency,
          amount: parsed.data.amount,
          input_hash: parsed.data.input_hash,
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
