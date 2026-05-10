import React, { useEffect, useMemo, useState } from "react";
import TripCard from "../components/TripCard";
import HomeFilters from "../components/home/HomeFilters";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

function matchesSearch(trip, search) {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  return `${trip.title} ${trip.description}`.toLowerCase().includes(query);
}

function sortTrips(trips, sortBy) {
  return [...trips].sort((a, b) => {
    if (sortBy === "priceAsc") return Number(a.price) - Number(b.price);
    if (sortBy === "priceDesc") return Number(b.price) - Number(a.price);
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

const ToursPage = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dateAsc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getStoredUser();

  useEffect(() => {
    apiRequest("/trips/")
      .then(setTrips)
      .catch(() => setError("Failed to load tours."))
      .finally(() => setLoading(false));
  }, []);

  const filteredTrips = useMemo(() => {
    const filtered = trips.filter((trip) => {
      const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
      return matchesStatus && matchesSearch(trip, search);
    });
    return sortTrips(filtered, sortBy);
  }, [search, sortBy, statusFilter, trips]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSortBy("dateAsc");
  };

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Trip catalog</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">All tours</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Browse every trip stored in the backend. Search, filter by real status, and compare actual prices and dates.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Results</p>
            <p className="mt-1 text-3xl font-black text-slate-950">{filteredTrips.length}</p>
          </div>
        </div>
      </header>

      <HomeFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        clearFilters={clearFilters}
      />

      {loading && <div className="rounded-2xl bg-white px-6 py-14 text-center text-slate-500">Loading tours...</div>}
      {error && <div className="rounded-2xl bg-red-50 px-6 py-8 text-center text-red-700">{error}</div>}

      {!loading && !error && (
        filteredTrips.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} isAdmin={user?.role === "admin"} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-500">
            No tours match the current filters.
          </div>
        )
      )}
    </section>
  );
};

export default ToursPage;
