import React, { useState } from "react";
import { Link, useLocation, Navigate } from 'react-router-dom';

const TRIP_PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&w=2000";

const TripDetailsPage = () => {
  const location = useLocation();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // Hvatanje podataka iz TripCard-a
  const { trip } = location.state || {};

  // Ako neko pokuša da uđe direktno na link a nema podataka o putovanju, vraćamo ga na home
  if (!trip) {
    return <Navigate to="/" />;
  }

  const safeAdults = Number(adults) || 0;
  const safeChildren = Number(children) || 0;
  
  // Koristimo PRAVU cenu iz baze podataka
  const tripPrice = Number(trip.price);
  const totalPrice = (safeAdults + safeChildren) * tripPrice;

  return (
    <div className="bg-gray-50">
      <header className="relative h-[400px] w-full overflow-hidden">
        <img
          src={trip.image ?? TRIP_PLACEHOLDER_IMAGE}
          alt={trip.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            {trip.title}
          </h1>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-3">
        <section className="space-y-10 lg:col-span-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Trip Overview</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              {trip.description || "Discover the charm of this destination with a thoughtfully curated getaway. Experience local culture, iconic landmarks, and cozy moments designed for a perfect travel experience."}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">What's Included</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Accommodation & Transportation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Professional Local Guide</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>All Taxes and Fees Included</span>
              </li>
            </ul>
          </div>
        </section>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <p className="text-3xl font-bold text-blue-600">
                ${tripPrice} <span className="text-base font-medium text-gray-500">/ person</span>
              </p>
              <p className={`mt-1 text-sm ${trip.remaining_places > 0 ? 'text-gray-600' : 'text-red-500 font-bold'}`}>
                {trip.remaining_places > 0 ? `${trip.remaining_places} seats available` : 'Sold Out'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="adults" className="mb-1 block text-sm font-medium text-gray-700">Adults</label>
                <input
                  id="adults"
                  type="number"
                  min="0"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value)))}
                  onBlur={() => { if (adults === '') setAdults(1); }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="children" className="mb-1 block text-sm font-medium text-gray-700">Children</label>
                <input
                  id="children"
                  type="number"
                  min="0"
                  value={children}
                  onChange={(e) => setChildren(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value)))}
                  onBlur={() => { if (children === '') setChildren(0); }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-2xl font-bold text-gray-900">${totalPrice.toLocaleString()}</p>
            </div>

            <Link
              to="/checkout"
              // Šaljemo sve neophodne podatke u CheckoutPage
              state={{ 
                tripId: trip.id,
                tripTitle: trip.title,
                adults: safeAdults, 
                children: safeChildren, 
                totalPrice: totalPrice 
              }}
              className={`mt-6 block text-center w-full rounded-lg py-3 font-semibold text-white transition ${
                trip.remaining_places > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 pointer-events-none'
              }`}
            >
              {trip.remaining_places > 0 ? 'Proceed to Booking' : 'Fully Booked'}
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default TripDetailsPage;