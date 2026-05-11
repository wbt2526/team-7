import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";
import { formatTripDate } from "../lib/tripPresentation";

const TRIP_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

const statusStyles = {
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [tripsMap, setTripsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getStoredUser();
        if (!user?.token) {
          setError("Please log in to view your bookings.");
          return;
        }

        const bookingsData = await apiRequest("/bookings/me", { token: user.token });
        setBookings(bookingsData);

        const uniqueTripIds = [...new Set(bookingsData.map((booking) => booking.trip_id))];
        const tripDetails = {};
        const allTrips = await apiRequest("/trips/");

        uniqueTripIds.forEach((tripId) => {
          const foundTrip = allTrips.find((trip) => trip.id === tripId);
          if (foundTrip) tripDetails[tripId] = foundTrip;
        });

        setTripsMap(tripDetails);
      } catch (err) {
        setError(err.message || "Your bookings could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const user = getStoredUser();
    if (!user?.token) {
      setError("Please log in to cancel a booking.");
      return;
    }

    setError("");
    setMessage("");
    setCancelingId(bookingId);

    try {
      const updatedBooking = await apiRequest(`/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        token: user.token,
      });
      setBookings((current) =>
        current.map((booking) => (booking.id === bookingId ? updatedBooking : booking))
      );
      setMessage("Pending booking cancelled.");
    } catch (err) {
      setError(err.message || "Could not cancel booking.");
    } finally {
      setCancelingId(null);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-600">Loading your bookings...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Traveler dashboard</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">My Bookings</h1>
            <p className="mt-2 text-slate-600">Review your pending, confirmed, and cancelled trip bookings.</p>
          </div>
          <Link
            to="/tours"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            Browse trips
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">No bookings yet</h2>
            <p className="mx-auto mt-3 max-w-md text-slate-600">
              Choose a trip from the catalog and complete checkout to see your booking here.
            </p>
            <Link
              to="/tours"
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Explore catalog
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {bookings.map((booking) => {
              const trip = tripsMap[booking.trip_id];
              const status = booking.booking_status || "pending";
              const isPending = status === "pending";
              const isConfirmed = status === "confirmed";
              const isCancelled = status === "cancelled";
              const statusClass = statusStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-700";

              return (
                <article
                  key={booking.id}
                  className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
                    isCancelled ? "opacity-80" : ""
                  }`}
                >
                  <div className="grid md:grid-cols-[260px_1fr]">
                    <div className="h-56 bg-slate-100 md:h-full">
                      <img
                        src={trip?.image || TRIP_PLACEHOLDER_IMAGE}
                        alt={trip?.title || `Trip ${booking.trip_id}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass}`}>
                            {status}
                          </span>
                          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                            {trip?.title || `Trip #${booking.trip_id}`}
                          </h2>
                          <p className="mt-2 text-sm text-slate-500">
                            Booked on {formatTripDate(booking.created_at)}
                          </p>
                        </div>

                        <p className="text-3xl font-black text-blue-600">
                          ${Number(booking.total_price).toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-6 grid gap-3 border-y border-slate-100 py-5 text-sm sm:grid-cols-3">
                        <div>
                          <p className="font-bold text-slate-950">{booking.adults}</p>
                          <p className="mt-1 text-slate-500">Adults</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-950">{booking.children}</p>
                          <p className="mt-1 text-slate-500">Children</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-950">{booking.total_seats}</p>
                          <p className="mt-1 text-slate-500">Total seats</p>
                        </div>
                      </div>

                      {isPending && (
                        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                          Payment is pending. No seats are confirmed until payment succeeds.
                        </div>
                      )}

                      {isConfirmed && (
                        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                          Booking confirmed. Seats have been reserved for this trip.
                        </div>
                      )}

                      {isCancelled && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                          This pending booking was cancelled and no seats were reserved.
                        </div>
                      )}

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                          to={`/trip/${booking.trip_id}`}
                          className="rounded-xl border border-slate-300 px-4 py-2.5 text-center text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                        >
                          View trip
                        </Link>

                        {isPending && (
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancelingId === booking.id}
                            className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {cancelingId === booking.id ? "Cancelling..." : "Cancel pending booking"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookingsPage;
