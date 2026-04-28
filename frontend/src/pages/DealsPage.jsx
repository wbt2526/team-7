import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getTripMeta } from "../lib/tripPresentation";

function getOriginalPrice(price, index) {
  return Math.round(price * (1.18 + (index % 3) * 0.07));
}

const DealsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest("/trips/")
      .then(setTrips)
      .catch(() => setError("Failed to load deals."))
      .finally(() => setLoading(false));
  }, []);

  const deals = useMemo(() => {
    return [...trips]
      .filter((trip) => trip.status === "available")
      .sort((a, b) => Number(a.price) - Number(b.price))
      .slice(0, 8);
  }, [trips]);

  const featuredDeals = deals.slice(0, 3);
  const moreDeals = deals.slice(3);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,#fef3c7_0%,#f8fafc_35%,#dbeafe_100%)] p-6 shadow-sm sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-600">Best value</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Deals worth clicking before they disappear</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Instead of looking like another catalog page, this one focuses on lower-priced available trips and puts the savings story first.
            </p>
          </div>

          <div className="rounded-[28px] bg-white/85 p-6 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Deal summary</p>
            <p className="mt-3 text-4xl font-black text-slate-900">{deals.length}</p>
            <p className="mt-2 text-sm text-slate-500">Available budget-friendly trips pulled from the live catalog.</p>
          </div>
        </div>
      </div>

      {loading && <p className="py-12 text-center text-slate-500">Loading deals...</p>}
      {error && <p className="py-12 text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredDeals.map((trip, index) => {
              const meta = getTripMeta(trip, index);
              const originalPrice = getOriginalPrice(Number(trip.price), index);
              const savings = originalPrice - Number(trip.price);

              return (
                <article
                  key={trip.id}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative h-60">
                    <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" />
                    <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-900">
                      Save ${savings.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {meta.categoryBadge}
                      </span>
                      <span className="text-sm font-bold text-slate-500">⭐ {meta.rating}</span>
                    </div>

                    <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">{trip.title}</h2>
                    <p className="mt-2 text-sm text-slate-500">{meta.location}</p>

                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-400 line-through">
                          ${originalPrice.toLocaleString()}
                        </p>
                        <p className="text-4xl font-black text-blue-600">
                          ${Number(trip.price).toLocaleString()}
                        </p>
                      </div>
                      <Link
                        to={`/trip/${trip.id}`}
                        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                      >
                        Grab deal
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">More affordable picks</h2>
                <p className="mt-1 text-sm text-slate-500">Quick comparisons for the rest of the lower-priced catalog.</p>
              </div>
            </div>

            <div className="space-y-4">
              {moreDeals.map((trip, index) => {
                const meta = getTripMeta(trip, index + 3);
                const originalPrice = getOriginalPrice(Number(trip.price), index + 3);
                const savings = originalPrice - Number(trip.price);

                return (
                  <div
                    key={trip.id}
                    className="grid gap-4 rounded-[24px] border border-slate-200 p-4 md:grid-cols-[96px_1fr_auto] md:items-center"
                  >
                    <img src={trip.image} alt={trip.title} className="h-24 w-full rounded-2xl object-cover md:w-24" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-black text-slate-900">{trip.title}</h3>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                          Save ${savings.toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{meta.location}</p>
                    </div>
                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <div className="text-left md:text-right">
                        <p className="text-sm text-slate-400 line-through">${originalPrice.toLocaleString()}</p>
                        <p className="text-2xl font-black text-blue-600">${Number(trip.price).toLocaleString()}</p>
                      </div>
                      <Link
                        to={`/trip/${trip.id}`}
                        className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                      >
                        View deal
                      </Link>
                    </div>
                  </div>
                );
              })}

              {!deals.length && (
                <div className="rounded-[24px] border border-dashed border-slate-300 px-6 py-12 text-center text-slate-500">
                  No active deals are available right now.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default DealsPage;
