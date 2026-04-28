import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getTripMeta } from "../lib/tripPresentation";

const DestinationsPage = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest("/trips/")
      .then(setTrips)
      .catch(() => setError("Failed to load destinations."))
      .finally(() => setLoading(false));
  }, []);

  const destinations = useMemo(() => {
    const grouped = new Map();

    trips.forEach((trip, index) => {
      const meta = getTripMeta(trip, index);
      const key = meta.location;

      if (!grouped.has(key)) {
        grouped.set(key, {
          location: meta.location,
          image: trip.image,
          count: 0,
          cheapest: Number(trip.price),
          averagePrice: 0,
          sampleTripId: trip.id,
          sampleTripTitle: trip.title,
          totalPrice: 0,
        });
      }

      const current = grouped.get(key);
      current.count += 1;
      current.totalPrice += Number(trip.price);
      current.cheapest = Math.min(current.cheapest, Number(trip.price));
      current.averagePrice = current.totalPrice / current.count;
    });

    return Array.from(grouped.values())
      .filter((item) => item.location.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.location.localeCompare(b.location));
  }, [search, trips]);

  useEffect(() => {
    if (!destinations.length) {
      setSelectedLocation("");
      return;
    }

    const stillExists = destinations.some((item) => item.location === selectedLocation);
    if (!stillExists) {
      setSelectedLocation(destinations[0].location);
    }
  }, [destinations, selectedLocation]);

  const featuredDestination = destinations.find((item) => item.location === selectedLocation) ?? null;

  const destinationTrips = useMemo(() => {
    if (!featuredDestination) {
      return [];
    }

    return trips
      .map((trip, index) => ({ trip, meta: getTripMeta(trip, index) }))
      .filter(({ meta }) => meta.location === featuredDestination.location)
      .slice(0, 4);
  }, [featuredDestination, trips]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#60a5fa_100%)] px-6 py-8 text-white shadow-[0_30px_80px_rgba(30,64,175,0.25)] sm:px-8 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-100">Explore by place</p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Destinations that feel like a decision, not just a list</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50/90">
              Compare locations first, then jump into the trips waiting there. This page is built for browsing by place instead of browsing by card after card.
            </p>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destination"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-white placeholder:text-blue-100/70 outline-none backdrop-blur md:max-w-sm"
          />
        </div>
      </div>

      {loading && <p className="py-12 text-center text-slate-500">Loading destinations...</p>}
      {error && <p className="py-12 text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">All places</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {destinations.length}
              </span>
            </div>

            <div className="space-y-3">
              {destinations.map((destination) => {
                const isActive = destination.location === selectedLocation;
                return (
                  <button
                    key={destination.location}
                    type="button"
                    onClick={() => setSelectedLocation(destination.location)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-blue-200 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-base font-bold text-slate-900">{destination.location}</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                      <span>{destination.count} trips</span>
                      <span>from ${destination.cheapest.toLocaleString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-8">
            {featuredDestination && (
              <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="min-h-[320px]">
                    <img
                      src={featuredDestination.image}
                      alt={featuredDestination.location}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-6 sm:p-8">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Featured destination</p>
                      <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                        {featuredDestination.location}
                      </h2>
                      <p className="mt-4 text-slate-500">
                        Start here if you want a quick feel for this destination’s catalog before diving into specific trips.
                      </p>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Trips</p>
                        <p className="mt-2 text-2xl font-black text-slate-900">{featuredDestination.count}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">From</p>
                        <p className="mt-2 text-2xl font-black text-blue-600">
                          ${featuredDestination.cheapest.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Average</p>
                        <p className="mt-2 text-2xl font-black text-slate-900">
                          ${Math.round(featuredDestination.averagePrice).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/trip/${featuredDestination.sampleTripId}`}
                      className="mt-8 inline-flex w-fit rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      Start with {featuredDestination.sampleTripTitle}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Trips in this destination</h3>
                <span className="text-sm text-slate-500">{destinationTrips.length} shown</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {destinationTrips.map(({ trip, meta }) => (
                  <Link
                    key={trip.id}
                    to={`/trip/${trip.id}`}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {meta.categoryBadge}
                        </span>
                        <h4 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{trip.title}</h4>
                        <p className="mt-2 text-sm text-slate-500">{trip.description}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-600">
                        ⭐ {meta.rating}
                      </div>
                    </div>

                    <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">From</p>
                        <p className="text-3xl font-black text-blue-600">${Number(trip.price).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-slate-500">{trip.remaining_places} seats left</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DestinationsPage;
