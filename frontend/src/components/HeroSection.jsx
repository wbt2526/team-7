import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-white/58 backdrop-blur-[1px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/55 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[350px] max-w-7xl flex-col items-center justify-center px-6 pb-16 pt-12 text-center md:min-h-[420px]">
        <p className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-white/75 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-blue-700 shadow-sm">
          Curated journeys worldwide
        </p>
        <h1 className="max-w-5xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-7xl">
          Find Your Next{" "}
          <span className="text-blue-600">Adventure</span>
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 md:text-[22px]">
          Explore curated trips to the world&apos;s most breathtaking locations. Book your
          dream getaway today.
        </p>

        <div className="mt-10 w-full max-w-5xl rounded-[26px] border border-white/70 bg-white/95 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.25fr_1fr_1fr_auto]">
            <div className="flex items-center gap-3 rounded-2xl border border-transparent px-5 py-4 text-left transition hover:border-slate-200">
              <span className="text-xl text-slate-400">📍</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Destination
                </p>
                <p className="text-sm font-medium text-slate-700">Where to?</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-transparent px-5 py-4 text-left transition hover:border-slate-200">
              <span className="text-xl text-slate-400">📅</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Schedule
                </p>
                <p className="text-sm font-medium text-slate-700">Add dates</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-transparent px-5 py-4 text-left transition hover:border-slate-200">
              <span className="text-xl text-slate-400">👥</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Group size
                </p>
                <p className="text-sm font-medium text-slate-700">Travelers</p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-2xl bg-blue-600 px-10 py-4 text-base font-bold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
