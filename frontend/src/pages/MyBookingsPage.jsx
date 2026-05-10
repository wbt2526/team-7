import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

const TRIP_PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [tripsMap, setTripsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getStoredUser();
        if (!user?.token) {
          setError("Please log in to view your bookings.");
          setIsLoading(false);
          return;
        }

        const bookingsData = await apiRequest("/bookings/me", { token: user.token });
        setBookings(bookingsData);

        const uniqueTripIds = [...new Set(bookingsData.map((booking) => booking.trip_id))];
        const tripDetails = {};
        const allTrips = await apiRequest("/trips/");

        uniqueTripIds.forEach((id) => {
          const foundTrip = allTrips.find((trip) => trip.id === id);
          if (foundTrip) tripDetails[id] = foundTrip;
        });

        setTripsMap(tripDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const user = getStoredUser();
    if (!user?.token) {
      setError("Please log in to cancel a booking.");
      return;
    }

    setError(null);
    setMessage(null);
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

  if (isLoading) return <div className="py-20 text-center">Loading your adventures...</div>;

  return (
    <section className="min-h-[calc(100vh-72px)] bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">My Bookings</h1>

        {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}
        {message && <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">{message}</div>}

        {bookings.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <p className="text-xl text-gray-600">You haven't booked any adventures yet.</p>
            <Link to="/" className="mt-4 inline-block font-bold text-blue-600">Start exploring trips {"->"}</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const trip = tripsMap[booking.trip_id];
              const isPending = booking.booking_status === "pending";
              const isCancelled = booking.booking_status === "cancelled";

              return (
                <div
                  key={booking.id}
                  className={`flex flex-col overflow-hidden rounded-xl bg-white shadow-sm md:flex-row ${
                    isCancelled ? "opacity-75" : ""
                  }`}
                >
                  <div className="h-48 w-full md:w-64">
                    <img 
                      src={trip?.image || TRIP_PLACEHOLDER_IMAGE} 
                      alt={trip?.title || `Trip ${booking.trip_id}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-bold text-gray-900">
                          {trip?.title || `Trip #${booking.trip_id}`}
                        </h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusColor(booking.booking_status)}`}>
                          {booking.booking_status}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-600">
                        {booking.adults} Adults, {booking.children} Children
                      </p>
                      <p className="text-sm text-gray-500">Booked on: {new Date(booking.created_at).toLocaleDateString()}</p>

                      {isPending && (
                        <p className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                          Payment is still pending. You can retry checkout or cancel this booking.
                        </p>
                      )}

                      {isCancelled && (
                        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                          This pending booking was cancelled and no seats were reserved.
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-lg font-bold text-blue-600">
                        ${Number(booking.total_price).toLocaleString()}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {isPending && (
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancelingId === booking.id}
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {cancelingId === booking.id ? "Cancelling..." : "Cancel pending"}
                          </button>
                        )}
                        <Link
                          to={`/trip/${booking.trip_id}`}
                          className="text-sm font-semibold text-gray-600 hover:text-blue-600"
                        >
                          View Details {"->"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookingsPage;
