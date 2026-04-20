import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTripPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "Experience the magic of this destination with a thoughtfully curated getaway. Our journey includes iconic landmarks, hidden local culture, and professional guidance. Perfect for those seeking an authentic and unforgettable travel experience.",
    image: "",
    price: "",
    date: "",
    duration: "",
    total_places: "",
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
      // 1. Uzimamo ID trenutnog admina iz memorije (potreban backendu za proveru)
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("You must be logged in as admin.");
      const adminId = JSON.parse(userStr).user_id;

      // 2. Pripremamo podatke (pretvaramo stringove u brojeve gde treba)
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        total_places: parseInt(formData.total_places),
        // Status 'available' backend dodaje automatski
      };

      // 3. Šaljemo POST zahtev. PAŽNJA: user_id šaljemo u URL-u!
      const response = await fetch(`http://127.0.0.1:8000/trips/?user_id=${adminId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to create trip");
      }

      // 4. Uspeh! Obaveštavamo admina i vraćamo ga na Dashboard
      alert("Trip created successfully! 🚀");
      navigate("/admin"); // Vraćamo se na listu rezervacija

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