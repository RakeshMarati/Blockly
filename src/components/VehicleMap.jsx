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

      <div className="absolute top-4 right-4 z-[1000] bg-white shadow-2xl rounded-lg p-5 w-full max-w-xs border border-gray-300">
        <div className="flex items-center gap-2 mb-4 border-b pb-3">
          <div className="bg-red-500 p-2 rounded-lg">
            <span className="text-xl">🚗</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Vehicle Tracker</h2>
            <p className="text-xs text-gray-500">Live Tracking</p>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Location</p>
            <p className="font-mono text-sm text-gray-800 font-medium">
              {currentPosition?.lat?.toFixed(6)}, {currentPosition?.lng?.toFixed(6)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500 mb-1">Time</p>
              <p className="font-semibold text-gray-800">
                {currentPosition?.timestamp ? new Date(currentPosition.timestamp).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Speed</p>
              <p className="font-bold text-gray-800 text-base">{speed} km/h</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-gray-500">Route Progress</p>
              <p className="text-xs font-semibold text-gray-700">{progress}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={togglePlay}
            className="flex-[2] px-4 py-2.5 text-white font-semibold rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: isPlaying ? '#ef4444' : '#22c55e'
            }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={resetSimulation}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleMap;
