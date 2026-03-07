import { NextRequest, NextResponse } from "next/server";
import { getSearchResults } from "@/lib/bookingApi";
import { Offer } from "@/types/booking";

const offerCache = new Map<string, Offer[]>();

const DEFAULT_PAGE_SIZE = 10;

type SortOption = "recommended" | "price_asc" | "price_desc" | "rating";

function sortOffers(offers: Offer[], sort: SortOption): Offer[] {
  const sorted = [...offers];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.price.raw - b.price.raw);
    case "price_desc":
      return sorted.sort((a, b) => b.price.raw - a.price.raw);
    case "rating":
      return sorted.sort(
        (a, b) =>
          parseFloat(b.supplier.rating.score) -
          parseFloat(a.supplier.rating.score)
      );
    default:
      return sorted;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guid: string }> }
) {
  const { guid } = await params;
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.max(
    1,
    parseInt(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE), 10)
  );
  const sort = (searchParams.get("sort") ?? "recommended") as SortOption;

  try {
    if (!offerCache.has(guid)) {
      const result = await getSearchResults(guid);
      offerCache.set(guid, result.data?.offers ?? []);
    }

    const baseUrl = process.env.BOOKING_API_URL ?? "";
    const allOffers = sortOffers(
      offerCache.get(guid)!.map((offer) => ({
        ...offer,
        supplier: {
          ...offer.supplier,
          logo: offer.supplier.logo ? `${baseUrl}${offer.supplier.logo}` : offer.supplier.logo,
        },
      })),
      sort
    );
    const total = allOffers.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const offers = allOffers.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      errors: null,
      data: { offers, total, page, pageSize, totalPages },
    });
  } catch (error) {
    console.error(`[GET /api/search/${guid}]`, error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 502 }
    );
  }
}
