import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to confirm";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const DestinationsPage = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest("/trips/")
      .then(setTrips)
      .catch(() => setError("Failed to load trips."))
      .finally(() => setLoading(false));
  }, []);

  const visibleTrips = useMemo(() => {
    const query = search.trim().toLowerCase();
    return trips
      .filter((trip) => !query || `${trip.title} ${trip.description}`.toLowerCase().includes(query))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [search, trips]);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Explore trips</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Browse the current catalog</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Destination labels will become more specific after a real location field is added. For now, this page shows only trip data stored by the backend.
            </p>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trips"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </header>

      {loading && <div className="rounded-2xl bg-white px-6 py-14 text-center text-slate-500">Loading trips...</div>}
      {error && <div className="rounded-2xl bg-red-50 px-6 py-8 text-center text-red-700">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-5">
          {visibleTrips.map((trip) => (
            <Link
              key={trip.id}
              to={`/trip/${trip.id}`}
              className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:grid-cols-[180px_1fr_auto] md:items-center"
            >
              <img src={trip.image} alt={trip.title} className="h-40 w-full rounded-xl object-cover md:h-32 md:w-44" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">
                    {trip.status}
                  </span>
                  <span className="text-sm text-slate-500">{formatDate(trip.date)}</span>
                </div>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{trip.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{trip.description}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">From</p>
                <p className="mt-1 text-3xl font-black text-blue-600">${Number(trip.price).toFixed(2)}</p>
                <p className="mt-2 text-sm text-slate-500">{trip.remaining_places} seats left</p>
              </div>
            </Link>
          ))}

          {!visibleTrips.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-500">
              No trips match your search.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default DestinationsPage;
