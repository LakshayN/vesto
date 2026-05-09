import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/upstox";

export const dynamic = "force-dynamic";

/**
 * POST /api/token/refresh
 * Refreshes the access token using the stored refresh token.
 */
export async function POST() {
  try {
    const newToken = await refreshAccessToken();
    return NextResponse.json({
      success: true,
      data: { access_token: newToken },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
