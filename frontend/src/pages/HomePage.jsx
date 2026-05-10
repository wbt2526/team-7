import React, { useEffect, useMemo, useState } from "react";
import HeroSection from "../components/HeroSection";
import TripCard from "../components/TripCard";
import HomeFilters from "../components/home/HomeFilters";
import HomePagination from "../components/home/HomePagination";
import HomeResultsToolbar from "../components/home/HomeResultsToolbar";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

const PAGE_SIZE = 6;

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

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dateAsc");
  const [currentPage, setCurrentPage] = useState(1);

  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await apiRequest("/trips/");
        setTrips(data);
      } catch {
        setError("Failed to load trips.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    const filtered = trips.filter((trip) => {
      const statusMatches = statusFilter === "all" || trip.status === statusFilter;
      return statusMatches && matchesSearch(trip, search);
    });

    return sortTrips(filtered, sortBy);
  }, [search, sortBy, statusFilter, trips]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / PAGE_SIZE));
  const visibleTrips = filteredTrips.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSortBy("dateAsc");
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 bg-slate-50 text-slate-950">
      <HeroSection search={search} setSearch={setSearch} tripCount={trips.length} />

      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <HomeResultsToolbar filteredTripsCount={filteredTrips.length} totalTripsCount={trips.length} />

        <HomeFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          clearFilters={clearFilters}
        />

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-slate-500">
            Loading trips from the backend...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center font-medium text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {visibleTrips.length > 0 ? (
              <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} isAdmin={isAdmin} />
                ))}
              </section>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <h3 className="text-xl font-black text-slate-950">No trips match your search</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try a different title, description keyword, or status filter.
                </p>
              </div>
            )}

            <HomePagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
