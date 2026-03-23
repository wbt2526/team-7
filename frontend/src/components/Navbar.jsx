import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧳</span>
          <span className="text-xl font-bold text-blue-600">TravelBox</span>
        </div>

        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
              Home
            </a>
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
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
          >
            Log in
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;