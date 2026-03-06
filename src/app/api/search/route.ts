import { NextRequest, NextResponse } from "next/server";
import { searchLocations } from "@/lib/bookingApi";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const location = searchParams.get("location");

  if (!location) {
    return NextResponse.json(
      { error: "location is required" },
      { status: 400 }
    );
  }

  try {
    const result = await searchLocations(location);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/search]", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 502 }
    );
  }
}
