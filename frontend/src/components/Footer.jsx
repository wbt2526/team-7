import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold text-white">TravelBox</h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Your trusted partner for unforgettable adventures around the world.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Tours
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white">Contact Us</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>Email: support@travelbox.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Adventure Lane, Wander City</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 px-6 py-4">
        <p className="text-center text-sm text-gray-500">
          © 2026 TravelBox. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;