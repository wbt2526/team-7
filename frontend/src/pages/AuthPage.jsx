import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.defaultIsLogin ?? true);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-gray-50 px-4 py-12">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
          <div className="mb-6 text-center">
            <div className="mb-2 text-3xl">🧳</div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome Back" : "Create your account"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin((prev) => !prev)}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;