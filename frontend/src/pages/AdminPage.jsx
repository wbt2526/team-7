import React, { useState, useEffect } from "react";

const AdminPage = () => {
  const [bookings, setBookings] = useState([]);
  const [tripsMap, setTripsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // 1. Povlačimo sve rezervacije, putovanja i korisnike istovremeno da spojimo podatke
      const [bRes, tRes, uRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/admin/bookings/"),
        fetch("http://127.0.0.1:8000/trips/"),
        fetch("http://127.0.0.1:8000/users/")
      ]);

      const bData = await bRes.json();
      const tData = await tRes.json();
      const uData = await uRes.json();

      // 2. Pravimo "mape" (rečnike) za brzu pretragu naziva po ID-u
      const tMap = {};
      tData.forEach(trip => tMap[trip.id] = trip.title);
      
      const uMap = {};
      uData.forEach(user => uMap[user.id] = `${user.first_name} ${user.last_name}`);

      setBookings(bData);
      setTripsMap(tMap);
      setUsersMap(uMap);
    } catch (err) {
      console.error("Greška pri učitavanju podataka:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Osvežavamo tabelu odmah nakon promene
        fetchAllData();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Server error.");
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
                <td className="px-6 py-4 text-right space-x-2">
                  {/* Dugme Confirm se pojavljuje SAMO ako je rezervacija na čekanju (Pending) */}
                  {booking.booking_status === 'pending' && (
                    <button 
                      onClick={() => handleStatusChange(booking.id, 'confirmed')}
                      className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 shadow-sm transition"
                    >
                      Confirm
                    </button>
                  )}

                  {/* Dugme Cancel se pojavljuje ako putovanje nije već otkazano */}
                  {booking.booking_status !== 'cancelled' ? (
                    <button 
                      onClick={() => handleStatusChange(booking.id, 'cancelled')}
                      className="rounded-lg bg-white border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                    >
                      Cancel
                    </button>
                  ) : (
                    /* Ako je već Cancelled, ispisujemo samo info */
                    <span className="text-xs text-gray-400 italic">No actions available</span>
                  )}
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