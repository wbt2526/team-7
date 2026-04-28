import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getTripMeta } from "../lib/tripPresentation";

function getStatusClasses(status) {
  if (status === "available") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "full") {
    return "bg-amber-50 text-amber-700";
  }
  if (status === "cancelled") {
    return "bg-rose-50 text-rose-700";
  }
  return "bg-slate-100 text-slate-700";
}

const ToursPage = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest("/trips/")
      .then(setTrips)
      .catch(() => setError("Failed to load tours."))
      .finally(() => setLoading(false));
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const haystack = `${trip.title} ${trip.description}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, trips]);

  const stats = useMemo(() => {
    return {
      total: trips.length,
      available: trips.filter((trip) => trip.status === "available").length,
      avgPrice: trips.length
        ? Math.round(trips.reduce((sum, trip) => sum + Number(trip.price), 0) / trips.length)
        : 0,
    };
  }, [trips]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-[0_30px_70px_rgba(15,23,42,0.22)] sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">Trip catalog</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Every tour, with the useful details up front</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            This page is built like a real catalog view: searchable, filterable, and easy to scan when you already know you want a trip rather than broad inspiration.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total tours</p>
            <p className="mt-3 text-4xl font-black text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Available now</p>
            <p className="mt-3 text-4xl font-black text-emerald-600">{stats.available}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Average price</p>
            <p className="mt-3 text-4xl font-black text-blue-600">${stats.avgPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Filter tours</h2>
            <p className="mt-1 text-sm text-slate-500">Search by title or description, then narrow by availability.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tours"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-700 outline-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-700 outline-none"
            >
              <option value="all">All statuses</option>
              <option value="available">Available</option>
              <option value="full">Full</option>
              <option value="cancelled">Cancelled</option>
              <option value="reported">Reported</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <p className="py-12 text-center text-slate-500">Loading tours...</p>}
      {error && <p className="py-12 text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 space-y-4">
          {filteredTrips.map((trip, index) => {
            const meta = getTripMeta(trip, index);
            return (
              <article
                key={trip.id}
                className="grid gap-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm md:grid-cols-[280px_1fr]"
              >
                <div className="h-full min-h-[220px]">
                  <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" />
                </div>

                <div className="flex flex-col p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {meta.categoryBadge}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClasses(trip.status)}`}>
                          {trip.status}
                        </span>
                      </div>
                      <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-900">{trip.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">{meta.location}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                      ⭐ {meta.rating}
                    </div>
                  </div>

                  <p className="mt-5 max-w-3xl text-slate-600">{trip.description}</p>

                  <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Price</p>
                      <p className="mt-2 text-3xl font-black text-blue-600">${Number(trip.price).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Seats left</p>
                      <p className="mt-2 text-3xl font-black text-slate-900">{trip.remaining_places}</p>
                    </div>
                    <div className="flex items-end sm:justify-end">
                      <Link
                        to={`/trip/${trip.id}`}
                        className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                      >
                        Open tour
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {!filteredTrips.length && (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-500">
              No tours match the current filters.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ToursPage;
