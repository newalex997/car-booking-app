import Link from "next/link";

export default function BookingConfirmed({ bookingCode }: { bookingCode: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 text-green-500">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5.5 8L7 9.5 10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900">Booking confirmed!</h2>
      <p className="text-sm text-slate-500">Your booking reference is</p>
      <div className="bg-white border border-slate-200 rounded-xl px-8 py-4 text-2xl font-mono font-bold text-slate-900 tracking-widest">
        {bookingCode}
      </div>
      <p className="text-xs text-slate-400 mt-2">Keep this code to manage your booking.</p>
      <Link href="/" className="mt-4 px-6 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors">
        Back to home
      </Link>
    </div>
  );
}
