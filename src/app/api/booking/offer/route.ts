import { NextRequest, NextResponse } from "next/server";
import { signOfferToken, verifyOfferToken, OfferTokenPayload } from "@/lib/offerToken";

export async function POST(req: NextRequest) {
  try {
    const body: OfferTokenPayload = await req.json();
    const ocid = await signOfferToken(body);
    return NextResponse.json({ ocid });
  } catch {
    return NextResponse.json({ error: "Failed to create offer token" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const ocid = req.nextUrl.searchParams.get("ocid");
  if (!ocid) {
    return NextResponse.json({ error: "Missing ocid" }, { status: 400 });
  }
  try {
    const payload = await verifyOfferToken(ocid);
    return NextResponse.json({ offer: payload });
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
