import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

const AddTripPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "Experience the magic of this destination with a thoughtfully curated getaway. Our journey includes iconic landmarks, hidden local culture, and professional guidance. Perfect for those seeking an authentic and unforgettable travel experience.",
    image: "",
    price: "",
    child_price: "",
    date: "",
    duration: "",
    total_places: "",
    status: "available",
  });

  // Univerzalna funkcija za ažuriranje bilo kog polja u formi
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = getStoredUser();
      if (!user?.token || user.role !== "admin") throw new Error("You must be logged in as admin.");

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        child_price: parseFloat(formData.child_price),
        duration: parseInt(formData.duration),
        total_places: parseInt(formData.total_places),
      };

      await apiRequest("/trips/", {
        method: "POST",
        token: user.token,
        body: JSON.stringify(payload),
      });

      alert("Trip created successfully! 🚀");
      navigate("/admin");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Add New Adventure</h1>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Naslov i Opis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trip Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., Tokyo Cherry Blossom Tour" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" required rows="4" value={formData.description} onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500" placeholder="Describe the adventure..." />
            </div>

            {/* URL Slike */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Unsplash link recommended)</label>
              <input type="url" name="image" required value={formData.image} onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500" placeholder="https://images.unsplash.com/..." />
            </div>

            {/* Grid za brojeve i datume (2 kolone) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per person ($)</label>
                <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500" placeholder="999.99" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Child price ($)</label>
                <input type="number" name="child_price" required min="0" step="0.01" value={formData.child_price} onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500" placeholder="499.99" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" name="date" required value={formData.date} onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                <input type="number" name="duration" required min="1" value={formData.duration} onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., 7" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats Available</label>
                <input type="number" name="total_places" required min="1" value={formData.total_places} onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., 20" />
              </div>
            </div>

            {/* Dugme za slanje */}
            <div className="pt-4">
              <button type="submit" disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 transition disabled:bg-gray-400">
                {loading ? "Creating Trip..." : "Create Adventure ✨"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddTripPage;
