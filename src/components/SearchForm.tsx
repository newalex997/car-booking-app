"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationResult } from "@/types/booking";
import LocationAutocomplete from "./LocationAutocomplete";

interface SearchFormProps {
  initialLocation?: string;
  initialPickup?: string;
  initialPickupTime?: string;
  initialReturn?: string;
  initialReturnTime?: string;
}

export default function SearchForm({
  initialLocation = "",
  initialPickup = "",
  initialPickupTime = "11:00",
  initialReturn = "",
  initialReturnTime = "11:00",
}: SearchFormProps) {
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);
  const [pickup, setPickup] = useState(initialPickup);
  const [pickupTime, setPickupTime] = useState(initialPickupTime);
  const [returnDate, setReturnDate] = useState(initialReturn);
  const [returnTime, setReturnTime] = useState(initialReturnTime);

  const [loading, setLoading] = useState(false);

  const handleSelect = (result: LocationResult) => {
    setLocation(result.label);
    setSelectedLocation(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation || loading) return;

    const residenceCountry = navigator.language.split("-")[1] ?? "US";

    setLoading(true);
    try {
      const res = await fetch("/api/search/create-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: selectedLocation,
          pickupDate: pickup,
          pickupTime,
          dropoffDate: returnDate,
          dropoffTime: returnTime,
          residenceCountry,
        }),
      });
      const json = await res.json();
      const guid: string = json?.data?.guid;

      const params = new URLSearchParams({
        location: selectedLocation.label,
        pickup,
        pickupTime,
        return: returnDate,
        returnTime,
        ...(guid ? { guid } : {}),
      });
      router.push(`/search?${params}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-stretch bg-white rounded-2xl max-md:flex-col max-md:gap-3 max-md:bg-transparent"
    >
      {/* Location field */}
      <div className="flex-1 flex flex-col px-5 py-4 min-w-0 max-md:bg-white max-md:rounded-lg max-md:shadow-sm">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-[0.05em] mb-1.5 whitespace-nowrap">
          Pick-up Location
        </label>
        <LocationAutocomplete
          value={location}
          onChange={setLocation}
          onSelect={handleSelect}
          placeholder="City, airport or address"
          required
        />
      </div>

      {/* Divider */}
      <div className="w-px bg-slate-200 my-3 max-md:hidden" />

      {/* Pickup date + time */}
      <div className="flex-1 flex flex-col px-5 py-4 min-w-0 max-md:bg-white max-md:rounded-lg max-md:shadow-sm">
        <label
          htmlFor="pickup"
          className="text-xs font-semibold text-slate-500 uppercase tracking-[0.05em] mb-1.5 whitespace-nowrap"
        >
          Pick-up Date & Time
        </label>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-slate-500 shrink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="4" width="16" height="14" rx="2" />
            <path strokeLinecap="round" d="M2 8h16M6 2v4M14 2v4" />
          </svg>
          <input
            id="pickup"
            type="date"
            className="flex-1 border-0 outline-none bg-transparent text-[0.9375rem] font-medium text-slate-900 min-w-0 [color-scheme:light]"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
          <input
            type="time"
            className="border-0 outline-none bg-transparent text-[0.9375rem] font-medium text-slate-900 w-[5.5rem] [color-scheme:light]"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-slate-200 my-3 max-md:hidden" />

      {/* Return date + time */}
      <div className="flex-1 flex flex-col px-5 py-4 min-w-0 max-md:bg-white max-md:rounded-lg max-md:shadow-sm">
        <label
          htmlFor="return"
          className="text-xs font-semibold text-slate-500 uppercase tracking-[0.05em] mb-1.5 whitespace-nowrap"
        >
          Return Date & Time
        </label>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-slate-500 shrink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="4" width="16" height="14" rx="2" />
            <path strokeLinecap="round" d="M2 8h16M6 2v4M14 2v4" />
          </svg>
          <input
            id="return"
            type="date"
            className="flex-1 border-0 outline-none bg-transparent text-[0.9375rem] font-medium text-slate-900 min-w-0 [color-scheme:light]"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
          <input
            type="time"
            className="border-0 outline-none bg-transparent text-[0.9375rem] font-medium text-slate-900 w-[5.5rem] [color-scheme:light]"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white border-0 rounded-r-2xl text-base font-semibold whitespace-nowrap transition-colors hover:bg-blue-700 disabled:opacity-60 shrink-0 max-md:rounded-lg max-md:justify-center"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-[18px] h-[18px]"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path strokeLinecap="round" d="M17 17l-3.5-3.5" />
        </svg>
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
