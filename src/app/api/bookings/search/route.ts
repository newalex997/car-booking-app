import { NextRequest, NextResponse } from "next/server";
import { bookingsStore, BookingEntry } from "@/lib/bookingsStore";
import { verifyOfferToken, OfferTokenPayload } from "@/lib/offerToken";
import { BookingFormData } from "@/types/booking";

export interface BookingResult {
  bookingCode: string;
  identityDoc: string;
  details: BookingFormData;
  offer: OfferTokenPayload | null;
}

async function toResult(bookingCode: string, identityDoc: string, entry: BookingEntry): Promise<BookingResult> {
  let offer: OfferTokenPayload | null = null;
  try {
    offer = await verifyOfferToken(entry.ocid);
  } catch {
    // ocid expired or invalid — return null offer
  }
  return { bookingCode, identityDoc, details: entry.details, offer };
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const isBookingCode = /^BK-/i.test(query);
  const pending: Promise<BookingResult>[] = [];

  if (isBookingCode) {
    const upperQuery = query.toUpperCase();
    for (const [identityDoc, bookings] of bookingsStore) {
      const entry = bookings.get(upperQuery);
      if (entry) {
        pending.push(toResult(upperQuery, identityDoc, entry));
      }
    }
  } else {
    const bookings = bookingsStore.get(query);
    if (bookings) {
      for (const [bookingCode, entry] of bookings) {
        pending.push(toResult(bookingCode, query, entry));
      }
    }
  }

  const results = await Promise.all(pending);
  return NextResponse.json({ results });
}
