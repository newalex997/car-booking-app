"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Offer, SearchResultsResponse } from "@/lib/bookingApi";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const guid = searchParams.get("guid");

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guid) return;

    setLoading(true);
    setError(null);

    fetch(`/api/search/${guid}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<SearchResultsResponse>;
      })
      .then((json) => setOffers(json.data?.offers ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [guid]);

  if (!guid) return null;

  if (loading) {
    return (
      <div className="col-span-full flex justify-center py-16">
        <p className="text-slate-500 text-sm">Searching for cars…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full py-16 text-center">
        <p className="text-red-400 text-sm">Failed to load results: {error}</p>
      </div>
    );
  }

  if (offers.length === 0) return null;

  return (
    <>
      {offers.map((offer) => (
        <div
          key={offer.hash}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] max-sm:flex-col"
        >
          {/* Car image */}
          <div className="w-[200px] h-[140px] shrink-0 bg-white relative max-sm:w-full">
            <span className="absolute top-3 left-3 z-10 text-xs font-bold text-white px-2.5 py-1 rounded-full bg-slate-600 tracking-[0.03em]">
              {offer.vehicle.sippGroup}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={offer.vehicle.carImg}
              alt={offer.vehicle.carName}
              className="absolute inset-0 w-full h-full object-contain p-6"
            />
          </div>

          {/* Main info */}
          <div className="flex flex-1 items-center gap-6 p-5 min-w-0 max-sm:flex-col max-sm:items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-[1.0625rem] font-bold text-slate-900 tracking-[-0.01em] mb-0.5">
                {offer.vehicle.carName}
              </h2>
              <p className="text-xs text-slate-400 mb-3">{offer.supplier.name} · {offer.location.name}</p>

              {/* Specs */}
              <div className="flex gap-4 flex-wrap mb-3">
                <span className="flex items-center gap-[0.3rem] text-[0.8125rem] text-slate-500">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                    <circle cx="5" cy="10" r="2" /><circle cx="11" cy="10" r="2" />
                    <path strokeLinecap="round" d="M2 10H1M15 10h-1M5 8V5h5l2 3" />
                  </svg>
                  {offer.vehicle.specifications.seats.label}
                </span>
                <span className="flex items-center gap-[0.3rem] text-[0.8125rem] text-slate-500">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                    <rect x="2" y="3" width="12" height="10" rx="1.5" />
                    <path strokeLinecap="round" d="M5 3V2M11 3V2" />
                  </svg>
                  {offer.vehicle.specifications.bags.label}
                </span>
                <span className="flex items-center gap-[0.3rem] text-[0.8125rem] text-slate-500">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                    <circle cx="8" cy="8" r="5.5" />
                    <path strokeLinecap="round" d="M8 5v3l2 2" />
                  </svg>
                  {offer.vehicle.specifications.isAutomaticTransmission ? "Automatic" : "Manual"}
                </span>
                <span className="text-[0.8125rem] text-slate-500">{offer.mileage.label}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-amber-400">
                  <path d="M6 1l1.4 2.8 3.1.45-2.25 2.19.53 3.09L6 8.1 3.22 9.53l.53-3.09L1.5 4.25l3.1-.45L6 1z" />
                </svg>
                <span className="text-sm font-bold text-slate-900">{offer.supplier.rating.score}</span>
                <span className="text-[0.8125rem] text-slate-500">{offer.supplier.rating.label}</span>
                <span className="text-[0.8125rem] text-slate-400">({offer.supplier.rating.countryReviewCount})</span>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="flex flex-col items-end gap-3 shrink-0 max-sm:flex-row max-sm:items-center max-sm:w-full max-sm:justify-between">
              <div className="flex flex-col items-end max-sm:items-start">
                <span className="text-2xl font-extrabold text-slate-900 tracking-[-0.03em]">
                  {offer.price.formatted}
                </span>
                <span className="text-xs text-slate-400">{offer.paymentType.label}</span>
              </div>
              <a
                href={`https://www.discovercars.com${offer.bookUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-[0.9375rem] font-semibold whitespace-nowrap transition-colors hover:bg-blue-700"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
