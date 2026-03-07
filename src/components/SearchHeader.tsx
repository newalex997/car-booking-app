import Link from "next/link";
import { formatDatetime } from "@/lib/utils";

interface Props {
  location: string;
  dropoffLocation?: string;
  pickup: string;
  returnDate: string;
}

export default function SearchHeader({ location, dropoffLocation, pickup, returnDate }: Props) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-[1200px] mx-auto px-8 h-14 flex items-center gap-5">
        <Link href="/" className="text-xl font-extrabold text-blue-600 tracking-[-0.03em] shrink-0">
          DriveEasy
        </Link>

        {location && (
          <div className="flex items-stretch text-sm bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex-1 max-sm:hidden">
            {/* Location */}
            <div className="flex items-center gap-2 px-3.5 py-2 border-r border-slate-200 flex-1 min-w-0">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5C12.5 3.515 10.485 1.5 8 1.5z" />
                <circle cx="8" cy="6" r="1.25" fill="currentColor" stroke="none" />
              </svg>
              <span className="font-semibold text-slate-900 truncate">{location}</span>
              {dropoffLocation && (
                <>
                  <svg viewBox="0 0 16 8" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0 text-slate-400" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4h14M11 1l3 3-3 3" />
                  </svg>
                  <span className="font-semibold text-slate-900 truncate">{dropoffLocation}</span>
                </>
              )}
            </div>

            {/* Pickup datetime */}
            <div className="flex items-center gap-2 px-3.5 py-2 border-r border-slate-200">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0 text-slate-400">
                <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" />
                <path strokeLinecap="round" d="M1.5 6.5h13M5 1.5v3M11 1.5v3" />
              </svg>
              <span className="text-slate-700 whitespace-nowrap">{formatDatetime(pickup)}</span>
            </div>

            {/* Arrow */}
            <div className="flex items-center px-2.5 text-slate-400 border-r border-slate-200">
              <svg viewBox="0 0 16 8" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4h14M11 1l3 3-3 3" />
              </svg>
            </div>

            {/* Return datetime */}
            <div className="flex items-center gap-2 px-3.5 py-2">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0 text-slate-400">
                <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" />
                <path strokeLinecap="round" d="M1.5 6.5h13M5 1.5v3M11 1.5v3" />
              </svg>
              <span className="text-slate-700 whitespace-nowrap">{formatDatetime(returnDate)}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
