import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Tours", to: "/tours" },
  { label: "Best Value", to: "/deals" },
  { label: "Explore", to: "/destinations" },
  { label: "About", to: "/about" },
];

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
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
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
            W
          </span>
          <span className="text-xl font-black tracking-tight text-slate-950">Wanderlust</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          {user ? (
            <>
              {user.role === "admin" ? (
                <>
                  <Link
                    to="/admin"
                    className="hidden rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 sm:inline-flex"
                  >
                    Admin
                  </Link>
                  <Link
                    to="/add-trip"
                    className="hidden rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:inline-flex"
                  >
                    Add Trip
                  </Link>
                </>
              ) : (
                <Link
                  to="/bookings"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  My Bookings
                </Link>
              )}

              <span className="hidden max-w-[180px] truncate rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 lg:inline">
                {user.email}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              state={{ defaultIsLogin: true }}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
