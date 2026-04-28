import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

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
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 px-6 py-3 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
            ⌘
          </div>
          <Link to="/" className="text-2xl font-black tracking-tight text-slate-900">
            Wanderlust
          </Link>
        </div>

        <ul className="hidden items-center justify-center gap-10 md:flex">
          <li>
            <NavLink
              to="/destinations"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? "text-blue-600" : "text-slate-700"
                }`
              }
            >
              Destinations
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tours"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? "text-blue-600" : "text-slate-700"
                }`
              }
            >
              Tours
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/deals"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? "text-blue-600" : "text-slate-700"
                }`
              }
            >
              Deals
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? "text-blue-600" : "text-slate-700"
                }`
              }
            >
              About
            </NavLink>
          </li>
        </ul>

        <div className="flex items-center justify-end gap-3">
          {user ? (
            <>
              {user.role === "admin" ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin"
                    className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
                  >
                    Admin Panel
                  </Link>
                  <Link
                    to="/add-trip"
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 shadow-sm"
                  >
                    Add Trip
                  </Link>
                </div>
              ) : (
                <Link
                  to="/bookings"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600"
                >
                  My Bookings
                </Link>
              )}

              <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 lg:block">
                {user.email}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
              >
                Log out
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-bold text-blue-700">
                {user.email?.[0]?.toUpperCase() ?? "U"}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                state={{ defaultIsLogin: true }}
                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 shadow-sm"
              >
                Login
              </Link>
              <div className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 md:flex">
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  3
                </span>
                ○
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
