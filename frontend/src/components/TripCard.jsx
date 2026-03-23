import React from "react";

const TripCard = ({ title, price, image, remaining_places }) => {
  const isSoldOut = remaining_places === 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-52 w-full">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-blue-600">${price}</span>
          {isSoldOut ? (
            <span className="text-sm font-medium text-red-500">Sold Out</span>
          ) : (
            <span className="text-sm text-gray-500">
              {remaining_places} places left
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={isSoldOut}
          className={`mt-4 w-full rounded py-2 font-medium transition-colors ${
            isSoldOut
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TripCard;