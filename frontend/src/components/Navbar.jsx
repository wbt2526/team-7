import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧳</span>
          <Link to="/" className="text-xl font-bold text-blue-600">
            TravelBox
          </Link>
        </div>

        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <Link to="/" className="text-gray-600 transition-colors hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
              Tours
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
              About
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
              Contact
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/bookings"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                My Bookings
              </Link>
              <span className="hidden text-sm text-gray-600 sm:inline">
                Hello, {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-300"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                state={{ defaultIsLogin: true }}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                Log in
              </Link>
              <Link
                to="/auth"
                state={{ defaultIsLogin: false }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
