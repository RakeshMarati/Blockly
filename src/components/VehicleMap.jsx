import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateSpeedKmH } from '../utils/geo';

const INITIAL_CENTER = [17.385044, 78.486671];

const vehicleIcon = L.divIcon({
  className: 'custom-vehicle-icon',
  html: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: 3px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">🚗</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
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
            pathOptions={{ color: '#6b7280', weight: 4, opacity: 0.4, dashArray: '10, 10' }}
            positions={fullRouteCoords}
          />
        )}

        {routeData.length > 0 && currentIndex > 0 && (
          <Polyline
            pathOptions={{ color: '#3b82f6', weight: 6, opacity: 1 }}
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

      <div className="absolute top-4 right-4 z-[1000] bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-2xl p-6 w-full max-w-sm border border-gray-200 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
            <span className="text-2xl">🚗</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Vehicle Status</h2>
            <p className="text-xs text-gray-500">Live tracking active</p>
          </div>
        </div>

        <div className="space-y-3 text-sm mb-5">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs text-gray-500 mb-1">Current Location</p>
            <p className="font-mono text-blue-700 font-semibold">
              {currentPosition?.lat?.toFixed(6)}, {currentPosition?.lng?.toFixed(6)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <p className="text-xs text-gray-500 mb-1">Timestamp</p>
              <p className="font-semibold text-purple-700">
                {currentPosition?.timestamp ? new Date(currentPosition.timestamp).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <p className="text-xs text-gray-500 mb-1">Speed</p>
              <p className="font-bold text-green-700 text-lg">{speed} km/h</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-gray-500">Progress</p>
              <p className="text-xs font-semibold text-gray-700">{progress}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={togglePlay}
            className="flex-1 px-6 py-3 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-bold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 border border-gray-300"
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleMap;
