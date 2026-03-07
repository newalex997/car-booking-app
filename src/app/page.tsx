import SearchForm from "@/components/SearchForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-[1200px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="text-[1.375rem] font-extrabold text-white tracking-[-0.03em]">
            DriveEasy
          </div>
          <nav className="flex items-center gap-8">
            <a
              href="/bookings"
              className="bg-white/15 text-white px-5 py-2 rounded-md backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              My Bookings
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="min-h-screen flex items-center justify-center px-8 pt-40 pb-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
        }}
      >
        {/* radial glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, rgba(96,165,250,0.15) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-[1100px] w-full text-center relative z-[1]">
          <p className="inline-block text-[0.8125rem] font-semibold text-blue-300 uppercase tracking-[0.1em] mb-4">
            Rent a car, anywhere
          </p>
          <h1 className="[font-size:clamp(2.5rem,5vw,4rem)] font-extrabold text-white leading-[1.08] tracking-[-0.035em] mb-5">
            Find Your Perfect Ride
          </h1>
          <p className="text-lg text-white/65 mb-10 leading-relaxed">
            Search hundreds of vehicles at the best prices, available at your
            location
          </p>
          <div className="shadow-[0_20px_60px_rgba(0,0,0,0.25)] rounded-2xl">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8 bg-white flex-1">
        <div className="max-w-[1000px] mx-auto grid grid-cols-3 gap-10 max-md:grid-cols-1 max-md:gap-8">
          <div className="text-center max-md:text-left max-md:flex max-md:items-start max-md:gap-4">
            <div className="w-[52px] h-[52px] bg-blue-50 rounded-[14px] flex items-center justify-center mx-auto mb-5 text-blue-600 max-md:mx-0 max-md:mb-0 max-md:shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="w-6 h-6"
              >
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div>
              <h3 className="text-[1.0625rem] font-bold text-slate-900 mb-2 tracking-[-0.01em]">
                Wide Selection
              </h3>
              <p className="text-[0.9375rem] text-slate-500 leading-relaxed">
                Choose from economy to luxury — sedans, SUVs, sports cars, and
                more.
              </p>
            </div>
          </div>

          <div className="text-center max-md:text-left max-md:flex max-md:items-start max-md:gap-4">
            <div className="w-[52px] h-[52px] bg-blue-50 rounded-[14px] flex items-center justify-center mx-auto mb-5 text-blue-600 max-md:mx-0 max-md:mb-0 max-md:shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2l2.09 6.26L20 9.27l-4.91 4.73L16.18 20 12 17.27 7.82 20l1.09-6L4 9.27l5.91-.01L12 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-[1.0625rem] font-bold text-slate-900 mb-2 tracking-[-0.01em]">
                Best Prices
              </h3>
              <p className="text-[0.9375rem] text-slate-500 leading-relaxed">
                Compare rates from top rental providers to get the best deal
                guaranteed.
              </p>
            </div>
          </div>

          <div className="text-center max-md:text-left max-md:flex max-md:items-start max-md:gap-4">
            <div className="w-[52px] h-[52px] bg-blue-50 rounded-[14px] flex items-center justify-center mx-auto mb-5 text-blue-600 max-md:mx-0 max-md:mb-0 max-md:shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-[1.0625rem] font-bold text-slate-900 mb-2 tracking-[-0.01em]">
                Instant Booking
              </h3>
              <p className="text-[0.9375rem] text-slate-500 leading-relaxed">
                Book in minutes with instant confirmation — no waiting, no
                hassle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-8 bg-white border-t border-slate-200 text-center text-sm text-slate-500">
        <p>© 2026 DriveEasy. All rights reserved.</p>
      </footer>
    </div>
  );
}
