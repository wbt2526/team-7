import React, { useState, useEffect } from "react";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

const AdminPage = () => {
  const [bookings, setBookings] = useState([]);
  const [tripsMap, setTripsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const user = getStoredUser();
      if (!user?.token || user.role !== "admin") {
        throw new Error("Admin access required.");
      }

      const [bRes, tRes, uRes] = await Promise.all([
        apiRequest("/admin/bookings", { token: user.token }),
        apiRequest("/trips/"),
        apiRequest("/users/", { token: user.token })
      ]);

      const tMap = {};
      tRes.forEach(trip => tMap[trip.id] = trip.title);
      
      const uMap = {};
      uRes.forEach(user => uMap[user.id] = `${user.first_name} ${user.last_name}`);

      setBookings(bRes);
      setTripsMap(tMap);
      setUsersMap(uMap);
    } catch (err) {
      setError(err.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-medium text-gray-600">Loading Admin Dashboard...</div>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex gap-4">
          <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            Total Bookings: {bookings.length}
          </span>
        </div>
      </div>
      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}
      
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Passenger</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">
                    {usersMap[booking.user_id] || `Unknown (ID: ${booking.user_id})`}
                  </div>
                  <div className="text-xs text-gray-500">ID: #{booking.user_id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">
                    {tripsMap[booking.trip_id] || `Trip #${booking.trip_id}`}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-blue-600">
                  ${Number(booking.total_price).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {booking.booking_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs text-gray-400 italic">Booking status is managed by payment flow</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No bookings found in the system.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
