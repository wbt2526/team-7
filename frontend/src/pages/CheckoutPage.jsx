import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. ISPRAVKA: Izvlačimo trip objekat, adults i children
  // location.state dobijamo iz TripDetailsPage (handleBooking funkcija)
  const { trip, adults = 1, children = 0 } = location.state || {};

  // Ako neko slučajno dođe na /checkout bez state-a, vraćamo ga na home
  if (!trip) {
    return (
      <div className="py-20 text-center">
        <p>No trip data found. Please select a trip first.</p>
        <button onClick={() => navigate("/")} className="text-blue-600 underline">Go back</button>
      </div>
    );
  }

  // 2. ISPRAVKA: Računamo cenu ovde da ne bi bila $0
  const totalPassengers = Number(adults) + Number(children);
  const calculatedTotalPrice = totalPassengers * Number(trip.price);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please log in to complete your booking.");
      navigate("/auth");
      return;
    }

    const user = JSON.parse(storedUser);
    setLoading(true);

    try {
      // KORAK 1: Kreiramo rezervaciju (Booking)
      const bookingResponse = await fetch(`http://127.0.0.1:8000/bookings/?user_id=${user.user_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: trip.id, // Koristimo trip.id jer smo poslali ceo objekat
          adults: Number(adults),
          children: Number(children)
        }),
      });

      const bookingData = await bookingResponse.json();

      if (!bookingResponse.ok) {
        throw new Error(bookingData.detail || "Booking failed.");
      }

      // KORAK 2: Simuliramo plaćanje (da bi status u bazi postao 'confirmed')
      // Uzimamo poslednje 4 cifre (za simulaciju, u stvarnosti bi išlo preko Stripe-a)
      const paymentResponse = await fetch(`http://127.0.0.1:8000/payments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingData.id,
          card_last4: "4242" // Fiksno za testiranje
        }),
      });

      if (paymentResponse.ok) {
        alert(`Success! Booking confirmed for ${trip.title}.`);
        navigate("/bookings");
      } else {
        alert("Booking created but payment failed. Check your admin panel.");
      }

    } catch (error) {
      alert(error.message || "Server error. Please try again.");
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
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">Lead Passenger Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input type="text" placeholder="First Name" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" />
              <input type="text" placeholder="Last Name" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" />
              <input type="email" placeholder="Email" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" />
              <input type="tel" placeholder="Phone" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>

          {/* Fake Payment Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">Payment Details (Simulation)</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <input type="text" placeholder="Cardholder Name" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="md:col-span-2">
                <input type="text" placeholder="Card Number (16 digits)" minLength="16" maxLength="16" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" />
              </div>
              <input type="text" placeholder="MM/YY" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" />
              <input type="password" placeholder="CVV" minLength="3" maxLength="4" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
            <h2 className="mb-4 border-b pb-4 text-xl font-bold text-gray-900">Booking Summary</h2>
            <div className="space-y-3 text-gray-700">
              <p className="text-lg font-bold text-blue-600">{trip.title}</p>
              <div className="flex justify-between text-sm">
                <span>Passengers:</span>
                <span className="font-semibold">{adults} Adults, {children} Children</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Price per person:</span>
                <span className="font-semibold">${trip.price}</span>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <p className="text-xs uppercase tracking-wider text-gray-400">Total Price</p>
              <p className="text-4xl font-black text-gray-900">${calculatedTotalPrice.toFixed(2)}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-8 w-full rounded-lg py-4 font-bold text-white shadow-md transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed scale-95" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {loading ? "Processing..." : "Confirm & Pay Now"}
            </button>
            <p className="mt-4 text-center text-xs text-gray-400">Secure 256-bit SSL encrypted payment</p>
          </div>
        </aside>
      </form>
    </section>
  );
};

export default CheckoutPage;