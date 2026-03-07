"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, SearchFormValues } from "@/lib/searchSchema";
import LocationSection from "./LocationSection";

export default function SearchForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { sameDropoff: true },
  });

  const onSubmit = async (values: SearchFormValues) => {
    const residenceCountry = navigator.language.split("-")[1] ?? "US";
    const [pickupDate, pickupTime] = values.pickupDatetime.split("T");
    const [dropoffDate, dropoffTime] = values.returnDatetime.split("T");

    const effectiveDropoff = values.sameDropoff
      ? values.pickupLocation
      : values.dropoffLocation!;

    const res = await fetch("/api/search/create-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: values.pickupLocation,
        dropoffLocation: effectiveDropoff,
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        residenceCountry,
      }),
    });

    const json = await res.json();
    const guid: string = json?.data?.guid;

    const isDifferentDropoff =
      !values.sameDropoff &&
      effectiveDropoff.placeID !== values.pickupLocation.placeID;

    const params = new URLSearchParams({
      location: values.pickupLocation.label,
      ...(isDifferentDropoff ? { dropoffLocation: effectiveDropoff.label } : {}),
      pickup: values.pickupDatetime,
      return: values.returnDatetime,
      ...(guid ? { guid } : {}),
    });

    router.push(`/search?${params}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl overflow-hidden text-left max-md:flex max-md:flex-col max-md:gap-3 max-md:bg-transparent max-md:overflow-visible"
    >
      <LocationSection control={control} />

      {/* Row 2 — Dates + Search */}
      <div className="flex items-stretch max-md:flex-col max-md:gap-3">
        {/* Pick-up datetime */}
        <div className="flex-1 flex flex-col px-5 pt-4 pb-5 min-w-0 max-md:bg-white max-md:rounded-xl max-md:shadow-sm">
          <label
            htmlFor="pickup"
            className="text-xs font-semibold text-slate-400 uppercase tracking-[0.07em] mb-2"
          >
            Pick-up Date & Time
          </label>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="16" height="14" rx="2" />
              <path strokeLinecap="round" d="M2 8h16M6 2v4M14 2v4" />
            </svg>
            <Controller
              name="pickupDatetime"
              control={control}
              render={({ field }) => (
                <input
                  id="pickup"
                  type="datetime-local"
                  className="flex-1 border-0 outline-none bg-transparent text-[0.9375rem] font-medium text-slate-900 min-w-0 [color-scheme:light]"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <div className="w-px bg-slate-100 my-4 max-md:hidden" />

        {/* Return datetime */}
        <div className="flex-1 flex flex-col px-5 pt-4 pb-5 min-w-0 max-md:bg-white max-md:rounded-xl max-md:shadow-sm">
          <label
            htmlFor="return"
            className="text-xs font-semibold text-slate-400 uppercase tracking-[0.07em] mb-2"
          >
            Return Date & Time
          </label>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="16" height="14" rx="2" />
              <path strokeLinecap="round" d="M2 8h16M6 2v4M14 2v4" />
            </svg>
            <Controller
              name="returnDatetime"
              control={control}
              render={({ field }) => (
                <input
                  id="return"
                  type="datetime-local"
                  className="flex-1 border-0 outline-none bg-transparent text-[0.9375rem] font-medium text-slate-900 min-w-0 [color-scheme:light]"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 bg-blue-600 text-white border-0 rounded-br-2xl text-base font-semibold whitespace-nowrap transition-colors hover:bg-blue-700 disabled:opacity-60 shrink-0 max-md:rounded-xl max-md:py-4 max-md:justify-center"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path strokeLinecap="round" d="M17 17l-3.5-3.5" />
          </svg>
          {isSubmitting ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
