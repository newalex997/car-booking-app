"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Offer } from "@/types/booking";

interface SearchContext {
  pickup?: string;
  returnDate?: string;
  location?: string;
  dropoffLocation?: string;
}

interface Props {
  offer: Offer;
  rentalDays?: number | null;
  searchContext?: SearchContext;
}

const SPEC_ICONS: Record<string, ReactNode> = {
  transmission: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
      <circle cx="3" cy="13" r="1.5" />
      <circle cx="8" cy="13" r="1.5" />
      <circle cx="13" cy="13" r="1.5" />
      <circle cx="3" cy="3" r="1.5" />
      <circle cx="13" cy="3" r="1.5" />
      <path strokeLinecap="round" d="M3 11.5V4.5M13 11.5V4.5M8 11.5V8m0 0H3m5 0h5" />
    </svg>
  ),
  seats: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
      <circle cx="8" cy="4" r="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 14c0-2.21 1.79-4 4-4s4 1.79 4 4" />
    </svg>
  ),
  bags: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
      <rect x="2" y="6" width="12" height="8" rx="1.5" />
      <path strokeLinecap="round" d="M5 6V4.5A1.5 1.5 0 016.5 3h3A1.5 1.5 0 0111 4.5V6" />
    </svg>
  ),
  ac: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
      <path strokeLinecap="round" d="M8 1v14M1 8h14M3.05 3.05l9.9 9.9M12.95 3.05l-9.9 9.9" />
    </svg>
  ),
  doors: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
      <rect x="3" y="2" width="10" height="12" rx="1" />
      <circle cx="11" cy="8" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
};

