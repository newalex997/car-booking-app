import { NextRequest, NextResponse } from "next/server";
import { verifyOfferToken } from "@/lib/offerToken";
import { BookingFormData } from "@/types/booking";
import { bookingsStore } from "@/lib/bookingsStore";

function generateBookingCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "BK-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  let body: { ocid?: string } & Partial<BookingFormData>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { ocid, name, identityDoc, email, phone, country, flightNumber, specialRequests } = body;

  if (!ocid || !name || !identityDoc || !email || !phone || !country) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await verifyOfferToken(ocid);
  } catch {
    return NextResponse.json({ error: "Invalid or expired offer" }, { status: 401 });
  }

  const details: BookingFormData = { name, identityDoc, email, phone, country, flightNumber, specialRequests };

  const bookingCode = generateBookingCode();

  if (!bookingsStore.has(identityDoc)) {
    bookingsStore.set(identityDoc, new Map());
  }
  bookingsStore.get(identityDoc)!.set(bookingCode, { ocid, details });

  return NextResponse.json({ bookingCode });
}
