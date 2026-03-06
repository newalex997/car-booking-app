import { NextRequest, NextResponse } from "next/server";
import { LocationResult } from "@/types/booking";
import { createSearch } from "@/lib/bookingApi";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    location,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    residenceCountry,
  } = body as {
    location: LocationResult;
    pickupDate: string;
    pickupTime: string;
    dropoffDate: string;
    dropoffTime: string;
    residenceCountry?: string;
  };

  if (!location || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const result = await createSearch({
      location,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      residenceCountry,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/search/create-search]", error);
    return NextResponse.json(
      { error: "Failed to create search" },
      { status: 502 }
    );
  }
}
