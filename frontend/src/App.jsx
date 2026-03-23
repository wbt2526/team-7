import AuthPage from './pages/AuthPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TripDetailsPage from './pages/TripDetailsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-gray-50 pt-[72px]">
        {/* Navbar is outside Routes, so it shows on EVERY page */}
        <Navbar />
        
        {/* Routes act as a placeholder. The content changes based on the URL */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/trip/:id" element={<TripDetailsPage />} />
        </Routes>

        {/* Footer is also outside Routes, so it stays at the bottom of EVERY page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;