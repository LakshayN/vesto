import { NextResponse } from "next/server";
import { upstoxGet } from "@/lib/upstox";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [holdingsRes, fundsRes] = await Promise.allSettled([
      upstoxGet("/portfolio/long-term-holdings"),
      upstoxGet("/user/get-funds-and-margin"),
    ]);

    const holdings =
      holdingsRes.status === "fulfilled"
        ? holdingsRes.value.data || []
        : [];
    const fundsData =
      fundsRes.status === "fulfilled"
        ? fundsRes.value.data || {}
        : {};

    let totalValue = 0;
    let totalInvestment = 0;
    let totalPnl = 0;
    const breakdown: any[] = [];

    for (const h of holdings) {
      const qty = Number(h.quantity) || 0;
      const ltp = Number(h.last_price) || 0;
      const avg = Number(h.average_price) || 0;
      const val = qty * ltp;
      const inv = qty * avg;
      totalValue += val;
      totalInvestment += inv;
      totalPnl += Number(h.pnl) || 0;

      breakdown.push({
        name: h.company_name,
        symbol: h.tradingsymbol,
        isin: h.isin,
        quantity: qty,
        lastPrice: ltp,
        averagePrice: avg,
        value: val,
        investment: inv,
        pnl: Number(h.pnl) || 0,
        dayChange: h.day_change,
        dayChangePercent: h.day_change_percentage,
      });
    }

    const availableCash =
      Number(fundsData?.equity?.available_margin) || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalValue: Math.round(totalValue * 100) / 100,
        totalInvestment: Math.round(totalInvestment * 100) / 100,
        totalPnl: Math.round(totalPnl * 100) / 100,
        availableCash,
        totalPortfolio: Math.round((totalValue + availableCash) * 100) / 100,
        holdingsCount: breakdown.length,
        breakdown,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