export default function OfferCard({ offer, rentalDays, searchContext }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    vehicle,
    supplier,
    location,
    mileage,
    depositType,
    isInstantConfirmation,
    price,
    paymentType,
  } = offer;

  async function handleViewDeal() {
    setLoading(true);
    try {
      const res = await fetch("/api/booking/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carName: vehicle.carName,
          carImg: vehicle.carImg,
          price: price.formatted,
          supplierName: supplier.name,
          supplierLogo: supplier.logo,
          supplierScore: supplier.rating.score,
          supplierLabel: supplier.rating.label,
          supplierReviews: String(supplier.rating.countryReviewCount),
          locationName: location.name,
          transmission: vehicle.specifications.isAutomaticTransmission ? "Automatic" : "Manual",
          seats: vehicle.specifications.seats.label,
          bags: vehicle.specifications.bags.label,
          doors: vehicle.specifications.doors.label,
          paymentLabel: paymentType.label,
          ...(mileage.unlimited && { unlimitedMileage: true }),
          ...(offer.isFreeCancellation && { freeCancellation: true }),
          ...(isInstantConfirmation && { instantConfirmation: true }),
          ...(rentalDays && { rentalDays: String(rentalDays) }),
          ...(searchContext?.pickup && { pickup: searchContext.pickup }),
          ...(searchContext?.returnDate && { returnDate: searchContext.returnDate }),
          ...(searchContext?.location && { location: searchContext.location }),
          ...(searchContext?.dropoffLocation && { dropoffLocation: searchContext.dropoffLocation }),
        }),
      });
      const { ocid } = await res.json();
      router.push(`/booking?ocid=${ocid}`);
    } finally {
      setLoading(false);
    }
  }
  const { specifications } = vehicle;

  const specItems = [
    {
      key: "transmission",
      label: specifications.isAutomaticTransmission ? "Automatic" : "Manual",
    },
    { key: "seats", label: specifications.seats.label },
    { key: "bags", label: specifications.bags.label },
    ...(specifications.airConditioning
      ? [{ key: "ac", label: "Air Conditioning" }]
      : []),
    { key: "doors", label: specifications.doors.label },
  ];

  const isHighDeposit =
    depositType?.key && depositType.key !== "none" && depositType.key !== "low";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] max-sm:flex-col">
      {/* Main section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header: name + specs */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-baseline gap-2 flex-wrap mb-2">
            <h2 className="text-[1.0625rem] font-bold text-slate-900 tracking-[-0.01em]">
              {vehicle.carName}
            </h2>
            <span className="text-sm text-slate-400 font-normal">
              or similar {vehicle.sippGroup}
            </span>
          </div>
          <div className="flex gap-4 flex-wrap">
            {specItems.map((s) => (
              <span
                key={s.key}
                className="flex items-center gap-1 text-[0.8125rem] text-slate-500"
              >
                {SPEC_ICONS[s.key]}
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Body: image + details */}
        <div className="flex gap-4 px-5 py-4 flex-1">
          {/* Car image */}
          <div className="w-[160px] h-[110px] shrink-0 relative max-sm:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={vehicle.carImg}
              alt={vehicle.carName}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          {/* Location + features */}
          <div className="flex flex-col gap-2.5 min-w-0">
            {/* Location */}
            <div>
              <span className="text-xs font-medium text-blue-600">
                {location.name}
              </span>
              {supplier.loc?.label && (
                <div className="flex items-center gap-1.5 text-sm text-slate-700 mt-0.5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-blue-500 shrink-0"
                  >
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M2 10h20" />
                    <circle cx="7" cy="20" r="1.5" />
                    <circle cx="17" cy="20" r="1.5" />
                    <path d="M7 18v2M17 18v2M2 14h1M21 14h1" />
                  </svg>
                  {supplier.loc.label}
                </div>
              )}
            </div>

            {/* Feature badges */}
            <div className="flex flex-col gap-1.5">
              {isHighDeposit && (
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="w-4 h-4 shrink-0 text-amber-500"
                  >
                    <path
                      d="M8 2L1.5 13.5h13L8 2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 6.5v3M8 11.5v.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {depositType.title || "High deposit"}
                </div>
              )}
              {isInstantConfirmation && (
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="w-4 h-4 shrink-0 text-green-500"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5.5 8L7 9.5 10.5 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Instant confirmation!
                </div>
              )}
              {mileage.unlimited && (
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="w-4 h-4 shrink-0 text-green-500"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5.5 8L7 9.5 10.5 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Unlimited mileage
                </div>
              )}
              {offer.isFreeCancellation && (
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="w-4 h-4 shrink-0 text-green-500"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5.5 8L7 9.5 10.5 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Free cancellation
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 pt-0">
          <a
            href={`https://www.discovercars.com${offer.bookUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Rental Conditions
          </a>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-[190px] shrink-0 flex flex-col items-center justify-between p-5 border-l border-slate-100 gap-4 max-sm:w-full max-sm:flex-row max-sm:border-l-0 max-sm:border-t max-sm:items-center">
        {/* Supplier + rating */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex items-center gap-2 justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={supplier.logo}
              alt={supplier.name}
              className="h-6 w-auto max-w-[80px] object-contain"
            />
            <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-0.5">
              <span className="text-sm font-bold text-slate-900">
                {supplier.rating.score}
              </span>
              <svg
                viewBox="0 0 12 12"
                fill="currentColor"
                className="w-3 h-3 text-amber-400"
              >
                <path d="M6 1l1.4 2.8 3.1.45-2.25 2.19.53 3.09L6 8.1 3.22 9.53l.53-3.09L1.5 4.25l3.1-.45L6 1z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-700">
              {supplier.rating.label}
            </div>
            <div className="text-xs text-slate-400">
              {supplier.rating.countryReviewCount} reviews
            </div>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col items-center gap-2 w-full max-sm:items-end">
          <div className="text-center max-sm:text-right">
            {rentalDays && (
              <div className="text-xs text-slate-500">
                Total for {rentalDays} days
              </div>
            )}
            {!rentalDays && (
              <div className="text-xs text-slate-400">{paymentType.label}</div>
            )}
            <div className="text-2xl font-extrabold text-slate-900 tracking-[-0.03em]">
              {price.formatted}
            </div>
          </div>
          <button
            onClick={handleViewDeal}
            disabled={loading}
            className="w-full text-center bg-blue-600 text-white px-4 py-2.5 rounded-xl text-[0.9375rem] font-semibold whitespace-nowrap transition-colors hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Loading…" : "View deal"}
          </button>
        </div>
      </div>
    </div>
  );
}
