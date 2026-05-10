import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { loginAndStoreUser } from "../lib/auth";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.defaultIsLogin ?? true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const switchMode = () => {
    setIsLogin((current) => !current);
    resetMessages();
  };

  const handleLogin = async () => {
    resetMessages();
    setLoading(true);

    try {
      await loginAndStoreUser(email, password);
      setSuccess("Login successful. Taking you back to the catalog...");
      window.setTimeout(() => {
        window.location.href = "/";
      }, 700);
    } catch (err) {
      setError(err.message || "Cannot connect to the server. Please check that FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    resetMessages();
    setLoading(true);

    try {
      await apiRequest("/user/", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password,
        }),
      });
      setSuccess("Account created. You can now log in with your email and password.");
      setIsLogin(true);
      setFirstName("");
      setLastName("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-12">
      <div className="mx-auto grid min-h-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <div className="hidden lg:block">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Wanderlust account</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-black tracking-tight text-slate-950">
            Keep your bookings, payments, and trip plans in one clear place.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Sign in to reserve trips, complete simulated payments, and review your booking history.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-6">
            <div className="mb-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-bold">
              <button
                type="button"
                onClick={() => {
                  if (!isLogin) switchMode();
                }}
                className={`rounded-lg px-4 py-2 transition ${isLogin ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isLogin) switchMode();
                }}
                className={`rounded-lg px-4 py-2 transition ${!isLogin ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >
                Create account
              </button>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {isLogin
                ? "Use the email and password connected to your Wanderlust account."
                : "Registration creates a standard traveler account. Admin access is managed separately."}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">First name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Last name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 py-3.5 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Please wait..." : isLogin ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-bold text-blue-600 hover:text-blue-700"
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
