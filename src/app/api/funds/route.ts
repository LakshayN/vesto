import { NextResponse } from "next/server";
import { upstoxGet } from "@/lib/upstox";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const res = await upstoxGet("/user/get-funds-and-margin");
    const equity = res?.data?.equity || {};
    return NextResponse.json({
      success: true,
      data: {
        availableMargin: equity.available_margin || 0,
        usedMargin: equity.used_margin || 0,
        payinAmount: equity.payin_amount || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
