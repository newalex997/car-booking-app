import Link from "next/link";
import { Suspense } from "react";
import SearchResults from "@/components/SearchResults";


export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    location?: string;
    pickup?: string;
    pickupTime?: string;
    return?: string;
    returnTime?: string;
    guid?: string;
  }>;
}) {
  const params = await searchParams;
  const location = params.location ?? "";
  const pickup = params.pickup ?? "";
  const returnDate = params.return ?? "";

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center gap-6">
          <Link href="/" className="text-xl font-extrabold text-blue-600 tracking-[-0.03em] shrink-0">
            DriveEasy
          </Link>

          <div className="flex-1 flex items-center gap-2 text-[0.9375rem] text-slate-500 min-w-0 max-sm:hidden">
            {location && (
              <>
                <span className="flex items-center gap-1 font-semibold text-slate-900">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
                    <path strokeLinecap="round" d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5C12.5 3.515 10.485 1.5 8 1.5z" />
                    <circle cx="8" cy="6" r="1.25" />
                  </svg>
                  {location}
                </span>
                {pickup && <span className="text-slate-300 font-light">·</span>}
                {pickup && <span>{pickup}</span>}
                {returnDate && <span className="text-slate-300 font-light">→</span>}
                {returnDate && <span>{returnDate}</span>}
              </>
            )}
          </div>

          <Link href="/" className="text-sm font-semibold text-blue-600 whitespace-nowrap transition-opacity hover:opacity-75">
            Change search
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-8 max-sm:p-4">
        <div className="max-w-[1200px] mx-auto">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-slate-900 tracking-[-0.02em]">
              Cars available
              {location && <span className="text-blue-600"> in {location}</span>}
            </h1>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white outline-none cursor-pointer transition-colors focus:border-blue-600">
              <option>Sort: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>

          <div className="flex gap-6 items-start">
            {/* List */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <Suspense>
                <SearchResults />
              </Suspense>
            </div>

            {/* Filters sidebar */}
            <aside className="w-[280px] shrink-0 bg-white rounded-2xl border border-slate-200 p-5 sticky top-[73px] max-lg:hidden" />
          </div>
        </div>
      </main>
    </div>
  );
}
