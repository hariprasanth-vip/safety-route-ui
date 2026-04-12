import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [safetyTips, setSafetyTips] = useState([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }
    
    const mobile = localStorage.getItem("userMobile");
    setUserName(mobile ? `User ${mobile.slice(-4)}` : "Guest");

    // Safety insights
    setSafetyTips([
      { icon: "🚨", text: "Avoid isolated areas after 8 PM", priority: "High" },
      { icon: "📹", text: "Route has 85% CCTV coverage", priority: "Good" },
      { icon: "🚦", text: "Low traffic accident zone", priority: "Safe" },
      { icon: "👮", text: "Police patrols active on this route", priority: "Secure" },
    ]);
  }, [navigate]);

  const stats = [
    { label: "Routes Analyzed", value: "156", icon: "🛣️", color: "blue" },
    { label: "Safety Score", value: "94%", icon: "🛡️", color: "green" },
    { label: "Distance Saved", value: "247 km", icon: "📏", color: "purple" },
    { label: "Active Users", value: "2.4k", icon: "👥", color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-gray-300">Stay safe with AI-powered route suggestions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{stat.icon}</span>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-gray-300 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Action Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/map")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all transform hover:scale-105"
          >
            🗺️ Start Safe Navigation
          </button>
        </div>

        {/* Safety Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🛡️ Safety Insights</h2>
            <div className="space-y-3">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <span className="text-white">{tip.text}</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">
                    {tip.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">📊 Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-white mb-1">
                  <span>Safety Score</span>
                  <span>94%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-white mb-1">
                  <span>CCTV Coverage</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-white mb-1">
                  <span>Police Response</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}