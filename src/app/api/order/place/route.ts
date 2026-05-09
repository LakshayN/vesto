import { NextRequest, NextResponse } from "next/server";
import { upstoxPost } from "@/lib/upstox";

export const dynamic = "force-dynamic";

/**
 * POST /api/order/place
 * Body: {
 *   instrument_token: "NSE_EQ|INE...",
 *   quantity: number,
 *   transaction_type: "BUY" | "SELL",
 *   order_type: "MARKET" | "LIMIT" | "SL" | "SL-M",
 *   price?: number,
 *   trigger_price?: number,
 *   product?: "D" | "I",
 *   validity?: "DAY" | "IOC",
 *   disclosed_quantity?: number,
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      instrument_token,
      quantity,
      transaction_type,
      order_type,
      price = 0,
      trigger_price = 0,
      product = "D",
      validity = "DAY",
      disclosed_quantity = 0,
      tag = "vestro",
    } = body;

    if (!instrument_token || !quantity || !transaction_type || !order_type) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: instrument_token, quantity, transaction_type, order_type",
        },
        { status: 400 }
      );
    }

    const orderPayload = {
      quantity,
      product,
      validity,
      price,
      tag,
      instrument_token,
      order_type,
      transaction_type,
      disclosed_quantity,
      trigger_price,
    };

    const res = await upstoxPost("/order/place", orderPayload);

    return NextResponse.json({
      success: true,
      data: res,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
