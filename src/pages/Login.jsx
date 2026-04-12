import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (mobileNumber.length === 10) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userMobile", mobileNumber);
      navigate("/dashboard");
    } else {
      setError("Please enter valid 10-digit mobile number");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-4xl font-bold text-white mb-2">SafeRoute AI</h1>
          <p className="text-gray-300">Your Safety-First Navigation Assistant</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                setError("");
              }}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Login / Sign Up
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Demo: Enter any 10-digit number
          </p>
        </div>
      </div>
    </div>
  );
}