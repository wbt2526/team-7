import React from "react";
import { Link } from "react-router-dom";
import { getTripMeta } from "../lib/tripPresentation";

const TripCard = ({
  id,
  title,
  price,
  image,
  remaining_places,
  isAdmin,
  index = 0,
}) => {
  const { location, categoryBadge, rating } = getTripMeta({ title, description: "" }, index);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
          ⭐ {rating}
        </span>
        <span className="absolute bottom-4 left-4 rounded-lg bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          {categoryBadge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-[28px] font-bold tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="mb-5 text-sm text-slate-500">{location}</p>
        
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              From
            </p>
            <p className="text-3xl font-black text-blue-600">${price.toLocaleString()}</p>
            <p className="text-xs text-slate-500">{remaining_places} seats left</p>
          </div>
          <Link
            to={`/trip/${id}`}
            className="rounded-xl bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
          >
            View Details
          </Link>
        </div>

        {isAdmin && (
          <Link
            to={`/edit-trip/${id}`}
            className="mt-4 rounded-xl border border-blue-200 py-3 text-center text-sm font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Edit Adventure
          </Link>
        )}
      </div>
    </div>
  );
};

export default TripCard;
