import { NextResponse } from "next/server";
import { upstoxGet } from "@/lib/upstox";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const res = await upstoxGet("/portfolio/long-term-holdings");
    return NextResponse.json({ success: true, data: res.data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
