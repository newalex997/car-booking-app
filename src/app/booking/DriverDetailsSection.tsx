import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { BookingFormValues } from "./BookingView";
import type { Country } from "@/app/api/countries/route";

interface Props {
  register: UseFormRegister<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
  countries: Country[];
}

const inputClass =
  "border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400";

export default function DriverDetailsSection({ register, errors, countries }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-base font-bold text-slate-900 mb-5">Driver details</h2>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <input type="text" placeholder="John Doe" className={inputClass} {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Identity document number</label>
          <input type="text" placeholder="Passport or national ID" className={inputClass} {...register("identityDoc")} />
          {errors.identityDoc && <p className="text-xs text-red-500">{errors.identityDoc.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Email address</label>
          <input type="email" placeholder="john@example.com" className={inputClass} {...register("email")} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Phone number</label>
          <input type="tel" placeholder="+1 555 000 0000" className={inputClass} {...register("phone")} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5 col-span-2 max-sm:col-span-1">
          <label className="text-sm font-medium text-slate-700">Country of residence</label>
          <select className={`${inputClass} bg-white`} {...register("country")}>
            <option value="">{countries.length === 0 ? "Loading…" : "Select country"}</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
        </div>
      </div>
    </section>
  );
}
