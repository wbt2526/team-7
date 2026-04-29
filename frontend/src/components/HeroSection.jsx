import React, { useState } from "react";

const HeroSection = () => {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [travelers, setTravelers] = useState("");

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1800&q=80')",
        minHeight: "420px",
      }}
    >
      {/* Light overlay to match the washed-out look */}
      <div className="absolute inset-0 bg-white/30" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        {/* Heading */}
        <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
          Find Your Next{" "}
          <span className="text-blue-600">Adventure</span>
        </h1>

        {/* Subheading */}
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-900 md:text-lg">
          Explore curated trips to the world&apos;s most breathtaking locations. Book your
          dream getaway today.
        </p>

        {/* Search bar */}
        <div className="mt-10 w-full max-w-4xl rounded-2xl bg-white px-2 py-2 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto]">

            {/* Where to */}
            <label className="flex items-center gap-3 px-5 py-4 cursor-text">
              <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418-4.418-7-7.582-7-11a7 7 0 1 1 14 0c0 3.418-2.582 6.582-7 11z" />
                <circle cx="12" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to?"
                className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none"
              />
            </label>

            <div className="hidden md:flex items-center"><div className="h-8 w-px bg-slate-200" /></div>

            {/* Add dates */}
            <label className="flex items-center gap-3 px-5 py-4 cursor-text">
              <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                placeholder="Add dates"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none"
              />
            </label>

            <div className="hidden md:flex items-center"><div className="h-8 w-px bg-slate-200" /></div>

            {/* Travelers */}
            <label className="flex items-center gap-3 px-5 py-4 cursor-text">
              <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <input
                type="number"
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                placeholder="Travelers"
                className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none"
              />
            </label>

            {/* Search button */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition hover:bg-blue-700 m-1"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
              </svg>
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;