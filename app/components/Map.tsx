'use client';

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useState } from 'react';

// Fix for default markers in react-leaflet
const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Custom marker icon for user-placed markers
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'custom-marker'
});

// Sample travel destinations
const destinations = [
  {
    id: 1,
    name: "London",
    position: [51.505, -0.09],
    description: "The capital of England and the United Kingdom"
  },
  {
    id: 2,
    name: "Paris",
    position: [48.8566, 2.3522],
    description: "The City of Light, capital of France"
  },
  {
    id: 3,
    name: "New York",
    position: [40.7128, -74.0060],
    description: "The Big Apple, a global center of culture and commerce"
  },
  {
    id: 4,
    name: "Tokyo",
    position: [35.6762, 139.6503],
    description: "The capital of Japan, a blend of tradition and innovation"
  }
];

// Component to handle map click events
function MapClickHandler({ onMapClick, isPlacingMarker }: { onMapClick: (lat: number, lng: number) => void, isPlacingMarker: boolean }) {
  useMapEvents({
    click: (e) => {
      if (isPlacingMarker) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function Map() {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);
  const [customMarkers, setCustomMarkers] = useState<Array<{
    id: number;
    position: [number, number];
    name: string;
    description: string;
  }>>([]);
  const [nextMarkerId, setNextMarkerId] = useState(1);

  const handleMapClick = (lat: number, lng: number) => {
    if (isPlacingMarker) {
      const markerName = prompt('Enter a name for this location:') || 'Custom Location';
      const markerDescription = prompt('Enter a description (optional):') || '';
      
      const newMarker = {
        id: nextMarkerId,
        position: [lat, lng] as [number, number],
        name: markerName,
        description: markerDescription
      };
      
      setCustomMarkers(prev => [...prev, newMarker]);
      setNextMarkerId(prev => prev + 1);
      setIsPlacingMarker(false);
    }
  };

  const removeCustomMarker = (markerId: number) => {
    setCustomMarkers(prev => prev.filter(marker => marker.id !== markerId));
  };

  return (
    <div className="flex w-full h-[600px] gap-4 max-w-7xl mx-auto">
      {/* Left Side - Popular Destinations */}
      <div className="w-72 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg">Popular Destinations</h3>
        <div className="space-y-3">
          {destinations.map((destination) => (
            <div 
              key={destination.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                selectedDestination === destination.name 
                  ? 'bg-blue-50 border-blue-300 shadow-md' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
              onClick={() => setSelectedDestination(destination.name)}
            >
              <div className="font-semibold text-gray-800">{destination.name}</div>
              <div className="text-sm text-gray-600 mt-1">{destination.description}</div>
              <button 
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Planning trip to ${destination.name}`);
                }}
              >
                Plan Trip
              </button>
            </div>
          ))}
        </div>
        
        {/* Custom Markers List */}
        {customMarkers.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-3">Your Custom Markers</h4>
            <div className="space-y-2">
              {customMarkers.map((marker) => (
                <div 
                  key={marker.id}
                  className="p-3 rounded-lg bg-green-50 border border-green-200"
                >
                  <div className="font-semibold text-gray-800">{marker.name}</div>
                  {marker.description && (
                    <div className="text-sm text-gray-600 mt-1">{marker.description}</div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button 
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                      onClick={() => console.log(`Planning trip to ${marker.name}`)}
                    >
                      Plan Trip
                    </button>
                    <button 
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                      onClick={() => removeCustomMarker(marker.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Center - Interactive Map */}
      <div className="flex-1 rounded-lg overflow-hidden shadow-lg relative">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <MapClickHandler onMapClick={handleMapClick} isPlacingMarker={isPlacingMarker} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Pre-defined destinations */}
          {destinations.map((destination) => (
            <Marker 
              key={destination.id}
              position={destination.position as [number, number]} 
              icon={icon}
              eventHandlers={{
                click: () => setSelectedDestination(destination.name)
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2">{destination.name}</h3>
                  <p className="text-gray-600">{destination.description}</p>
                  <button 
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    onClick={() => console.log(`Planning trip to ${destination.name}`)}
                  >
                    Plan Trip
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Custom user-placed markers */}
          {customMarkers.map((marker) => (
            <Marker 
              key={`custom-${marker.id}`}
              position={marker.position} 
              icon={customIcon}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2">{marker.name}</h3>
                  {marker.description && (
                    <p className="text-gray-600 mb-2">{marker.description}</p>
                  )}
                  <div className="flex gap-2 justify-center">
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      onClick={() => console.log(`Planning trip to ${marker.name}`)}
                    >
                      Plan Trip
                    </button>
                    <button 
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      onClick={() => removeCustomMarker(marker.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Right Side - Map Controls */}
      <div className="w-72 bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg">Map Controls</h3>
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-800 mb-2">Marker Placement</h4>
            <button
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isPlacingMarker 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              onClick={() => setIsPlacingMarker(!isPlacingMarker)}
            >
              {isPlacingMarker ? 'Cancel Placing Marker' : 'Place Custom Marker'}
            </button>
            {isPlacingMarker && (
              <p className="text-xs text-gray-600 text-center mt-2">
                Click anywhere on the map to place a marker
              </p>
            )}
          </div>

          {customMarkers.length > 0 && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-gray-800 mb-2">Manage Markers</h4>
              <button
                className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={() => {
                  setCustomMarkers([]);
                  setNextMarkerId(1);
                }}
              >
                Clear All Custom Markers
              </button>
              <p className="text-xs text-gray-600 text-center mt-2">
                This will remove all your custom markers
              </p>
            </div>
          )}

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Map Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Click on markers to see details</p>
              <p>• Use zoom controls on the map</p>
              <p>• Drag to pan around the map</p>
              <p>• Select destinations from the left panel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
