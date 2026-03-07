"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Offer, PaginatedSearchResultsResponse } from "@/types/booking";
import OfferCard from "./OfferCard";
import Pagination from "./Pagination";

type SortOption = "recommended" | "price_asc" | "price_desc" | "rating";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Sort: Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

export default function SearchResults() {
  const searchParams = useSearchParams();
  const guid = searchParams.get("guid");

  const rentalDays = useMemo(() => {
    const pickup = searchParams.get("pickup");
    const returnDate = searchParams.get("return");
    if (!pickup || !returnDate) return null;
    const p = new Date(pickup.split(" ")[0]);
    const r = new Date(returnDate.split(" ")[0]);
    const diff = Math.round((r.getTime() - p.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  }, [searchParams]);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<SortOption>("recommended");

  useEffect(() => {
    if (!guid) return;

    setLoading(true);
    setError(null);

    fetch(`/api/search/${guid}?page=${page}&pageSize=10&sort=${sort}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<PaginatedSearchResultsResponse>;
      })
      .then((json) => {
        setOffers(json.data?.offers ?? []);
        setTotalPages(json.data?.totalPages ?? 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [guid, page, sort]);

  function handleSortChange(value: SortOption) {
    setPage(1);
    setSort(value);
  }

  if (!guid) return null;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-slate-500 text-sm">Searching for cars…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-400 text-sm">Failed to load results: {error}</p>
      </div>
    );
  }

  if (offers.length === 0) return null;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white outline-none cursor-pointer transition-colors focus:border-blue-600"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {offers.map((offer) => (
        <OfferCard
          key={offer.hash}
          offer={offer}
          rentalDays={rentalDays}
          searchContext={{
            pickup: searchParams.get("pickup") ?? undefined,
            returnDate: searchParams.get("return") ?? undefined,
            location: searchParams.get("location") ?? undefined,
            dropoffLocation: searchParams.get("dropoffLocation") ?? undefined,
          }}
        />
      ))}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </>
  );
}
