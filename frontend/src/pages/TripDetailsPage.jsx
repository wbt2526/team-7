import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";
import { formatTripDate } from "../lib/tripPresentation";

const statusStyles = {
  available: "border-emerald-200 bg-emerald-50 text-emerald-700",
  full: "border-amber-200 bg-amber-50 text-amber-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  reported: "border-slate-200 bg-slate-100 text-slate-700",
};

function clampNumber(value, min, max) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return min;
  return Math.min(Math.max(parsed, min), max);
}

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const user = getStoredUser();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    apiRequest(`/trips/${id}`)
      .then((data) => {
        if (isMounted) setTrip(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Trip details could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-600">Loading trip details...</p>
        </div>
      </section>
    );
  }

  if (error || !trip) {
    return (
      <section className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">Trip unavailable</h1>
          <p className="mt-3 text-slate-600">{error || "Trip not found."}</p>
          <button
            type="button"
            onClick={() => navigate("/tours")}
            className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Back to catalog
          </button>
        </div>
      </section>
    );
  }

  const adultPrice = Number(trip.price);
  const childPrice = Number(trip.child_price);
  const remainingPlaces = Number(trip.remaining_places);
  const totalPlaces = Number(trip.total_places);
  const status = trip.status || "available";
  const totalPassengers = Number(adults) + Number(children);
  const totalPrice = Number(adults) * adultPrice + Number(children) * childPrice;
  const bookingBlocked = status !== "available" || remainingPlaces <= 0;
  const passengerBlocked = totalPassengers <= 0 || totalPassengers > remainingPlaces;
  const statusClass = statusStyles[status] ?? statusStyles.reported;

  const handleAdultsChange = (value) => {
    const nextAdults = clampNumber(value, 1, Math.max(1, remainingPlaces));
    const nextChildren = clampNumber(children, 0, Math.max(0, remainingPlaces - nextAdults));
    setAdults(nextAdults);
    setChildren(nextChildren);
  };

  const handleChildrenChange = (value) => {
    setChildren(clampNumber(value, 0, Math.max(0, remainingPlaces - Number(adults))));
  };

  const handleBooking = () => {
    if (!user?.token) {
      navigate("/auth", { state: { defaultIsLogin: true } });
      return;
    }

    if (bookingBlocked || passengerBlocked) return;

    navigate("/checkout", {
      state: {
        trip,
        adults: Number(adults),
        children: Number(children),
      },
    });
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-[360px] bg-slate-200 md:h-[460px]">
            <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass}`}>
                {status}
              </span>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                {trip.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <main className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Trip overview</h2>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">
                {trip.description}
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Date</p>
                <p className="mt-2 font-bold text-slate-900">{formatTripDate(trip.date)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Duration</p>
                <p className="mt-2 font-bold text-slate-900">{trip.duration} days</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Adult price</p>
                <p className="mt-2 font-bold text-slate-900">${adultPrice.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Child price</p>
                <p className="mt-2 font-bold text-slate-900">${childPrice.toFixed(2)}</p>
              </div>
            </section>
          </main>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="border-b border-slate-100 pb-5">
                <p className="text-sm font-semibold text-slate-500">From</p>
                <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">${adultPrice.toFixed(2)}</p>
                <p className="mt-1 text-sm text-slate-500">per adult, simulated booking flow</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">{remainingPlaces}</p>
                  <p className="mt-1 text-slate-500">remaining seats</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">{totalPlaces}</p>
                  <p className="mt-1 text-slate-500">total seats</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Adults</label>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, remainingPlaces)}
                    value={adults}
                    onChange={(e) => handleAdultsChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Children</label>
                  <input
                    type="number"
                    min="0"
                    max={Math.max(0, remainingPlaces - Number(adults))}
                    value={children}
                    onChange={(e) => handleChildrenChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Travelers</span>
                  <span className="font-bold text-slate-900">{totalPassengers}</span>
                </div>
                <div className="mt-3 flex justify-between text-sm text-slate-600">
                  <span>Total</span>
                  <span className="text-xl font-black text-slate-950">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {!user?.token && (
                <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  Log in before checkout so the booking can be attached to your account.
                </div>
              )}

              {bookingBlocked && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Booking is unavailable while this trip status is {status}.
                </div>
              )}

              {passengerBlocked && !bookingBlocked && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Passenger count cannot exceed the remaining seats.
                </div>
              )}

              <button
                type="button"
                onClick={handleBooking}
                disabled={bookingBlocked || passengerBlocked}
                className="mt-6 w-full rounded-xl bg-slate-950 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {!user?.token ? "Log in to book" : bookingBlocked ? "Booking unavailable" : "Continue to checkout"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default TripDetailsPage;
