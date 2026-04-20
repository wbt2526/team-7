import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[600px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-8 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
          Find Your Next Adventure
        </h1>

        <div className="w-full max-w-4xl rounded-2xl bg-white p-4 shadow-md sm:p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1fr_auto]">
            <input
              type="text"
              placeholder="Where to?"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="date"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
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