import React, { useEffect, useMemo, useState } from "react";
import TripCard from "../components/TripCard";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

function buildLocationGroups(trips) {
  const groups = new Map();

  trips.forEach((trip) => {
    const location = trip.location?.trim();
    if (!location) return;

    if (!groups.has(location)) {
      groups.set(location, []);
    }
    groups.get(location).push(trip);
  });

  return [...groups.entries()]
    .map(([location, locationTrips]) => {
      const availableTrips = locationTrips.filter(
        (trip) => trip.status === "available" && Number(trip.remaining_places) > 0
      );
      const availableSeats = availableTrips.reduce(
        (total, trip) => total + Number(trip.remaining_places),
        0
      );
      const lowestPrice = availableTrips.length
        ? Math.min(...availableTrips.map((trip) => Number(trip.price)))
        : null;

      return {
        location,
        trips: locationTrips.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        tripCount: locationTrips.length,
        availableSeats,
        lowestPrice,
      };
    })
    .sort((a, b) => a.location.localeCompare(b.location));
}

const DestinationsPage = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getStoredUser();

  useEffect(() => {
    apiRequest("/trips/")
      .then(setTrips)
      .catch(() => setError("Failed to load destinations."))
      .finally(() => setLoading(false));
  }, []);

  const locationGroups = useMemo(() => buildLocationGroups(trips), [trips]);

  const visibleGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return locationGroups;
    return locationGroups.filter((group) => group.location.toLowerCase().includes(query));
  }, [locationGroups, search]);

  const activeGroup = useMemo(() => {
    if (selectedLocation) {
      return locationGroups.find((group) => group.location === selectedLocation) ?? null;
    }
    return visibleGroups[0] ?? null;
  }, [locationGroups, selectedLocation, visibleGroups]);

  useEffect(() => {
    if (selectedLocation && !locationGroups.some((group) => group.location === selectedLocation)) {
      setSelectedLocation("");
    }
  }, [locationGroups, selectedLocation]);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Destinations</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Explore by real location
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Destinations are grouped from the backend location field stored on each trip.
            </p>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search locations"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </header>

      {loading && (
        <div className="rounded-2xl bg-white px-6 py-14 text-center text-slate-500">
          Loading destinations...
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 px-6 py-8 text-center text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {visibleGroups.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleGroups.map((group) => {
                const isSelected = activeGroup?.location === group.location;
                return (
                  <button
                    key={group.location}
                    type="button"
                    onClick={() => setSelectedLocation(group.location)}
                    className={`rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                      isSelected ? "border-blue-300 ring-4 ring-blue-100" : "border-slate-200"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Location</p>
                    <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                      {group.location}
                    </h2>
                    <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="font-black text-slate-950">{group.tripCount}</p>
                        <p className="mt-1 text-slate-500">trips</p>
                      </div>
                      <div>
                        <p className="font-black text-slate-950">{group.availableSeats}</p>
                        <p className="mt-1 text-slate-500">seats</p>
                      </div>
                      <div>
                        <p className="font-black text-slate-950">
                          {group.lowestPrice === null ? "-" : `$${group.lowestPrice.toFixed(2)}`}
                        </p>
                        <p className="mt-1 text-slate-500">from</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-500">
              {trips.length
                ? "No locations match your search, or some trips still need a location."
                : "No trips are currently listed."}
            </div>
          )}

          {activeGroup && (
            <section className="space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Trips in</p>
                  <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                    {activeGroup.location}
                  </h2>
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {activeGroup.tripCount} {activeGroup.tripCount === 1 ? "trip" : "trips"}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activeGroup.trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} isAdmin={user?.role === "admin"} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </section>
  );
};

export default DestinationsPage;
