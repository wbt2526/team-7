import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

function normalizeCardNumber(value) {
  return value.replace(/\s+/g, "");
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCvv(value) {
  return value.replace(/\D/g, "").slice(0, 4);
}

function validatePaymentFields({ cardNumber, expiry, cvv }) {
  const normalizedCard = normalizeCardNumber(cardNumber);

  if (!/^\d+$/.test(normalizedCard)) {
    return "Card number must contain digits only.";
  }

  if (normalizedCard.length < 13 || normalizedCard.length > 19) {
    return "Card number must contain 13 to 19 digits.";
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
    return "Expiry date must be in MM/YY format.";
  }

  const [monthText, yearText] = expiry.split("/");
  const expiryYear = 2000 + Number(yearText);
  const expiryMonth = Number(monthText);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    return "Card expiry date is in the past.";
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    return "Security code must contain 3 or 4 digits.";
  }

  return null;
}

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [pendingBookingId, setPendingBookingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [success, setSuccess] = useState("");

  const { trip, adults = 1, children = 0 } = location.state || {};

  if (!trip) {
    return (
      <div className="py-20 text-center">
        <p>No trip data found. Please select a trip first.</p>
        <button onClick={() => navigate("/")} className="text-blue-600 underline">Go back</button>
      </div>
    );
  }

  const totalPassengers = Number(adults) + Number(children);
  const calculatedTotalPrice =
    Number(adults) * Number(trip.price) + Number(children) * Number(trip.child_price);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setSuccess("");

    const user = getStoredUser();
    if (!user?.token) {
      setError("Your session expired. Please log in again to continue booking.");
      return;
    }

    const validationError = validatePaymentFields({ cardNumber, expiry, cvv });
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    let activeBookingId = pendingBookingId;

    try {
      let bookingId = activeBookingId;

      if (!bookingId) {
        const bookingData = await apiRequest(`/trips/${trip.id}/book`, {
          method: "POST",
          token: user.token,
          body: JSON.stringify({
            adults: Number(adults),
            children: Number(children),
          }),
        });
        bookingId = bookingData.booking_id;
        activeBookingId = bookingId;
        setPendingBookingId(bookingId);
      }

      await apiRequest(`/bookings/${bookingId}/pay`, {
        method: "POST",
        token: user.token,
        body: JSON.stringify({
          card_number: normalizeCardNumber(cardNumber),
          expiry,
          cvv,
          idempotency_key: `booking-${bookingId}-${Date.now()}`,
        }),
      });

      setSuccess(`Payment successful. Booking #${bookingId} is confirmed.`);
      window.setTimeout(() => navigate("/bookings"), 900);
    } catch (paymentError) {
      if (paymentError.status === 401) {
        setError("Your session expired. Please log in again to continue booking.");
        setNotice("");
        return;
      }

      const createdPendingMessage =
        activeBookingId || paymentError.status === 402
          ? "A pending booking is saved. You can retry payment here or cancel it from My Bookings."
          : "";
      setError(paymentError.message || "Server error. Please try again.");
      setNotice(createdPendingMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-gray-50">
      <form onSubmit={handlePayment} className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">Complete Your Booking</h1>

          <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">Lead Passenger Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input type="text" placeholder="First Name" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500" />
              <input type="text" placeholder="Last Name" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500" />
              <input type="email" placeholder="Email" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500" />
              <input type="tel" placeholder="Phone" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
                <p className="mt-1 text-sm text-gray-500">Payment is simulated for this academic demo.</p>
              </div>
              {pendingBookingId && (
                <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                  Pending booking #{pendingBookingId}
                </span>
              )}
            </div>

            <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
              No real payment will be processed. Use non-real card details only.
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <input type="text" placeholder="Cardholder Name" required value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <input type="text" placeholder="Card Number" inputMode="numeric" autoComplete="cc-number" required value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500" />
              </div>
              <input type="text" placeholder="MM/YY" inputMode="numeric" autoComplete="cc-exp" required value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500" />
              <input type="password" placeholder="CVV" inputMode="numeric" autoComplete="cc-csc" required value={cvv} onChange={(e) => setCvv(formatCvv(e.target.value))} className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500" />
            </div>

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {notice && (
              <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                {notice}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                {success}
              </div>
            )}
          </div>
        </div>

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
                <span>Adult price:</span>
                <span className="font-semibold">${trip.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Child price:</span>
                <span className="font-semibold">${trip.child_price}</span>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <p className="text-xs uppercase tracking-wider text-gray-400">Total Price</p>
              <p className="text-4xl font-black text-gray-900">${calculatedTotalPrice.toFixed(2)}</p>
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className={`mt-8 w-full rounded-lg py-4 font-bold text-white shadow-md transition-all ${
                loading || success ? "cursor-not-allowed bg-gray-400 opacity-80" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {loading ? "Processing..." : pendingBookingId ? "Retry Payment" : "Confirm & Pay Now"}
            </button>
            <p className="mt-4 text-center text-xs text-gray-400">Only the last four digits are stored for the simulated payment record.</p>
          </div>
        </aside>
      </form>
    </section>
  );
};

export default CheckoutPage;
