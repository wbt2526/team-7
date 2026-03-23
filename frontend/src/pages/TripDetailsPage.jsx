import React, { useState } from "react";

const TripDetailsPage = () => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const safeAdults = Number(adults) || 0;
  const safeChildren = Number(children) || 0;
  const totalPrice = (safeAdults + safeChildren) * 1200;

  return (
    <div className="bg-gray-50">
      <header className="relative h-[400px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&w=2000"
          alt="Romantic Paris Getaway"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            Romantic Paris Getaway
          </h1>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-3">
        <section className="space-y-10 lg:col-span-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Trip Overview</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Discover the charm of Paris with a thoughtfully curated getaway that
              blends romance, culture, and unforgettable city views. From scenic
              strolls along the Seine to iconic landmarks and cozy cafes, every
              day offers a perfect mix of exploration and relaxation.
            </p>
            <p className="leading-relaxed text-gray-700">
              Whether you are planning a special celebration or simply craving a
              beautiful European escape, this package is designed to give you a
              stress-free travel experience with premium comfort and memorable
              moments in the City of Light.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">What's Included</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Round-trip Flights</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>4-star Hotel Accommodation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Daily Breakfast</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Professional Tour Guide</span>
              </li>
            </ul>
          </div>
        </section>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <p className="text-3xl font-bold text-blue-600">
                $1,200 <span className="text-base font-medium text-gray-500">/ person</span>
              </p>
              <p className="mt-1 text-sm text-gray-600">5 seats available</p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="adults"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Adults
                </label>
                <input
                  id="adults"
                  type="number"
                  min="0"
                  value={adults}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Ako korisnik obriše sve, postavi na prazno, inače postavi na taj broj
                    setAdults(val === '' ? '' : Math.max(0, parseInt(val, 10)));
                  }}
                  onBlur={() => {
                    // Ako korisnik napusti polje a ostavio je prazno, vrati na 1 (minimum za odrasle)
                    if (adults === '') setAdults(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="children"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Children
                </label>
                <input
                  id="children"
                  type="number"
                  min="0"
                  value={children}
                  onChange={(e) => {
                    const val = e.target.value;
                    setChildren(val === '' ? '' : Math.max(0, parseInt(val, 10)));
                  }}
                  onBlur={() => {
                    // Ako ostavi prazno za decu, vrati na 0
                    if (children === '') setChildren(0);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalPrice.toLocaleString()}
              </p>
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Proceed to Booking
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default TripDetailsPage;