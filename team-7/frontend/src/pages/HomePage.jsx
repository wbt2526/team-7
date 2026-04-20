import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import TripCard from "../components/TripCard";

const TRIP_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Proveravamo da li je ulogovan admin
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/trips/");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setTrips(data);
      } catch {
        setError("Failed to load trips.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="flex-1">
      <HeroSection />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          Top Trips in Catalog
        </h2>

        {isLoading && (
          <p className="py-12 text-center text-lg text-gray-600">
            Loading amazing trips...
          </p>
        )}

        {error && (
          <p className="py-12 text-center text-lg font-medium text-red-600">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                title={trip.title}
                price={Number(trip.price)}
                image={trip.image ?? TRIP_PLACEHOLDER_IMAGE}
                remaining_places={trip.remaining_places}
                // 2. Šaljemo informaciju kartici da li treba da pokaže Edit dugme
                isAdmin={isAdmin} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;