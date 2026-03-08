"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackButton from "@/components/BackButton";
import { OfferTokenPayload } from "@/lib/offerToken";
import { Country } from "@/app/api/countries/route";
import DriverDetailsSection from "./DriverDetailsSection";
import BookingSummary from "./BookingSummary";
import BookingConfirmed from "./BookingConfirmed";

const bookingSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  identityDoc: z.string().min(1, "Identity document is required"),
  email: z.string().min(1, "Email is required").email({ message: "Invalid email address" }),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country of residence is required"),
  flightNumber: z.string().optional(),
  specialRequests: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

const inputClass =
  "border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400";

export default function BookingView() {
  const searchParams = useSearchParams();
  const ocid = searchParams.get("ocid");

  const [offer, setOffer] = useState<OfferTokenPayload | null>(null);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<BookingFormValues>({ resolver: zodResolver(bookingSchema) });

  useEffect(() => {
    if (!ocid) return;
    fetch(`/api/booking/offer?ocid=${ocid}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired offer link.");
        return res.json();
      })
      .then((data) => setOffer(data.offer))
      .catch((err) => setOfferError(err.message));
  }, [ocid]);

  useEffect(() => {
    fetch("/api/countries")
      .then((res) => res.json())
      .then(setCountries)
      .catch(() => {});
  }, []);

  const onSubmit = async (values: BookingFormValues) => {
    if (!ocid) return;
    const res = await fetch("/api/booking/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ocid, ...values }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError("root", { message: data.error ?? "Booking failed" });
      return;
    }
    setBookingCode(data.bookingCode);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center gap-4">
          <BackButton />
          <span className="text-slate-300">|</span>
          <span className="text-sm font-semibold text-slate-800">Complete your booking</span>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-8">
        {offerError && (
          <div className="text-center py-20 text-red-400 text-sm">{offerError}</div>
        )}

        {!offer && !offerError && (
          <div className="text-center py-20 text-slate-400 text-sm">Loading offer details…</div>
        )}

        {offer && !bookingCode && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-8 items-start max-lg:flex-col">
            {/* Left: form */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              <DriverDetailsSection register={register} errors={errors} countries={countries} />

              {/* Flight info */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  Flight information
                  <span className="ml-2 text-xs font-normal text-slate-400">Optional</span>
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                  Help the supplier track your arrival in case of delays.
                </p>
                <div className="flex flex-col gap-1.5 max-w-xs">
                  <label className="text-sm font-medium text-slate-700">Flight number</label>
                  <input type="text" placeholder="e.g. BA 123" className={inputClass} {...register("flightNumber")} />
                </div>
              </section>

              {/* Special requests */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  Special requests
                  <span className="ml-2 text-xs font-normal text-slate-400">Optional</span>
                </h2>
                <p className="text-sm text-slate-500 mb-5">Subject to availability and not guaranteed.</p>
                <textarea
                  rows={3}
                  placeholder="e.g. Child seat, GPS, etc."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 resize-none"
                  {...register("specialRequests")}
                />
              </section>

              {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

              {/* Confirm button (mobile) */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl px-6 py-3.5 text-base transition-colors"
                >
                  {isSubmitting ? "Confirming…" : "Confirm booking"}
                </button>
              </div>
            </div>

            {/* Right: summary */}
            <aside className="w-[340px] shrink-0 flex flex-col gap-4 sticky top-[57px] max-lg:w-full">
              <BookingSummary offer={offer} />
              <button
                type="submit"
                disabled={isSubmitting}
                className="max-lg:hidden w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl px-6 py-3.5 text-base transition-colors"
              >
                {isSubmitting ? "Confirming…" : "Confirm booking"}
              </button>
              <p className="text-xs text-slate-400 text-center">
                Your booking is protected by secure encryption. No payment charged yet.
              </p>
            </aside>
          </form>
        )}

        {bookingCode && <BookingConfirmed bookingCode={bookingCode} />}
      </main>
    </div>
  );
}
