import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // NOVO: Stanja za čuvanje broja putnika
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/trips/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTrip(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading details...</div>;
  if (!trip) return <div className="py-20 text-center">Trip not found.</div>;

  // Funkcija koja se poziva na klik dugmeta
  const handleBooking = () => {
    navigate("/checkout", { 
      state: { 
        trip, 
        adults: parseInt(adults), 
        children: parseInt(children) 
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
            <span className="text-gray-500"> / person</span>
          </div>

          {/* SEKCIJA ZA BIRANJE PUTNIKA */}
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
                onChange={(e) => setAdults(e.target.value)}
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
                max={trip.remaining_places - adults}
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <p className="mb-6 text-sm font-medium text-green-600">
            ✅ {trip.remaining_places} seats available
          </p>

          <button 
            onClick={handleBooking}
            className="w-full rounded-lg bg-blue-600 py-4 font-bold text-white hover:bg-blue-700 transition shadow-md"
          >
            Book This Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;