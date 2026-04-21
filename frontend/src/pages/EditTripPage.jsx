import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditTripPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const templateText = "Experience the magic of this destination with a thoughtfully curated getaway. Our journey includes iconic landmarks, hidden local culture, and professional guidance. Perfect for those seeking an authentic and unforgettable travel experience.";

  // Inicijalizujemo polja praznim stringovima da izbegnemo "controlled/uncontrolled" grešku
  const [formData, setFormData] = useState({
    title: "", 
    description: "", 
    image: "", 
    price: "", 
    date: "", 
    duration: "", 
    total_places: ""
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/trips/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Trip not found");
        return res.json();
      })
      .then(data => {
        const formattedDate = data.date ? data.date.split('T')[0] : "";
        // Koristimo || "" da osiguramo da nijedno polje ne ostane undefined
        setFormData({
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          price: data.price || "",
          date: formattedDate,
          duration: data.duration || "",
          total_places: data.total_places || ""
        });
      })
      .catch(err => console.error("Error loading trip:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadTemplate = () => {
    setFormData({ ...formData, description: templateText });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userStr = localStorage.getItem("user");
      const adminId = JSON.parse(userStr).user_id;

      const response = await fetch(`http://127.0.0.1:8000/trips/${id}?user_id=${adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          total_places: parseInt(formData.total_places),
        }),
      });

      if (response.ok) {
        alert("Trip updated! 🚀");
        navigate("/"); 
      }
    } catch (err) {
      alert("Error saving changes. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-8 pt-[100px]">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Edit Adventure</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" name="title" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.title} onChange={handleChange} required />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <button type="button" onClick={loadTemplate} className="text-xs text-blue-600 hover:underline font-bold">
              + Use Professional Template
            </button>
          </div>
          <textarea name="description" className="w-full border border-gray-300 p-2 rounded-lg" rows="5" value={formData.description} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="url" name="image" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.image} onChange={handleChange} required placeholder="Paste direct image link here..." />
          {formData.image && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <img src={formData.image} className="h-24 w-40 object-cover rounded-lg border" alt="Preview" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" name="price" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.price} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
            <input type="number" name="duration" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.duration} onChange={handleChange} required />
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg mt-4">
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditTripPage;