import React from "react";
import { Link } from "react-router-dom";

const TripCard = ({ id, title, price, image, remaining_places, isAdmin }) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg">
      {/* Slika */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Sadržaj */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-blue-600">${price}</p>
            <p className="text-xs text-gray-500">{remaining_places} places left</p>
          </div>
        </div>

        {/* Dugmići */}
        <div className="mt-4 flex flex-col gap-2">
          <Link
            to={`/trip/${id}`}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-center text-sm font-bold text-white transition hover:bg-blue-700"
          >
            View Details
          </Link>

          {/* NOVO: Edit dugme koje vidi SAMO admin */}
          {isAdmin && (
            <Link
              to={`/edit-trip/${id}`}
              className="w-full rounded-lg border-2 border-blue-600 py-2 text-center text-sm font-bold text-blue-600 transition hover:bg-blue-50"
            >
              ⚙️ Edit Adventure
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;