import React, { useEffect, useMemo, useState } from "react";
import HeroSection from "../components/HeroSection";
import TripCard from "../components/TripCard";
import HomeFilters from "../components/home/HomeFilters";
import HomePagination from "../components/home/HomePagination";
import HomeResultsToolbar from "../components/home/HomeResultsToolbar";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

const TRIP_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
const CATEGORY_OPTIONS = ["Coastal Escapes", "Mountain Hiking", "City Culture"];
const SORT_OPTIONS = {
  popular: "Most Popular",
  priceAsc: "Price: Low to High",
  priceDesc: "Price: High to Low",
  soonest: "Departure: Soonest",
};
const PAGE_SIZE = 6;
const getTripCategory = (trip) => {
  const text = `${trip.title} ${trip.description}`.toLowerCase();
  if (
    text.includes("coast") ||
    text.includes("island") ||
    text.includes("beach") ||
    text.includes("sea") ||
    text.includes("santorini") ||
    text.includes("amalfi") ||
    text.includes("maldives")
  ) {
    return "Coastal Escapes";
  }
  if (
    text.includes("hiking") ||
    text.includes("alps") ||
    text.includes("glacier") ||
    text.includes("mountain") ||
    text.includes("patagonia") ||
    text.includes("banff")
  ) {
    return "Mountain Hiking";
  }
  return "City Culture";
};

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(["Coastal Escapes", "City Culture"]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilterActive, setCategoryFilterActive] = useState(false);

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

  const monthOptions = useMemo(() => {
    const uniqueMonths = new Map();

    trips.forEach((trip) => {
      const tripDate = new Date(trip.date);
      if (Number.isNaN(tripDate.getTime())) return;
      const key = `${tripDate.getFullYear()}-${tripDate.getMonth()}`;
      if (!uniqueMonths.has(key)) {
        uniqueMonths.set(key, {
          key,
          year: tripDate.getFullYear(),
          month: tripDate.getMonth(),
          label: tripDate.toLocaleString("en-US", { month: "long", year: "numeric" }),
        });
      }
    });

    return Array.from(uniqueMonths.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [trips]);

  useEffect(() => {
    if (monthOptions.length === 0) return;
    setSelectedMonthIndex((current) => Math.min(current, monthOptions.length - 1));
  }, [monthOptions]);

  const priceBounds = useMemo(() => {
    if (trips.length === 0) {
      return { min: 0, max: 3000 };
    }

    const prices = trips.map((trip) => Number(trip.price)).filter((value) => !Number.isNaN(value));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [trips]);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 3000 });

  useEffect(() => {
    setPriceRange(priceBounds);
  }, [priceBounds]);

  const selectedMonth = selectedMonthIndex === null ? null : monthOptions[selectedMonthIndex] ?? null;
  const calendarMonth = selectedMonth ?? monthOptions[0] ?? null;

  const calendarDays = useMemo(() => {
    if (!calendarMonth) {
      return [];
    }

    const firstDay = new Date(calendarMonth.year, calendarMonth.month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
    const previousMonthDays = new Date(calendarMonth.year, calendarMonth.month, 0).getDate();

    const leadingDays = Array.from({ length: startWeekday }, (_, idx) => ({
      value: previousMonthDays - startWeekday + idx + 1,
      inCurrentMonth: false,
    }));

    const currentMonthDays = Array.from({ length: daysInMonth }, (_, idx) => ({
      value: idx + 1,
      inCurrentMonth: true,
    }));

    const trailingCount = Math.max(0, 7 - ((leadingDays.length + currentMonthDays.length) % 7 || 7));
    const trailingDays = Array.from({ length: trailingCount }, (_, idx) => ({
      value: idx + 1,
      inCurrentMonth: false,
    }));

    return [...leadingDays, ...currentMonthDays, ...trailingDays].slice(0, 35);
  }, [calendarMonth]);

  const filteredTrips = useMemo(() => {
    const nextTrips = trips
      .filter((trip) => {
        const price = Number(trip.price);
        const tripCategory = getTripCategory(trip);
        const tripDate = new Date(trip.date);

        const matchesCategory =
          !categoryFilterActive ||
          selectedCategories.length === 0 ||
          selectedCategories.includes(tripCategory);
        const matchesPrice = price >= priceRange.min && price <= priceRange.max;
        const matchesMonth =
          !selectedMonth ||
          (tripDate.getFullYear() === selectedMonth.year &&
            tripDate.getMonth() === selectedMonth.month);

        return matchesCategory && matchesPrice && matchesMonth;
      })
      .sort((a, b) => {
        if (sortBy === "priceAsc") return Number(a.price) - Number(b.price);
        if (sortBy === "priceDesc") return Number(b.price) - Number(a.price);
        if (sortBy === "soonest") return new Date(a.date).getTime() - new Date(b.date).getTime();
        return Number(b.remaining_places) - Number(a.remaining_places);
      });

    return nextTrips;
  }, [priceRange.max, priceRange.min, selectedCategories, selectedMonth, sortBy, trips]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedMonthIndex, priceRange.min, priceRange.max, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / PAGE_SIZE));
  const visibleTrips = filteredTrips.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleCategory = (category) => {
    setCategoryFilterActive(true);
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories(["Coastal Escapes", "City Culture"]);
    setSelectedMonthIndex(null);
    setCategoryFilterActive(false);
    setPriceRange(priceBounds);
    setSortBy("popular");
    setCurrentPage(1);
  };

  const handleMinPriceChange = (value) => {
    const nextMin = Math.min(Number(value), priceRange.max);
    setPriceRange((current) => ({ ...current, min: nextMin }));
  };

  const handleMaxPriceChange = (value) => {
    const nextMax = Math.max(Number(value), priceRange.min);
    setPriceRange((current) => ({ ...current, max: nextMax }));
  };

  const selectPreviousMonth = () => {
    if (monthOptions.length === 0) return;
    setSelectedMonthIndex((current) => {
      if (current === null) return 0;
      return Math.max(0, current - 1);
    });
  };

  const selectNextMonth = () => {
    if (monthOptions.length === 0) return;
    setSelectedMonthIndex((current) => {
      if (current === null) return 0;
      return Math.min(monthOptions.length - 1, current + 1);
    });
  };

  return (
    <div className="flex-1 bg-[#f8fafc] text-slate-900">
      <HeroSection />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
        <HomeResultsToolbar
          filteredTripsCount={filteredTrips.length}
          sortBy={sortBy}
          setSortBy={setSortBy}
          SORT_OPTIONS={SORT_OPTIONS}
        />

        {isLoading && (
          <p className="py-12 text-center text-lg text-slate-600">
            Loading amazing trips...
          </p>
        )}

        {error && (
          <p className="py-12 text-center text-lg font-medium text-red-600">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
            <HomeFilters
              CATEGORY_OPTIONS={CATEGORY_OPTIONS}
              calendarDays={calendarDays}
              calendarMonth={calendarMonth}
              clearFilters={clearFilters}
              handleMaxPriceChange={handleMaxPriceChange}
              handleMinPriceChange={handleMinPriceChange}
              monthOptions={monthOptions}
              priceBounds={priceBounds}
              priceRange={priceRange}
              selectNextMonth={selectNextMonth}
              selectPreviousMonth={selectPreviousMonth}
              selectedCategories={selectedCategories}
              selectedMonth={selectedMonth}
              selectedMonthIndex={selectedMonthIndex}
              toggleCategory={toggleCategory}
            />

            <section>
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
                {visibleTrips.map((trip, index) => (
                  <TripCard
                    key={trip.id}
                    id={trip.id}
                    title={trip.title}
                    price={Number(trip.price)}
                    image={trip.image ?? TRIP_PLACEHOLDER_IMAGE}
                    remaining_places={trip.remaining_places}
                    isAdmin={isAdmin}
                    index={(currentPage - 1) * PAGE_SIZE + index}
                  />
                ))}
              </div>

              {visibleTrips.length === 0 && (
                <div className="rounded-[22px] border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-sm">
                  No trips match the current filters.
                </div>
              )}

              <HomePagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
