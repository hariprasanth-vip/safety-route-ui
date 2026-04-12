import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import Navbar from "../components/Navbar";
import { getSafeRoute } from "../services/aiservices";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function SetViewOnLocation({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView(location, 15);
    }
  }, [location, map]);
  return null;
}

export default function MapPage() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [safeRoute, setSafeRoute] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);

  // Risk zones data
  const riskZones = [
    { lat: 11.92, lng: 79.82, risk: 8, name: "High Crime Zone" },
    { lat: 11.88, lng: 79.79, risk: 3, name: "Low Risk Area" },
    { lat: 11.95, lng: 79.85, risk: 7, name: "Accident Prone" },
    { lat: 11.90, lng: 79.81, risk: 2, name: "Safe Zone" },
    { lat: 11.93, lng: 79.78, risk: 6, name: "Moderate Risk" },
  ];

  // CCTV locations
  const cctvLocations = [
    { lat: 11.91, lng: 79.80, type: "Police Camera" },
    { lat: 11.89, lng: 79.82, type: "Traffic Camera" },
    { lat: 11.94, lng: 79.83, type: "Private Camera" },
  ];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation({ lat: 11.9, lng: 79.8 }); // Default location
          setLoading(false);
        }
      );
    } else {
      setUserLocation({ lat: 11.9, lng: 79.8 });
      setLoading(false);
    }
  }, [navigate]);

  const handleFindRoutes = () => {
    // Simulate route generation
    const generatedRoutes = [
      {
        id: 1,
        name: "Highway Route",
        distance: "12 km",
        duration: "25 min",
        risk: 8,
        safetyScore: 65,
        crimeRate: "High",
        cctvCount: 3,
      },
      {
        id: 2,
        name: "Main Road Route",
        distance: "14 km",
        duration: "30 min",
        risk: 4,
        safetyScore: 85,
        crimeRate: "Low",
        cctvCount: 8,
      },
      {
        id: 3,
        name: "Safe Route (AI Recommended)",
        distance: "15 km",
        duration: "35 min",
        risk: 2,
        safetyScore: 95,
        crimeRate: "Very Low",
        cctvCount: 12,
      },
    ];

    setRoutes(generatedRoutes);
    const safest = getSafeRoute(generatedRoutes);
    setSafeRoute(safest);
    setShowRoutes(true);
  };

  const getRiskColor = (risk) => {
    if (risk > 7) return "#ef4444";
    if (risk > 4) return "#f59e0b";
    return "#10b981";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Route Controls */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Plan Your Route</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Current Location</label>
                  <input
                    type="text"
                    value={`${userLocation?.lat.toFixed(4)}, ${userLocation?.lng.toFixed(4)}`}
                    disabled
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <button
                  onClick={handleFindRoutes}
                  disabled={!destination}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Find Safe Routes
                </button>
              </div>
            </div>

            {/* Route Results */}
            {showRoutes && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Route Analysis</h3>
                <div className="space-y-3">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className={`p-4 rounded-lg ${
                        safeRoute?.id === route.id
                          ? "bg-green-500/20 border-2 border-green-500"
                          : "bg-black/20"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold">{route.name}</span>
                        <span className="text-sm px-2 py-1 bg-white/20 rounded-full text-white">
                          Safety: {route.safetyScore}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>📍 Distance: {route.distance}</div>
                        <div>⏱️ Time: {route.duration}</div>
                        <div>📹 CCTV Cameras: {route.cctvCount}</div>
                        <div>⚠️ Crime Rate: {route.crimeRate}</div>
                      </div>
                      {safeRoute?.id === route.id && (
                        <div className="mt-2 text-green-400 text-sm font-semibold">
                          ✓ AI Recommended Safest Route
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Live Safety Map</h2>
              <div className="h-[600px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[userLocation?.lat || 11.9, userLocation?.lng || 79.8]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  
                  <SetViewOnLocation location={userLocation} />
                  
                  {/* User Location Marker */}
                  {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                      <Popup>You are here 🟢</Popup>
                    </Marker>
                  )}

                  {/* Risk Zones */}
                  {riskZones.map((zone, index) => (
                    <Circle
                      key={index}
                      center={[zone.lat, zone.lng]}
                      radius={200}
                      pathOptions={{
                        color: getRiskColor(zone.risk),
                        fillColor: getRiskColor(zone.risk),
                        fillOpacity: 0.3,
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>{zone.name}</strong>
                          <br />
                          Risk Level: {zone.risk}/10
                        </div>
                      </Popup>
                    </Circle>
                  ))}

                  {/* CCTV Locations */}
                  {cctvLocations.map((cctv, index) => (
                    <Marker
                      key={index}
                      position={[cctv.lat, cctv.lng]}
                      icon={L.divIcon({
                        className: "custom-icon",
                        html: "📹",
                        iconSize: [30, 30],
                      })}
                    >
                      <Popup>{cctv.type} CCTV Camera</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="mt-4 flex gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>High Risk Zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Safe Zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📹</span>
                  <span>CCTV Camera</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}