import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <h3 className="text-xl font-black text-slate-950">Wanderlust</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            A university travel booking web app for browsing trips, booking seats, and managing reservations through a FastAPI and React stack.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/tours" className="transition-colors hover:text-blue-600">Tours</Link></li>
            <li><Link to="/deals" className="transition-colors hover:text-blue-600">Best Value</Link></li>
            <li><Link to="/destinations" className="transition-colors hover:text-blue-600">Explore Trips</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-blue-600">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900">Project</h4>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Universidad de Jaen Web Based Technologies project. Payment is simulated for academic testing.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-5 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-7xl text-sm text-slate-400">
          2026 Wanderlust. Built for local full-stack evaluation.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
