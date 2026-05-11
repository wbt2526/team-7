import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AddTripPage from "./pages/AddTripPage";
import EditTripPage from "./pages/EditTripPage";
import DestinationsPage from "./pages/DestinationsPage";
import ToursPage from "./pages/ToursPage";
import DealsPage from "./pages/DealsPage";
import AboutPage from "./pages/AboutPage";

function App() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-slate-50 pt-16">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/trip/:id" element={<TripDetailsPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          <Route path="/admin" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/" replace />} />
          <Route path="/add-trip" element={user?.role === "admin" ? <AddTripPage /> : <Navigate to="/" replace />} />
          <Route path="/edit-trip/:id" element={user?.role === "admin" ? <EditTripPage /> : <Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
