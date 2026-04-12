import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userMobile");
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/map", label: "Safe Map", icon: "🗺️" },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate("/dashboard")}
          >
            <span className="text-3xl">🛡️</span>
            <span className="font-bold text-xl text-white">SafeRoute AI</span>
          </div>

          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}