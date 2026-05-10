import React from "react";
import { Link } from "react-router-dom";

const statusStyles = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-100",
  full: "bg-amber-50 text-amber-700 border-amber-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
  reported: "bg-slate-100 text-slate-700 border-slate-200",
};

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to confirm";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const TripCard = ({ trip, isAdmin }) => {
  const price = Number(trip.price);
  const childPrice = Number(trip.child_price);
  const statusClass = statusStyles[trip.status] ?? statusStyles.reported;
  const description = trip.description?.length > 120
    ? `${trip.description.slice(0, 120)}...`
    : trip.description;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={trip.image}
          alt={trip.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass}`}>
          {trip.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-3">
          <h3 className="text-2xl font-black tracking-tight text-slate-950">{trip.title}</h3>
          <p className="text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Date</p>
            <p className="mt-1 font-semibold text-slate-700">{formatDate(trip.date)}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Duration</p>
            <p className="mt-1 font-semibold text-slate-700">{trip.duration} days</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Seats</p>
            <p className="mt-1 font-semibold text-slate-700">
              {trip.remaining_places} / {trip.total_places}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Child</p>
            <p className="mt-1 font-semibold text-slate-700">${childPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Adult price</p>
            <p className="mt-1 text-3xl font-black text-blue-600">${price.toFixed(2)}</p>
          </div>
          <Link
            to={`/trip/${trip.id}`}
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            View trip
          </Link>
        </div>

        {isAdmin && (
          <Link
            to={`/edit-trip/${trip.id}`}
            className="mt-4 rounded-xl border border-blue-200 py-3 text-center text-sm font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Edit trip
          </Link>
        )}
      </div>
    </article>
  );
};

export default TripCard;
