import React from "react";
// 1. We import useNavigate instead of Link for programmatic navigation
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the navigation hook
  const { adults = 1, children = 0, totalPrice = 1200 } = location.state || {};

  // 2. This function runs ONLY when the user fills out all required inputs
  const handlePayment = (e) => {
    e.preventDefault(); // Stop the form from refreshing the page
    
    // Programmatically navigate to bookings page and pass the state
    navigate("/bookings", {
      state: {
        newBooking: {
          adults,
          children,
          totalPrice
        }
      }
    });
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-gray-50">
      {/* 3. Wrap everything in a <form> tag and attach the onSubmit handler */}
      <form onSubmit={handlePayment} className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            Complete Your Booking
          </h1>

          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Lead Passenger Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
                {/* Add 'required' attribute to force user input */}
                <input id="firstName" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
                <input id="lastName" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input id="email" type="email" required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                <input id="phone" type="tel" required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Payment Details
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="cardholderName" className="mb-1 block text-sm font-medium text-gray-700">Cardholder Name</label>
                <input id="cardholderName" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium text-gray-700">Card Number</label>
                <input id="cardNumber" type="text" required minLength="16" maxLength="16" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="expiryDate" className="mb-1 block text-sm font-medium text-gray-700">Expiry Date (MM/YY)</label>
                <input id="expiryDate" type="text" required placeholder="MM/YY" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="cvv" className="mb-1 block text-sm font-medium text-gray-700">CVV</label>
                <input id="cvv" type="password" required minLength="3" maxLength="4" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
            <h2 className="mb-4 border-b pb-4 text-xl font-bold text-gray-900">
              Booking Summary
            </h2>

            <div className="space-y-2 text-gray-700">
              <p className="font-semibold text-gray-900">Romantic Paris Getaway</p>
              <p>{adults} {adults === 1 ? 'Adult' : 'Adults'}, {children} {children === 1 ? 'Child' : 'Children'}</p>
              <p>Date: Oct 15 - Oct 22, 2026</p>
            </div>

            <div className="mt-6 space-y-2 border-t pt-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-gray-900">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taxes:</span>
                <span className="font-medium text-gray-900">Included</span>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-3xl font-bold text-gray-900">${totalPrice.toLocaleString()}</p>
            </div>

            {/* 4. Change the Link tag BACK to a standard submit button */}
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Confirm &amp; Pay
            </button>
          </div>
        </aside>
      </form>
    </section>
  );
};

export default CheckoutPage;