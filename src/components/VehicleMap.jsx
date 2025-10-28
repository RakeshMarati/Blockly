import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const INITIAL_CENTER = [17.385044, 78.486671];

const vehicleIcon = L.divIcon({
  className: 'text-2xl',
  html: '<span class="text-red-600">🚗</span>',
  iconSize: [24, 24]
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
            pathOptions={{ color: 'gray', weight: 3, opacity: 0.5 }}
            positions={fullRouteCoords}
          />
        )}

        {routeData.length > 0 && currentIndex > 0 && (
          <Polyline
            pathOptions={{ color: 'red', weight: 5, opacity: 0.8 }}
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
    </div>
  );
}

export default VehicleMap;
