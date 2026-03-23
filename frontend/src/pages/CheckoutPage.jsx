import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Izvlačimo podatke koje su nam poslali TripDetails ili Home
  const { 
    tripId, 
    tripTitle = "Trip", 
    adults = 1, 
    children = 0, 
    totalPrice = 0 
  } = location.state || {};

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // 1. Provera da li je korisnik ulogovan
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please log in to complete your booking.");
      navigate("/auth");
      return;
    }

    const user = JSON.parse(storedUser);
    setLoading(true);

    try {
      // 2. Šaljemo zahtev na Backend (FastAPI)
      const response = await fetch(`http://127.0.0.1:8000/bookings/?user_id=${user.user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: tripId, // ID putovanja koji smo vukli kroz state
          adults: Number(adults),
          children: Number(children)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Simulacija uspešnog plaćanja i potvrda
        alert(`Booking successful! Payment processed for ${tripTitle}.`);
        navigate("/bookings"); // Šaljemo korisnika da vidi svoje rezervacije
      } else {
        // Prikazujemo grešku sa bekenda (npr. nema više mesta)
        alert(data.detail || "Booking failed. Please try again.");
      }
    } catch (error) {
      alert("Server error. Please check if your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-gray-50">
      <form onSubmit={handlePayment} className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">Complete Your Booking</h1>

          {/* Passenger Info */}
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">Lead Passenger Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input type="text" placeholder="First Name" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
              <input type="text" placeholder="Last Name" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
              <input type="email" placeholder="Email" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
              <input type="tel" placeholder="Phone" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Fake Payment Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">Payment Details (Simulation)</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <input type="text" placeholder="Cardholder Name" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none" />
              </div>
              <div className="md:col-span-2">
                <input type="text" placeholder="Card Number (16 digits)" minLength="16" maxLength="16" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none" />
              </div>
              <input type="text" placeholder="MM/YY" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none" />
              <input type="password" placeholder="CVV" minLength="3" maxLength="4" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none" />
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
            <h2 className="mb-4 border-b pb-4 text-xl font-bold text-gray-900">Booking Summary</h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold text-gray-900">{tripTitle}</p>
              <p>{adults} Adults, {children} Children</p>
            </div>
            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-3xl font-bold text-gray-900">${totalPrice.toLocaleString()}</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-6 w-full rounded-lg py-3 font-semibold text-white transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
        </aside>
      </form>
    </section>
  );
};

export default CheckoutPage;