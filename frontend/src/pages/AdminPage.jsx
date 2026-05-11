import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";
import { formatTripDate } from "../lib/tripPresentation";

const bookingStatusStyles = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const tripStatusStyles = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  full: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  reported: "bg-slate-100 text-slate-700 border-slate-200",
};

function StatusBadge({ value, type = "booking" }) {
  const styles = type === "trip" ? tripStatusStyles : bookingStatusStyles;
  const className = styles[value] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${className}`}>
      {value || "unknown"}
    </span>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

const AdminPage = () => {
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [users, setUsers] = useState([]);
  const [tripsMap, setTripsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const user = getStoredUser();
        if (!user?.token || user.role !== "admin") {
          throw new Error("Admin access required.");
        }

        const [bookingsResponse, tripsResponse, usersResponse] = await Promise.all([
          apiRequest("/admin/bookings", { token: user.token }),
          apiRequest("/trips/"),
          apiRequest("/users/", { token: user.token }),
        ]);

        const nextTripsMap = {};
        tripsResponse.forEach((trip) => {
          nextTripsMap[trip.id] = trip.title;
        });

        const nextUsersMap = {};
        usersResponse.forEach((account) => {
          nextUsersMap[account.id] = `${account.first_name} ${account.last_name}`;
        });

        setBookings(bookingsResponse);
        setTrips(tripsResponse);
        setUsers(usersResponse);
        setTripsMap(nextTripsMap);
        setUsersMap(nextUsersMap);
      } catch (err) {
        setError(err.message || "Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-600">Loading admin dashboard...</p>
        </div>
      </section>
    );
  }

  const pendingBookings = bookings.filter((booking) => booking.booking_status === "pending").length;

  return (
    <section className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Admin workspace</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Dashboard</h1>
            <p className="mt-2 text-slate-600">
              Manage real trips, users, and booking records from the current backend.
            </p>
          </div>
          <Link
            to="/add-trip"
            className="rounded-xl bg-slate-950 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Add trip
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total trips" value={trips.length} />
          <SummaryCard label="Total users" value={users.length} />
          <SummaryCard label="Total bookings" value={bookings.length} />
          <SummaryCard label="Pending bookings" value={pendingBookings} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-xl font-black text-slate-950">Bookings</h2>
                <p className="mt-1 text-sm text-slate-500">Booking status is managed by checkout and payment flow.</p>
              </div>

              {bookings.length === 0 ? (
                <div className="p-10 text-center text-slate-500">No bookings found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Passenger</th>
                        <th className="px-6 py-4">Trip</th>
                        <th className="px-6 py-4">Travelers</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="text-sm">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-950">
                              {usersMap[booking.user_id] || `User #${booking.user_id}`}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">Booking #{booking.id}</p>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-700">
                            {tripsMap[booking.trip_id] || `Trip #${booking.trip_id}`}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {booking.adults} adults, {booking.children} children
                          </td>
                          <td className="px-6 py-4 font-black text-blue-600">
                            ${Number(booking.total_price).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge value={booking.booking_status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950">Trips</h2>
                  <p className="mt-1 text-sm text-slate-500">Public catalog records currently stored in the backend.</p>
                </div>
                <Link to="/add-trip" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                  Add trip
                </Link>
              </div>

              {trips.length === 0 ? (
                <div className="p-10 text-center text-slate-500">No trips found.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {trips.map((trip) => (
                    <div key={trip.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-black text-slate-950">{trip.title}</h3>
                          <StatusBadge value={trip.status} type="trip" />
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {formatTripDate(trip.date)} | {trip.remaining_places}/{trip.total_places} seats | ${Number(trip.price).toFixed(2)}
                        </p>
                      </div>
                      <Link
                        to={`/edit-trip/${trip.id}`}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-center text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <section className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-black text-slate-950">Users</h2>
              <p className="mt-1 text-sm text-slate-500">Role values come from the backend.</p>
            </div>

            {users.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No users found.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {users.map((account) => (
                  <div key={account.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-950">
                          {account.first_name} {account.last_name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{account.email}</p>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                        {account.role === 1 ? "admin" : "user"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
