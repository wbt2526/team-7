import React from "react";

const HomeResultsToolbar = ({ filteredTripsCount, totalTripsCount }) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Live catalog</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Available trips</h2>
      </div>
      <p className="text-sm text-slate-500">
        Showing <span className="font-bold text-slate-950">{filteredTripsCount}</span> of{" "}
        <span className="font-bold text-slate-950">{totalTripsCount}</span> backend trips
      </p>
    </div>
  );
};

export default HomeResultsToolbar;
