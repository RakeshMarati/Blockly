import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateSpeedKmH } from '../utils/geo';

const INITIAL_CENTER = [17.385044, 78.486671];

const vehicleIcon = L.divIcon({
  className: 'custom-vehicle-icon',
  html: '<div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border: 3px solid white; border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(239, 68, 68, 0.5); font-size: 20px; transform: rotate(0deg);">🚗</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

function VehicleMap() {
  const [routeData, setRouteData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/dummy-route.json');
        const data = await response.json();

        setRouteData(data.map(p => ({
          lat: p.latitude,
          lng: p.longitude,
          timestamp: p.timestamp
        })));

      } catch (error) {
        console.error("Error loading route data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isPlaying && routeData.length > 0 && currentIndex < routeData.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 2000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentIndex, routeData]);

  const currentPosition = routeData[currentIndex] || routeData[0];

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const fullRouteCoords = routeData.map(p => [p.lat, p.lng]);
  const speed = calculateSpeedKmH(currentIndex, routeData);
  const progress = routeData.length > 0 ? ((currentIndex / (routeData.length - 1)) * 100).toFixed(1) : 0;

  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {routeData.length > 0 && (
          <Polyline
            pathOptions={{ color: '#9ca3af', weight: 3, opacity: 0.5, dashArray: '5, 10' }}
            positions={fullRouteCoords}
          />
        )}

        {routeData.length > 0 && currentIndex > 0 && (
          <Polyline
            pathOptions={{ color: '#ef4444', weight: 5, opacity: 0.9 }}
            positions={routeData.slice(0, currentIndex + 1).map(p => [p.lat, p.lng])}
          />
        )}

        {currentPosition && (
          <Marker
            position={[currentPosition.lat, currentPosition.lng]}
            icon={vehicleIcon}
          />
        )}
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-2xl p-3 w-[500px] max-w-md h-[230px] border-2 border-red-200 backdrop-blur-sm flex flex-col">
        <div className="flex items-center gap-2 mb-2 border-b-2 border-red-100 pb-2">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-lg shadow-lg">
            <span className="text-lg">🚗</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Vehicle Tracker</h2>
            <p className="text-xs text-red-600 font-medium">Live Tracking Active</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 text-base overflow-y-auto">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mx-1">
            <p className="text-sm text-blue-600 font-semibold mb-2">📍 Current Location</p>
            <p className="font-mono text-sm text-blue-800 font-bold">
              {currentPosition?.lat?.toFixed(6)}, {currentPosition?.lng?.toFixed(6)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mx-1">
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 font-semibold mb-2">🕐 Time</p>
              <p className="font-bold text-purple-800 text-sm">
                {currentPosition?.timestamp ? new Date(currentPosition.timestamp).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-semibold mb-2">⚡ Speed</p>
              <p className="font-bold text-green-800 text-base">{speed} km/h</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mx-1">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600 font-semibold">📊 Route Progress</p>
              <p className="text-sm font-bold text-gray-800">{progress}%</p>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2 mx-1">
          <button
            onClick={togglePlay}
            className="flex-[2] px-4 py-2 text-white font-bold text-base rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ 
              background: isPlaying 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
            }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={resetSimulation}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-bold text-base rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all duration-300 hover:scale-105 shadow-lg border border-gray-400"
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleMap;
