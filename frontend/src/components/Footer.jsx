import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Wanderlust</h3>
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500">
            Making your travel dreams a reality with curated experiences across the globe.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.28em] text-slate-900">Quick Links</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a href="#" className="transition-colors hover:text-blue-600">About Us</a></li>
            <li><a href="#" className="transition-colors hover:text-blue-600">Contact</a></li>
            <li><a href="#" className="transition-colors hover:text-blue-600">Partners</a></li>
            <li><a href="#" className="transition-colors hover:text-blue-600">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.28em] text-slate-900">Support</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a href="#" className="transition-colors hover:text-blue-600">Help Center</a></li>
            <li><a href="#" className="transition-colors hover:text-blue-600">Safety Information</a></li>
            <li><a href="#" className="transition-colors hover:text-blue-600">Cancellation Options</a></li>
            <li><a href="#" className="transition-colors hover:text-blue-600">Our COVID-19 Response</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.28em] text-slate-900">Newsletter</h4>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
            Subscribe to receive destination inspiration and exclusive deals.
          </p>
          <div className="mt-5 flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-700 outline-none"
            />
            <button className="bg-blue-600 px-5 font-bold text-white transition hover:bg-blue-700">
              ➜
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-5">
        <p className="text-center text-sm text-slate-400">
          © 2026 Wanderlust Travel Agency. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
