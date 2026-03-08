import { OfferTokenPayload } from "@/lib/offerToken";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const [datePart, timePart] = dateStr.split("T");
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 text-green-500">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 8L7 9.5 10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BookingSummary({ offer }: { offer: OfferTokenPayload }) {
  const specs = [offer.transmission, offer.seats, offer.bags, offer.doors].filter(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {offer.carImg && (
        <div className="h-[160px] bg-slate-50 flex items-center justify-center px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={offer.carImg} alt={offer.carName} className="max-h-full max-w-full object-contain" />
        </div>
      )}

      <div className="p-5 flex flex-col gap-4">
        {/* Name + supplier */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-[1rem] leading-tight">{offer.carName}</h3>
            <p className="text-sm text-slate-500 mt-0.5">or similar</p>
          </div>
          {offer.supplierLogo && (
            <div className="flex flex-col items-end gap-1 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={offer.supplierLogo} alt={offer.supplierName} className="h-5 w-auto max-w-[70px] object-contain" />
              {offer.supplierScore && (
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-700">{offer.supplierScore}</span>
                  <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-amber-400">
                    <path d="M6 1l1.4 2.8 3.1.45-2.25 2.19.53 3.09L6 8.1 3.22 9.53l.53-3.09L1.5 4.25l3.1-.45L6 1z" />
                  </svg>
                </div>
              )}
              {offer.supplierLabel && (
                <span className="text-[0.7rem] text-slate-400">
                  {offer.supplierLabel}
                  {offer.supplierReviews && ` · ${offer.supplierReviews} reviews`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Specs */}
        {specs.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {specs.map((s) => (
              <span key={s} className="text-xs text-slate-500">{s}</span>
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
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pick-up</div>
                  <div className="text-sm text-slate-800">{formatDate(offer.pickup)}</div>
                  {offer.locationName && (
                    <div className="text-xs text-blue-600 mt-0.5">{offer.locationName}</div>
                  )}
                </div>
              </div>
            )}
            {offer.returnDate && (
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Drop-off</div>
                  <div className="text-sm text-slate-800">{formatDate(offer.returnDate)}</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-slate-100" />

        {/* Badges */}
        {(offer.freeCancellation || offer.unlimitedMileage || offer.instantConfirmation) && (
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
            {offer.rentalDays ? `Total for ${offer.rentalDays} days` : offer.paymentLabel}
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-[-0.03em]">{offer.price}</div>
          <div className="text-xs text-slate-400 mt-0.5">Taxes &amp; fees included</div>
        </div>
      </div>
    </div>
  );
}
