import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "../../../../lib/supabase/server";

const saveSajuResultSchema = z.object({
  input_hash: z.string().regex(/^[a-f0-9]{64}$/),
  result: z.object({
    pillars: z.record(z.unknown()),
    fiveElements: z.record(z.unknown()),
    tenGods: z.record(z.unknown()),
    twelveShinsal: z.record(z.unknown()),
    daewoon: z.array(z.unknown()),
    sewoon: z.array(z.unknown()),
    warnings: z.array(z.unknown()).optional().default([]),
  }),
});

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();

  return token.length > 0 ? token : null;
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_INPUT",
          message: "저장 요청값을 확인해 주세요.",
          issues: [],
        },
        { status: 400 },
      );
    }

    const parsed = saveSajuResultSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_INPUT",
          message: "저장 요청값을 확인해 주세요.",
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const accessToken = getBearerToken(request);
    const supabase = createServerSupabaseClient(accessToken ?? undefined);

    if (!supabase) {
      return NextResponse.json(
        {
          ok: false,
          error: "SUPABASE_NOT_CONFIGURED",
          message: "Supabase 서버 설정이 아직 완료되지 않았습니다.",
        },
        { status: 503 },
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        {
          ok: false,
          error: "AUTH_REQUIRED",
          message: "로그인해야 저장할 수 있습니다.",
        },
        { status: 401 },
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        {
          ok: false,
          error: "AUTH_REQUIRED",
          message: "로그인해야 저장할 수 있습니다.",
        },
        { status: 401 },
      );
    }

    const { input_hash: inputHash, result } = parsed.data;
    const { error: saveError } = await supabase.from("saju_results").upsert(
      {
        user_id: user.id,
        input_hash: inputHash,
        saju_result: result,
        pillars_json: result.pillars,
        five_elements_json: result.fiveElements,
        ten_gods_json: result.tenGods,
        twelve_shinsal_json: result.twelveShinsal,
        daewoon_json: result.daewoon,
        sewoon_json: result.sewoon,
        warnings_json: result.warnings,
      },
      {
        onConflict: "user_id,input_hash",
      },
    );

    if (saveError) {
      return NextResponse.json(
        {
          ok: false,
          error: "SAVE_FAILED",
          message: "사주 결과 저장 중 오류가 발생했습니다.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      status: "saved",
      input_hash: inputHash,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "SAVE_FAILED",
        message: "사주 결과 저장 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
