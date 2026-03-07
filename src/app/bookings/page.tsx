"use client";

import { useState } from "react";
import Link from "next/link";
import { BookingResult } from "@/app/api/bookings/search/route";
import BookingResultItem from "@/components/BookingResultItem";

export default function BookingsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookingResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(`/api/bookings/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setResults(data.results);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="text-[1.1rem] font-extrabold text-slate-900 tracking-[-0.03em]">
            DriveEasy
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-semibold text-slate-800">My Bookings</span>
        </div>
      </header>

      <main className="max-w-[680px] mx-auto px-6 py-12">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-[-0.03em] mb-2">
          Find your booking
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Enter your identity document number or booking code to retrieve your bookings.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Document number or BK-XXXXXXXX"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 bg-white"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl px-5 py-3 text-sm transition-colors"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500 mb-6">{error}</p>
        )}

        {results !== null && results.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">
            No bookings found for <span className="font-medium text-slate-600">"{query}"</span>.
          </div>
        )}

        {results && results.length > 0 && (
          <div className="flex flex-col gap-4">
            {results.map((r) => (
              <BookingResultItem key={r.bookingCode} result={r} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

