import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const user = getStoredUser();

  useEffect(() => {
    apiRequest(`/trips/${id}`)
      .then((data) => {
        setTrip(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading details...</div>;
  if (!trip) return <div className="py-20 text-center">Trip not found.</div>;

  const totalPassengers = Number(adults) + Number(children);
  const totalPrice = (Number(adults) * Number(trip.price)) + (Number(children) * Number(trip.child_price));
  const bookingBlocked = trip.status !== "available" || trip.remaining_places <= 0;

  const handleBooking = () => {
    if (!user) {
      navigate("/auth", { state: { defaultIsLogin: true } });
      return;
    }

    navigate("/checkout", { 
      state: { 
        trip, 
        adults: parseInt(adults, 10), 
        children: parseInt(children, 10) 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero sekcija sa slikom iz BAZE */}
      <div className="relative h-[400px] w-full">
        <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
            {trip.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Leva strana - OPIS IZ BAZE */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Overview</h2>
          <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
            {trip.description}
          </p>
          
          <div className="mt-10 grid grid-cols-2 gap-6 border-t pt-8">
            <div>
              <h4 className="font-bold text-gray-900">Duration</h4>
              <p className="text-gray-600">{trip.duration} Days</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Start Date</h4>
              <p className="text-gray-600">{new Date(trip.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Desna strana - Rezervacija (SA INPUTIMA) */}
        <div className="rounded-xl border p-6 shadow-lg bg-gray-50 h-fit sticky top-24">
          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">${trip.price}</span>
            <span className="text-gray-500"> / adult</span>
            <p className="mt-1 text-sm text-gray-500">Children from ${Number(trip.child_price).toFixed(2)}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Adults
              </label>
              <input
                type="number"
                min="1"
                max={trip.remaining_places}
                value={adults}
                onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Children
              </label>
              <input
                type="number"
                min="0"
                max={Math.max(0, trip.remaining_places - Number(adults))}
                value={children}
                onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div className="mb-6 space-y-2">
            <p className={`text-sm font-medium ${bookingBlocked ? "text-red-600" : "text-green-600"}`}>
              {bookingBlocked ? `Status: ${trip.status}` : `✅ ${trip.remaining_places} seats available`}
            </p>
            <p className="text-sm text-gray-600">
              Total for {totalPassengers} travelers: <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
            </p>
          </div>

          <button 
            onClick={handleBooking}
            disabled={bookingBlocked}
            className="w-full rounded-lg bg-blue-600 py-4 font-bold text-white hover:bg-blue-700 transition shadow-md disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {bookingBlocked ? "Booking Unavailable" : "Book This Trip"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
