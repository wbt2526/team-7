import React from "react";

const HomeResultsToolbar = ({ filteredTripsCount, sortBy, setSortBy, SORT_OPTIONS }) => {
  return (
    <section className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-[240px] lg:w-[240px]" />

      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredTripsCount}</span> trips
          matched your filters
        </p>
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
          <span className="text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm outline-none"
          >
            {Object.entries(SORT_OPTIONS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default HomeResultsToolbar;
