"use client";

import { Control, Controller, useWatch } from "react-hook-form";
import LocationAutocomplete from "./LocationAutocomplete";
import { SearchFormValues } from "@/lib/searchSchema";
import { LocationResult } from "@/types/booking";

interface Props {
  control: Control<SearchFormValues>;
}

export default function LocationSection({ control }: Props) {
  const sameDropoff = useWatch({ control, name: "sameDropoff" });

  return (
    <div className="flex items-stretch border-b border-slate-100 max-md:flex-col max-md:gap-3 max-md:border-none">
      {/* Pick-up location */}
      <div className="flex-1 flex flex-col px-5 pt-5 pb-4 min-w-0 max-md:bg-white max-md:rounded-xl max-md:shadow-sm max-md:pb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-[0.07em]">
            Pick-up Location
          </label>
          <Controller
            name="sameDropoff"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {field.value ? (
                  <>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                      <path strokeLinecap="round" d="M8 3v10M3 8h10" />
                    </svg>
                    Different drop-off
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                      <path strokeLinecap="round" d="M3 8h10" />
                    </svg>
                    Same drop-off
                  </>
                )}
              </button>
            )}
          />
        </div>
        <Controller
          name="pickupLocation"
          control={control}
          render={({ field }) => (
            <LocationAutocomplete
              value={field.value?.label ?? ""}
              onChange={() => {}}
              onSelect={(result: LocationResult) => field.onChange(result)}
              placeholder="City, airport or address"
              required
            />
          )}
        />
      </div>

      {/* Drop-off location */}
      {!sameDropoff && (
        <>
          <div className="w-px bg-slate-100 my-4 max-md:hidden" />
          <div className="flex-1 flex flex-col px-5 pt-5 pb-4 min-w-0 max-md:bg-white max-md:rounded-xl max-md:shadow-sm max-md:pb-5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-[0.07em] mb-2">
              Drop-off Location
            </label>
            <Controller
              name="dropoffLocation"
              control={control}
              render={({ field }) => (
                <LocationAutocomplete
                  value={field.value?.label ?? ""}
                  onChange={() => {}}
                  onSelect={(result: LocationResult) => field.onChange(result)}
                  placeholder="City, airport or address"
                  required
                />
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}
