import { BookingResult } from "@/app/api/bookings/search/route";

export default function BookingResultItem({ result }: { result: BookingResult }) {
  const { offer } = result;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
        <span className="font-mono font-bold text-slate-900 text-lg tracking-wider">
          {result.bookingCode}
        </span>
        <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full">
          Confirmed
        </span>
      </div>

      {/* Offer details */}
      {offer && (
        <div className="flex items-center gap-4 px-5 py-4 bg-slate-50 border-b border-slate-100">
          {offer.carImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={offer.carImg} alt={offer.carName} className="h-14 w-20 object-contain shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-900 text-sm leading-tight">{offer.carName}</div>
            <div className="text-xs text-slate-500 mt-0.5">{offer.supplierName}</div>
            {(offer.transmission || offer.seats || offer.bags || offer.doors) && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                {[offer.transmission, offer.seats, offer.bags, offer.doors].filter(Boolean).map((s) => (
                  <span key={s} className="text-xs text-slate-400">{s}</span>
                ))}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="font-extrabold text-slate-900">{offer.price}</div>
            {offer.rentalDays && (
              <div className="text-xs text-slate-400">{offer.rentalDays} days</div>
            )}
          </div>
        </div>
      )}

      {/* Pickup / drop-off */}
      {offer && (offer.pickup || offer.returnDate) && (
        <div className="flex gap-6 px-5 py-4 border-b border-slate-100 max-sm:flex-col max-sm:gap-2">
          {offer.pickup && (
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Pick-up</div>
              <div className="text-sm text-slate-800">{offer.pickup}</div>
              {offer.locationName && <div className="text-xs text-blue-600 mt-0.5">{offer.locationName}</div>}
            </div>
          )}
          {offer.returnDate && (
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Drop-off</div>
              <div className="text-sm text-slate-800">{offer.returnDate}</div>
            </div>
          )}
        </div>
      )}

      {/* Driver details */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm px-5 py-4 max-sm:grid-cols-1">
        <Field label="Name" value={result.details.name} />
        <Field label="Document" value={result.identityDoc} />
        <Field label="Email" value={result.details.email} />
        <Field label="Phone" value={result.details.phone} />
        <Field label="Country" value={result.details.country} />
        {result.details.flightNumber && (
          <Field label="Flight" value={result.details.flightNumber} />
        )}
        {result.details.specialRequests && (
          <div className="col-span-2 max-sm:col-span-1">
            <Field label="Special requests" value={result.details.specialRequests} />
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-slate-800">{value}</div>
    </div>
  );
}
