import React from "react";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const HomeFilters = ({
  CATEGORY_OPTIONS,
  calendarDays,
  calendarMonth,
  clearFilters,
  handleMaxPriceChange,
  handleMinPriceChange,
  monthOptions,
  priceBounds,
  priceRange,
  selectNextMonth,
  selectPreviousMonth,
  selectedCategories,
  selectedMonth,
  selectedMonthIndex,
  toggleCategory,
}) => {
  return (
    <aside className="self-start rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-24">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Filters</h2>
        <button onClick={clearFilters} className="text-sm font-semibold text-blue-600">
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
        <section className="rounded-[20px] border border-slate-100 bg-slate-50/60 p-4 sm:p-5">
          <h3 className="text-sm font-bold uppercase tracking-[0.28em] text-slate-400">
            Select Month
          </h3>
          <div className="mt-4 rounded-[22px] border border-slate-200 bg-white p-3 sm:p-4">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
              <button
                onClick={selectPreviousMonth}
                disabled={monthOptions.length === 0 || selectedMonthIndex === 0}
                className="disabled:text-slate-300"
              >
                ‹
              </button>
              <span>{calendarMonth?.label ?? "No available trips"}</span>
              <button
                onClick={selectNextMonth}
                disabled={
                  monthOptions.length === 0 || selectedMonthIndex >= monthOptions.length - 1
                }
                className="disabled:text-slate-300"
              >
                ›
              </button>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400 sm:gap-2 sm:text-xs">
              {WEEKDAY_LABELS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs sm:gap-2 sm:text-sm">
              {calendarDays.map((day, idx) => (
                <span
                  key={`${day.value}-${idx}`}
                  className={`rounded-full py-2 sm:py-2.5 ${
                    day.inCurrentMonth && idx % 7 >= 4 && idx % 7 <= 6
                      ? "bg-blue-600 font-bold text-white"
                      : day.inCurrentMonth
                        ? "text-slate-700"
                        : "text-slate-300"
                  }`}
                >
                  {day.value}
                </span>
              ))}
            </div>
            <p className="mt-4 text-center text-xs font-medium text-blue-600">
              {selectedMonth
                ? `Selected month: ${selectedMonth.label}`
                : "Selected: All available dates"}
            </p>
          </div>
        </section>

        <section className="rounded-[20px] border border-slate-100 bg-slate-50/60 p-4 sm:p-5">
          <h3 className="text-sm font-bold uppercase tracking-[0.28em] text-slate-400">
            Price Range
          </h3>
          <div className="mt-4">
            <div className="relative h-2 rounded-full bg-slate-200">
              <div
                className="absolute h-2 rounded-full bg-blue-600"
                style={{
                  left: `${((priceRange.min - priceBounds.min) / Math.max(1, priceBounds.max - priceBounds.min)) * 100}%`,
                  right: `${100 - ((priceRange.max - priceBounds.min) / Math.max(1, priceBounds.max - priceBounds.min)) * 100}%`,
                }}
              />
            </div>
            <div className="mt-4 space-y-3">
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={priceRange.min}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                className="w-full accent-blue-600"
              />
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={priceRange.max}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="w-full accent-blue-600"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Min</p>
                <p className="font-bold text-slate-900">${priceRange.min.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">Max</p>
                <p className="font-bold text-slate-900">${priceRange.max.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[20px] border border-slate-100 bg-slate-50/60 p-4 sm:col-span-2 sm:p-5 lg:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-[0.28em] text-slate-400">
            Trip Category
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-1">
            {CATEGORY_OPTIONS.map((category) => (
              <label key={category} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default HomeFilters;
