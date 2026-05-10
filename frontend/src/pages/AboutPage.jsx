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
    <section className="mx-auto w-full max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">About Wanderlust</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            A clear full-stack travel booking project.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
            Wanderlust lets users browse real trips from the backend, create bookings, complete a simulated payment, and manage pending reservations. Admin users can review bookings and maintain trip records.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Trips</p>
              <p className="mt-3 text-3xl font-black text-slate-950">{stats.totalTrips}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Available</p>
              <p className="mt-3 text-3xl font-black text-emerald-600">{stats.availableTrips}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Open seats</p>
              <p className="mt-3 text-3xl font-black text-blue-600">{stats.totalSeats}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-200">What is real</p>
          <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
            <li>Trip listings come from the FastAPI backend.</li>
            <li>Search, status filters, and price/date sorting use actual trip fields.</li>
            <li>Bookings and payment confirmations are stored in the database.</li>
            <li>Payment is simulated for academic testing and does not process real cards.</li>
          </ul>
          <Link
            to="/tours"
            className="mt-8 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
          >
            Browse tours
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ["Browse", "Search the live trip catalog by title or description."],
          ["Reserve", "Choose travelers and create a pending booking."],
          ["Confirm", "Use the simulated payment flow to confirm seats."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">{title}</p>
            <p className="mt-3 leading-7 text-slate-600">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutPage;
