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
    <nav className="fixed top-0 left-0 z-50 w-full bg-white px-6 py-4 shadow-sm border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo sekcija */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🧳</span>
          <Link to="/" className="text-xl font-bold text-blue-600">
            TravelBox
          </Link>
        </div>

        {/* Centralni linkovi (vidljivi na desktopu) */}
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
        </ul>

        {/* Desna strana - User / Admin akcije */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* ADMIN OPCIJE */}
              {user.role === "admin" ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin"
                    className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
                  >
                    🛡️ Admin Panel
                  </Link>
                  <Link
                    to="/add-trip"
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 shadow-sm"
                  >
                    + Add Trip
                  </Link>
                </div>
              ) : (
                /* USER OPCIJE */
                <Link
                  to="/bookings"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  My Bookings
                </Link>
              )}

              {/* Email i Logout */}
              <span className="hidden text-sm text-gray-500 sm:inline border-l pl-3 ml-2">
                {user.email}
              </span>
              
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              {/* GOST OPCIJE (Login / Sign Up) */}
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