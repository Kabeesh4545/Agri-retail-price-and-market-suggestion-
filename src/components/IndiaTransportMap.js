import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { lineString, nearestPointOnLine } from '@turf/turf';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Sample Indian cities with coordinates
const indianCities = [
  { id: 1, name: 'Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi', crops: ['Wheat', 'Rice'] },
  { id: 2, name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra', crops: ['Rice', 'Cotton'] },
  { id: 3, name: 'Bangalore', lat: 12.9716, lng: 77.5946, state: 'Karnataka', crops: ['Rice', 'Millets'] },
  { id: 4, name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', crops: ['Rice', 'Sugarcane'] },
  { id: 5, name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal', crops: ['Rice', 'Jute'] },
  { id: 6, name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana', crops: ['Rice', 'Cotton'] },
  { id: 7, name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat', crops: ['Cotton', 'Groundnut'] },
  { id: 8, name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra', crops: ['Sugarcane', 'Wheat'] },
  { id: 9, name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan', crops: ['Wheat', 'Mustard'] },
  { id: 10, name: 'Lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', crops: ['Wheat', 'Rice'] },
  { id: 11, name: 'Chandigarh', lat: 30.7333, lng: 76.7794, state: 'Punjab', crops: ['Wheat', 'Rice'] },
  { id: 12, name: 'Bhopal', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh', crops: ['Wheat', 'Soybean'] }
];

// Sample transportation routes
const sampleRoutes = [
  {
    id: 1,
    from: 'Delhi',
    to: 'Mumbai',
    crop: 'Wheat',
    quantity: '500 tons',
    status: 'active',
    coordinates: [
      [28.6139, 77.2090],
      [26.8467, 80.9462],
      [23.2599, 77.4126],
      [19.0760, 72.8777]
    ]
  },
  {
    id: 2,
    from: 'Bangalore',
    to: 'Chennai',
    crop: 'Rice',
    quantity: '300 tons',
    status: 'active',
    coordinates: [
      [12.9716, 77.5946],
      [13.0827, 80.2707]
    ]
  },
  {
    id: 3,
    from: 'Kolkata',
    to: 'Hyderabad',
    crop: 'Rice',
    quantity: '400 tons',
    status: 'pending',
    coordinates: [
      [22.5726, 88.3639],
      [17.3850, 78.4867]
    ]
  }
];

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const IndiaTransportMap = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routes, setRoutes] = useState(sampleRoutes);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [filterCrop, setFilterCrop] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [customRoute, setCustomRoute] = useState(null);

  // Check for custom route on component mount
  useEffect(() => {
    const savedCustomRoute = localStorage.getItem('customRoute');
    if (savedCustomRoute) {
      const routeData = JSON.parse(savedCustomRoute);
      const newCustomRoute = {
        id: Date.now(),
        from: routeData.origin.name,
        to: routeData.destination.name,
        crop: routeData.cropType,
        quantity: routeData.quantity,
        status: routeData.status || 'active',
        coordinates: [
          [routeData.origin.lat, routeData.origin.lng],
          [routeData.destination.lat, routeData.destination.lng]
        ],
        isCustom: true
      };
      
      setCustomRoute(newCustomRoute);
      setRoutes(prevRoutes => [...prevRoutes, newCustomRoute]);
      
      // Center map on the custom route
      const centerLat = (routeData.origin.lat + routeData.destination.lat) / 2;
      const centerLng = (routeData.origin.lng + routeData.destination.lng) / 2;
      setMapCenter([centerLat, centerLng]);
      setMapZoom(7);
      
      // Clear the custom route from localStorage
      localStorage.removeItem('customRoute');
    }
  }, []);

  const getRouteColor = (status, isCustom = false) => {
    if (isCustom) return '#dc2626'; // Red for custom routes
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'completed': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const filteredRoutes = routes.filter(route => {
    const cropMatch = filterCrop === 'all' || route.crop === filterCrop;
    const statusMatch = filterStatus === 'all' || route.status === filterStatus;
    return cropMatch && statusMatch;
  });

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
  };

  const uniqueCrops = [...new Set(routes.map(r => r.crop))];

  return (
    <div className="w-full h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Agricultural Transportation Routes - India</h1>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter by Crop:</label>
            <select 
              value={filterCrop} 
              onChange={(e) => setFilterCrop(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Crops</option>
              {uniqueCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Active Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span>Pending Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span>Completed Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Your Custom Route</span>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: 'calc(100vh - 200px)', width: '100%' }}
            className="z-0"
          >
            <MapController center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* City Markers */}
            {indianCities.map(city => (
              <Marker 
                key={city.id} 
                position={[city.lat, city.lng]}
                eventHandlers={{
                  click: () => {
                    console.log(`City: ${city.name}, Crops: ${city.crops.join(', ')}`);
                  }
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{city.name}</h3>
                    <p className="text-sm text-gray-600">State: {city.state}</p>
                    <p className="text-sm">Major Crops: {city.crops.join(', ')}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Transportation Routes */}
            {filteredRoutes.map(route => (
              <Polyline
                key={route.id}
                positions={route.coordinates}
                color={getRouteColor(route.status, route.isCustom)}
                weight={route.isCustom ? 6 : 4}
                opacity={route.isCustom ? 1 : 0.8}
                dashArray={route.isCustom ? '10, 5' : null}
                eventHandlers={{
                  click: () => handleRouteClick(route)
                }}
              />
            ))}
          </MapContainer>
        </div>

        {/* Route Details Sidebar */}
        <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <h2 className="text-lg font-bold mb-4">Route Details</h2>
          
          {selectedRoute ? (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-semibold text-blue-600">
                  {selectedRoute.from} → {selectedRoute.to}
                </h3>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                  selectedRoute.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedRoute.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedRoute.status.toUpperCase()}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium">Crop Type:</p>
                <p className="text-sm text-gray-600">{selectedRoute.crop}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Quantity:</p>
                <p className="text-sm text-gray-600">{selectedRoute.quantity}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Route Coordinates:</p>
                <ul className="text-xs text-gray-600 mt-1">
                  {selectedRoute.coordinates.map((coord, index) => (
                    <li key={index}>Point {index + 1}: {coord[0].toFixed(4)}, {coord[1].toFixed(4)}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Click on a route to see details</p>
          )}

          <div className="mt-6">
            <h3 className="font-semibold mb-2">All Routes</h3>
            <div className="space-y-2">
              {filteredRoutes.map(route => (
                <div 
                  key={route.id}
                  className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                    route.isCustom ? 'border-red-300 bg-red-50' : ''
                  }`}
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {route.from} → {route.to}
                      {route.isCustom && <span className="text-red-600 ml-1">★</span>}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      route.isCustom ? 'bg-red-100 text-red-800' :
                      route.status === 'active' ? 'bg-green-100 text-green-800' :
                      route.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {route.isCustom ? 'CUSTOM' : route.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{route.crop} • {route.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaTransportMap;
