import React, { useEffect, useMemo, useState } from "react";
import TripCard from "../components/TripCard";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

const DealsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getStoredUser();

  useEffect(() => {
    apiRequest("/trips/")
      .then(setTrips)
      .catch(() => setError("Failed to load best value trips."))
      .finally(() => setLoading(false));
  }, []);

  const bestValueTrips = useMemo(() => {
    return [...trips]
      .filter((trip) => trip.status === "available")
      .sort((a, b) => Number(a.price) - Number(b.price))
      .slice(0, 6);
  }, [trips]);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Best value</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Lowest-priced available trips
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          This page does not invent discounts. It simply sorts currently available backend trips by their real adult price.
        </p>
      </header>

      {loading && <div className="rounded-2xl bg-white px-6 py-14 text-center text-slate-500">Loading best value trips...</div>}
      {error && <div className="rounded-2xl bg-red-50 px-6 py-8 text-center text-red-700">{error}</div>}

      {!loading && !error && (
        bestValueTrips.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {bestValueTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} isAdmin={user?.role === "admin"} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-500">
            No available trips are currently listed.
          </div>
        )
      )}
    </section>
  );
};

export default DealsPage;
