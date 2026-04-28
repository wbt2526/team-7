import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

const AboutPage = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    apiRequest("/trips/").then(setTrips).catch(() => setTrips([]));
  }, []);

  const stats = useMemo(() => {
    const availableTrips = trips.filter((trip) => trip.status === "available").length;
    const totalSeats = trips.reduce((sum, trip) => sum + Number(trip.remaining_places || 0), 0);

    return {
      totalTrips: trips.length,
      availableTrips,
      totalSeats,
    };
  }, [trips]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_40%,#f8fafc_100%)] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-600">About Wanderlust</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            A travel product that tries to feel helpful before it tries to feel clever
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Wanderlust is built around a straightforward idea: discovering, booking, and managing trips should feel calm, visual, and understandable. We focus on making availability clearer, bookings safer, and admin controls more predictable.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[22px] border border-slate-200 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Trips in catalog</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{stats.totalTrips}</p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Available now</p>
              <p className="mt-3 text-3xl font-black text-emerald-600">{stats.availableTrips}</p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Open seats</p>
              <p className="mt-3 text-3xl font-black text-blue-600">{stats.totalSeats}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-[0_25px_70px_rgba(15,23,42,0.2)]">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-200">What the platform does</p>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li>Users can browse trips, book seats, and complete payment.</li>
            <li>Available seats only change after payment success.</li>
            <li>Trips automatically become full when no seats remain.</li>
            <li>Admins can manage lifecycle states like cancelled or reported.</li>
          </ul>
          <Link
            to="/tours"
            className="mt-8 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
          >
            See the catalog
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">1. Discover</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Browse with clarity</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Home, destinations, tours, and deals are separated on purpose so users can browse by mood, by place, by catalog, or by price.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">2. Reserve</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Book with guardrails</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Booking validates capacity and status so users cannot reserve cancelled, full, or oversubscribed trips.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">3. Confirm</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Pay and update availability</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Payment confirmation locks in the booking, updates remaining seats, and keeps availability more trustworthy for the next user.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
