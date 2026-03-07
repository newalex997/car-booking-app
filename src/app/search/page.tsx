import { Suspense } from "react";
import SearchResults from "@/components/SearchResults";
import SearchHeader from "@/components/SearchHeader";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    location?: string;
    dropoffLocation?: string;
    pickup?: string;
    return?: string;
    guid?: string;
  }>;
}) {
  const params = await searchParams;
  const location = params.location ?? "";
  const dropoffLocation = params.dropoffLocation ?? "";
  const pickup = params.pickup ?? "";
  const returnDate = params.return ?? "";

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <SearchHeader
        location={location}
        dropoffLocation={dropoffLocation}
        pickup={pickup}
        returnDate={returnDate}
      />

      <main className="flex-1 p-8 max-sm:p-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex gap-6 items-start">
            {/* List */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <Suspense>
                <SearchResults />
              </Suspense>
            </div>

            {/* Filters sidebar */}
            <aside className="w-[280px] shrink-0 bg-white rounded-2xl border border-slate-200 p-5 sticky top-[57px] max-lg:hidden" />
          </div>
        </div>
      </main>
    </div>
  );
}
