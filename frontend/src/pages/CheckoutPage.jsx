import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

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
      <section className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">No trip selected</h1>
          <p className="mt-3 text-slate-600">Please choose a trip before starting checkout.</p>
          <button
            type="button"
            onClick={() => navigate("/tours")}
            className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Browse trips
          </button>
        </div>
      </section>
    );
  }

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
    <section className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-12">
      <form onSubmit={handlePayment} className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Secure academic checkout</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Complete Your Booking</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Confirm passenger details and complete the simulated payment. No real payment will be processed.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-black text-slate-950">Lead Passenger Information</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <input type="text" placeholder="First name" required className={inputClass} />
              <input type="text" placeholder="Last name" required className={inputClass} />
              <input type="email" placeholder="Email" required className={inputClass} />
              <input type="tel" placeholder="Phone" required className={inputClass} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">Payment Details</h2>
                <p className="mt-1 text-sm text-slate-500">Payment is simulated for this academic demo.</p>
              </div>
              {pendingBookingId && (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  Pending booking #{pendingBookingId}
                </span>
              )}
            </div>

            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              Use non-real card details only. The app stores only the last four digits for the simulated payment record.
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Cardholder name"
                  required
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Card number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
                required
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Security code"
                inputMode="numeric"
                autoComplete="cc-csc"
                required
                value={cvv}
                onChange={(e) => setCvv(formatCvv(e.target.value))}
                className={inputClass}
              />
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {notice && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {notice}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                {success}
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <h2 className="border-b border-slate-100 pb-4 text-xl font-black text-slate-950">Booking Summary</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p className="text-lg font-black text-slate-950">{trip.title}</p>
              <div className="flex justify-between">
                <span>Passengers</span>
                <span className="font-bold text-slate-950">{adults} adults, {children} children</span>
              </div>
              <div className="flex justify-between">
                <span>Adult price</span>
                <span className="font-bold text-slate-950">${Number(trip.price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Child price</span>
                <span className="font-bold text-slate-950">${Number(trip.child_price).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Total price</p>
              <p className="mt-1 text-4xl font-black text-slate-950">${calculatedTotalPrice.toFixed(2)}</p>
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className={`mt-8 w-full rounded-xl py-4 font-bold text-white transition ${
                loading || success ? "cursor-not-allowed bg-slate-300" : "bg-slate-950 hover:bg-slate-800"
              }`}
            >
              {loading ? "Processing..." : pendingBookingId ? "Retry payment" : "Confirm and pay"}
            </button>
          </div>
        </aside>
      </form>
    </section>
  );
};

export default CheckoutPage;
