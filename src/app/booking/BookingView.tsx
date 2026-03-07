"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BackButton from "@/components/BackButton";
import { OfferTokenPayload } from "@/lib/offerToken";
import { Country } from "@/app/api/countries/route";

export default function BookingView() {
  const searchParams = useSearchParams();
  const ocid = searchParams.get("ocid");

  const [offer, setOffer] = useState<OfferTokenPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);

  const [name, setName] = useState("");
  const [identityDoc, setIdentityDoc] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  useEffect(() => {
    if (!ocid) return;
    fetch(`/api/booking/offer?ocid=${ocid}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired offer link.");
        return res.json();
      })
      .then((data) => setOffer(data.offer))
      .catch((err) => setError(err.message));
  }, [ocid]);

  useEffect(() => {
    fetch("/api/countries")
      .then((res) => res.json())
      .then(setCountries)
      .catch(() => {});
  }, []);

  async function handleConfirm() {
    if (!ocid) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ocid, name, identityDoc, email, phone, country, flightNumber, specialRequests }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setBookingCode(data.bookingCode);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const [datePart, timePart] = dateStr.split(" ");
    if (!datePart) return dateStr;
    const d = new Date(datePart);
    const formatted = d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return timePart ? `${formatted}, ${timePart}` : formatted;
  }

  const specs = offer
    ? [offer.transmission, offer.seats, offer.bags, offer.doors].filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center gap-4">
          <BackButton />
          <span className="text-slate-300">|</span>
          <span className="text-sm font-semibold text-slate-800">
            Complete your booking
          </span>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-8">
        {error && (
          <div className="text-center py-20 text-red-400 text-sm">{error}</div>
        )}

        {!offer && !error && (
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading offer details…
          </div>
        )}

        {offer && !bookingCode && (
          <div className="flex gap-8 items-start max-lg:flex-col">
            {/* ── Left: form ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* Driver details */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-5">
                  Driver details
                </h2>
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Full name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Identity document number
                    </label>
                    <input
                      type="text"
                      placeholder="Passport or national ID"
                      value={identityDoc}
                      onChange={(e) => setIdentityDoc(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 555 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2 max-sm:col-span-1">
                    <label className="text-sm font-medium text-slate-700">
                      Country of residence
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="">
                        {countries.length === 0 ? "Loading…" : "Select country"}
                      </option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Flight info */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  Flight information
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                  Help the supplier track your arrival in case of delays.
                </p>
                <div className="flex flex-col gap-1.5 max-w-xs">
                  <label className="text-sm font-medium text-slate-700">
                    Flight number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BA 123"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400"
                  />
                </div>
              </section>

              {/* Special requests */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  Special requests
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                  Subject to availability and not guaranteed.
                </p>
                <textarea
                  rows={3}
                  placeholder="e.g. Child seat, GPS, etc."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 resize-none"
                />
              </section>

              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}

              {/* Confirm button (mobile) */}
              <div className="lg:hidden">
                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl px-6 py-3.5 text-base transition-colors"
                >
                  {submitting ? "Confirming…" : "Confirm booking"}
                </button>
              </div>
            </div>

            {/* ── Right: summary ── */}
            <aside className="w-[340px] shrink-0 flex flex-col gap-4 sticky top-[57px] max-lg:w-full">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Car image */}
                {offer.carImg && (
                  <div className="h-[160px] bg-slate-50 flex items-center justify-center px-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={offer.carImg}
                      alt={offer.carName}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}

                <div className="p-5 flex flex-col gap-4">
                  {/* Name + supplier */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-[1rem] leading-tight">
                        {offer.carName}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">or similar</p>
                    </div>
                    {offer.supplierLogo && (
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={offer.supplierLogo}
                          alt={offer.supplierName}
                          className="h-5 w-auto max-w-[70px] object-contain"
                        />
                        {offer.supplierScore && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-700">
                              {offer.supplierScore}
                            </span>
                            <svg
                              viewBox="0 0 12 12"
                              fill="currentColor"
                              className="w-3 h-3 text-amber-400"
                            >
                              <path d="M6 1l1.4 2.8 3.1.45-2.25 2.19.53 3.09L6 8.1 3.22 9.53l.53-3.09L1.5 4.25l3.1-.45L6 1z" />
                            </svg>
                          </div>
                        )}
                        {offer.supplierLabel && (
                          <span className="text-[0.7rem] text-slate-400">
                            {offer.supplierLabel}
                            {offer.supplierReviews &&
                              ` · ${offer.supplierReviews} reviews`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Specs */}
                  {specs.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {specs.map((s) => (
                        <span key={s} className="text-xs text-slate-500">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-slate-100" />

                  {/* Dates */}
                  {(offer.pickup || offer.returnDate || offer.locationName) && (
                    <div className="flex flex-col gap-2.5">
                      {offer.pickup && (
                        <div className="flex items-start gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Pick-up
                            </div>
                            <div className="text-sm text-slate-800">
                              {formatDate(offer.pickup)}
                            </div>
                            {offer.locationName && (
                              <div className="text-xs text-blue-600 mt-0.5">
                                {offer.locationName}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {offer.returnDate && (
                        <div className="flex items-start gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Drop-off
                            </div>
                            <div className="text-sm text-slate-800">
                              {formatDate(offer.returnDate)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-slate-100" />

                  {/* Badges */}
                  {(offer.freeCancellation ||
                    offer.unlimitedMileage ||
                    offer.instantConfirmation) && (
                    <div className="flex flex-col gap-1.5">
                      {offer.freeCancellation && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <CheckIcon />
                          Free cancellation
                        </div>
                      )}
                      {offer.unlimitedMileage && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <CheckIcon />
                          Unlimited mileage
                        </div>
                      )}
                      {offer.instantConfirmation && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <CheckIcon />
                          Instant confirmation
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-slate-100" />

                  {/* Price */}
                  <div>
                    <div className="text-xs text-slate-500">
                      {offer.rentalDays
                        ? `Total for ${offer.rentalDays} days`
                        : offer.paymentLabel}
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-[-0.03em]">
                      {offer.price}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Taxes &amp; fees included
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm button (desktop) */}
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="max-lg:hidden w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl px-6 py-3.5 text-base transition-colors"
              >
                {submitting ? "Confirming…" : "Confirm booking"}
              </button>

              <p className="text-xs text-slate-400 text-center">
                Your booking is protected by secure encryption. No payment
                charged yet.
              </p>
            </aside>
          </div>
        )}

        {bookingCode && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckIcon />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Booking confirmed!</h2>
            <p className="text-sm text-slate-500">Your booking reference is</p>
            <div className="bg-white border border-slate-200 rounded-xl px-8 py-4 text-2xl font-mono font-bold text-slate-900 tracking-widest">
              {bookingCode}
            </div>
            <p className="text-xs text-slate-400 mt-2">Keep this code to manage your booking.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 text-green-500">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 8L7 9.5 10.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
