import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TripCard from './components/TripCard';
import Footer from './components/Footer';

// These are our temporary (dummy) data until we connect the FastAPI backend
const dummyTrips = [
  {
    id: 1,
    title: "Romantic Paris Getaway",
    price: 1200,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    remaining_places: 5,
  },
  {
    id: 2,
    title: "Maldives Beach Escape",
    price: 2499,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    remaining_places: 2,
  },
  {
    id: 3,
    title: "Historical Rome Tour",
    price: 850,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    remaining_places: 0, // Intentionally 0 to test the "Sold Out" state
  },
  {
    id: 4,
    title: "Tokyo Neon Nights",
    price: 1800,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    remaining_places: 12,
  }
];

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pt-[72px]">
      <Navbar />
      
      {/* Main page content that grows to fill empty space */}
      <div className="flex-1">
        <HeroSection />
        
        <main className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Top Trips in Catalog
          </h2>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dummyTrips.map((trip) => (
              <TripCard 
                key={trip.id}
                title={trip.title}
                price={trip.price}
                image={trip.image}
                remaining_places={trip.remaining_places}
              />
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default App