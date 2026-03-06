import { NextRequest, NextResponse } from "next/server";
import { getSearchResults } from "@/lib/bookingApi";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ guid: string }> }
) {
  const { guid } = await params;

  try {
    const result = await getSearchResults(guid);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`[GET /api/search/${guid}]`, error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 502 }
    );
  }
}
