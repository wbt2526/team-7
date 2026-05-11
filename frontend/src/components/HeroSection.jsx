import React from "react";

const HeroSection = ({ search, setSearch, tripCount }) => {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(15,23,42,0.72), rgba(15,23,42,0.26)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80')",
      }}
    >
      <div className="mx-auto flex min-h-[430px] max-w-7xl flex-col justify-center px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-100">
            Wanderlust travel catalog
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">
            Book real trips with clear availability.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">
            Search the live trip catalog by title or description, compare prices, and reserve seats with a simulated checkout flow.
          </p>

          <div className="mt-8 max-w-2xl rounded-2xl border border-white/15 bg-white p-2 shadow-2xl">
            <label className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="px-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Search trips
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Try Paris, hiking, beach..."
                className="min-h-12 flex-1 rounded-xl px-4 text-base font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <p className="mt-4 text-sm font-medium text-blue-50">
            {tripCount} {tripCount === 1 ? "trip" : "trips"} currently loaded from the backend.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
