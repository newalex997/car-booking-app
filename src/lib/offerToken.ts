import { SignJWT, jwtVerify } from "jose";

export interface OfferTokenPayload {
  carName: string;
  carImg: string;
  price: string;
  supplierName: string;
  supplierLogo: string;
  supplierScore: string;
  supplierLabel: string;
  supplierReviews: string;
  locationName: string;
  transmission: string;
  seats: string;
  bags: string;
  doors: string;
  paymentLabel: string;
  rentalDays?: string;
  pickup?: string;
  returnDate?: string;
  location?: string;
  dropoffLocation?: string;
  freeCancellation?: boolean;
  unlimitedMileage?: boolean;
  instantConfirmation?: boolean;
}

function getSecret(): Uint8Array {
  const secret = process.env.OFFER_TOKEN_SECRET ?? "dev-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function signOfferToken(payload: OfferTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifyOfferToken(token: string): Promise<OfferTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as OfferTokenPayload;
}
