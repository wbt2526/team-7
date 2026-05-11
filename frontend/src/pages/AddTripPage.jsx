import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getStoredUser } from "../lib/auth";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const statusOptions = ["available", "cancelled", "reported"];

function validateTripForm(formData) {
  if (!formData.title.trim()) return "Trip title is required.";
  if (!formData.description.trim()) return "Description is required.";
  const location = formData.location.trim();
  if (!location) return "Location is required.";
  if (location.length < 2 || location.length > 120) return "Location must be between 2 and 120 characters.";
  if (!formData.date) return "Start date is required.";
  if (Number(formData.price) < 0) return "Adult price must be 0 or greater.";
  if (Number(formData.child_price) < 0) return "Child price must be 0 or greater.";
  if (Number(formData.duration) < 1) return "Duration must be at least 1 day.";
  if (Number(formData.total_places) < 0) return "Total places must be 0 or greater.";
  if (!statusOptions.includes(formData.status)) return "Status must be available, cancelled, or reported.";
  return "";
}

const AddTripPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
    price: "",
    child_price: "",
    date: "",
    duration: "",
    total_places: "",
    status: "available",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateTripForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const user = getStoredUser();
      if (!user?.token || user.role !== "admin") throw new Error("You must be logged in as admin.");

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        image: formData.image.trim(),
        price: Number(formData.price),
        child_price: Number(formData.child_price),
        duration: Number.parseInt(formData.duration, 10),
        total_places: Number.parseInt(formData.total_places, 10),
        status: formData.status,
        date: formData.date,
      };

      await apiRequest("/trips/", {
        method: "POST",
        token: user.token,
        body: JSON.stringify(payload),
      });

      setSuccess("Trip created successfully. Returning to the admin dashboard...");
      window.setTimeout(() => navigate("/admin"), 700);
    } catch (err) {
      setError(err.message || "Trip could not be created.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Admin trip editor</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Add Trip</h1>
            <p className="mt-2 text-slate-600">Create a catalog trip using only fields stored by the backend.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            Back to admin
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Trip title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g., Paris spring escape"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Description</label>
              <textarea
                name="description"
                required
                rows="6"
                value={formData.description}
                onChange={handleChange}
                className={inputClass}
                placeholder="Describe the itinerary, experience, and what travelers should expect."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Location</label>
              <input
                type="text"
                name="location"
                required
                minLength="2"
                maxLength="120"
                value={formData.location}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g., Paris, France"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Image URL</label>
              <input
                type="url"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Start date</label>
                <input type="date" name="date" required value={formData.date} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Duration (days)</label>
                <input type="number" name="duration" required min="1" value={formData.duration} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Adult price</label>
                <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Child price</label>
                <input type="number" name="child_price" required min="0" step="0.01" value={formData.child_price} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Total places</label>
                <input type="number" name="total_places" required min="0" value={formData.total_places} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Review</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Remaining places are initialized from total places when the backend creates a trip.
            </p>

            {formData.image && (
              <img
                src={formData.image}
                alt="Trip preview"
                className="mt-5 h-44 w-full rounded-xl object-cover"
              />
            )}

            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Location</span>
                <span className="font-bold text-slate-950">{formData.location || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-bold capitalize text-slate-950">{formData.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Total places</span>
                <span className="font-bold text-slate-950">{formData.total_places || 0}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="mt-6 w-full rounded-xl bg-slate-950 py-3.5 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create trip"}
            </button>
          </aside>
        </form>
      </div>
    </section>
  );
};

export default AddTripPage;
