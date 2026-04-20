import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TRIP_PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [tripsMap, setTripsMap] = useState({}); // Čuva podatke o putovanjima (ID -> Podaci)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          setError("Please log in to view your bookings.");
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user.user_id;

        // 1. Dohvati sve rezervacije za ulogovanog korisnika
        const bResponse = await fetch(`http://127.0.0.1:8000/bookings/?user_id=${userId}`);
        if (!bResponse.ok) throw new Error("Failed to load bookings.");
        const bookingsData = await bResponse.json();
        setBookings(bookingsData);

        // 2. Za svaku rezervaciju, dohvatiti detalje putovanja (naslov, slika...)
        const uniqueTripIds = [...new Set(bookingsData.map(b => b.trip_id))];
        const tripDetails = {};

        await Promise.all(uniqueTripIds.map(async (id) => {
          try {
            const tResponse = await fetch(`http://127.0.0.1:8000/trips/`); // Uzimamo sva putovanja da nađemo pravo
            const allTrips = await tResponse.json();
            const foundTrip = allTrips.find(t => t.id === id);
            if (foundTrip) tripDetails[id] = foundTrip;
          } catch (e) {
            console.error("Could not fetch details for trip", id);
          }
        }));

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
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) return <div className="py-20 text-center">Loading your adventures...</div>;

  return (
    <section className="min-h-[calc(100vh-72px)] bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">My Bookings</h1>

        {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

        {bookings.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <p className="text-xl text-gray-600">You haven't booked any adventures yet.</p>
            <Link to="/" className="mt-4 inline-block text-blue-600 font-bold">Start exploring trips →</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const trip = tripsMap[booking.trip_id];
              return (
                <div key={booking.id} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm md:flex-row">
                  <div className="h-48 w-full md:w-64">
                    <img 
                      src={trip?.image || TRIP_PLACEHOLDER_IMAGE} 
                      alt={trip?.title} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-start justify-between">
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
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                      <p className="text-lg font-bold text-blue-600">
                        ${Number(booking.total_price).toLocaleString()}
                      </p>
                      <Link 
                        to={`/trip/${booking.trip_id}`} 
                        className="text-sm font-semibold text-gray-600 hover:text-blue-600"
                      >
                        View Details →
                      </Link>
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