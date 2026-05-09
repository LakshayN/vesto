import { NextRequest, NextResponse } from "next/server";
import { upstoxGet } from "@/lib/upstox";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/quotes?instruments=NSE_EQ|INE...,NSE_EQ|INE...
 * Fetches live quote for one or more instruments.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const instruments = searchParams.get("instruments");

    if (!instruments) {
      return NextResponse.json(
        { success: false, error: "Missing 'instruments' query param" },
        { status: 400 }
      );
    }

    const res = await upstoxGet(
      `/market-quote/quotes?symbol=${encodeURIComponent(instruments)}`
    );

    return NextResponse.json({ success: true, data: res.data || {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
