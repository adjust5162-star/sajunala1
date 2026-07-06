import { NextResponse } from "next/server";
import { APP_CONFIG } from "../../../lib/app/config";

export function GET() {
  return NextResponse.json({
    ok: true,
    status: "healthy",
    app: APP_CONFIG.name,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
  });
}
