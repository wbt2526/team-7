import React from "react";
import { useLocation } from "react-router-dom";

const MyBookingsPage = () => {
  const location = useLocation();
  const newBookingData = location.state?.newBooking;

  const pastBookings = [
    {
      id: "old-1",
      destinationImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&w=1200&q=80",
      title: "Historical Rome Tour",
      dates: "May 10 - May 15, 2025",
      passengers: "2 Adults",
      totalPrice: "$1,700",
      status: "Completed",
      statusTone: "completed",
    }
  ];

  // 3. Ako imamo novu rezervaciju sa Checkouta, pravimo objekat za nju
  const recentBooking = newBookingData ? {
    id: "new-1",
    destinationImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&w=1200&q=80",
    title: "Romantic Paris Getaway",
    dates: "Oct 15 - Oct 22, 2026", // Za sada fiksiran datum
    passengers: `${newBookingData.adults} Adults, ${newBookingData.children} Children`,
    totalPrice: `$${newBookingData.totalPrice.toLocaleString()}`,
    status: "Confirmed",
    statusTone: "confirmed",
  } : null;

  // 4. Spajamo novu (ako postoji) i stare rezervacije u jednu listu
  const allBookings = recentBooking ? [recentBooking, ...pastBookings] : pastBookings;

  const badgeClasses = (tone) => {
    if (tone === "confirmed") return "bg-green-100 text-green-700";
    if (tone === "completed") return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <section className="bg-gray-50 min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">My Bookings</h1>

        <div className="flex flex-col gap-6">
          {allBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row"
            >
              <img
                src={booking.destinationImage}
                alt={booking.title}
                className="h-32 w-full rounded-lg object-cover md:w-48"
              />

              <div className="flex flex-1 flex-col">
                <h2 className="text-lg font-bold text-gray-900">
                  {booking.title}
                </h2>
                <p className="mt-2 text-sm text-gray-700">{booking.dates}</p>
                <p className="mt-1 font-medium text-blue-600">
                  {booking.passengers}
                </p>
              </div>

              <div className="flex flex-col items-start justify-between md:items-end">
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    {booking.totalPrice}
                  </p>
                  <span
                    className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${badgeClasses(
                      booking.statusTone
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-4 inline-flex cursor-pointer items-center text-sm font-medium text-gray-600 transition hover:text-blue-600"
                >
                  View Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyBookingsPage;