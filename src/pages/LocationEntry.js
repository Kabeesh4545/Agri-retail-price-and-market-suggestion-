import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const indianCities = [
  { id: 1, name: 'Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  { id: 2, name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  { id: 3, name: 'Bangalore', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  { id: 4, name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  { id: 5, name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  { id: 6, name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  { id: 7, name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  { id: 8, name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  { id: 9, name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  { id: 10, name: 'Lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  { id: 11, name: 'Chandigarh', lat: 30.7333, lng: 76.7794, state: 'Punjab' },
  { id: 12, name: 'Bhopal', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  { id: 13, name: 'Indore', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  { id: 14, name: 'Coimbatore', lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
  { id: 15, name: 'Kochi', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  { id: 16, name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  { id: 17, name: 'Nagpur', lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  { id: 18, name: 'Guwahati', lat: 26.1445, lng: 91.7362, state: 'Assam' },
  { id: 19, name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, state: 'Odisha' },
  { id: 20, name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' }
];

const LocationEntry = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showOriginModal, setShowOriginModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');

  const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Millets', 'Pulses', 'Oilseeds', 'Jute'];

  const handleCitySelect = (city, type) => {
    if (type === 'origin') {
      setOrigin(city);
      setShowOriginModal(false);
    } else {
      setDestination(city);
      setShowDestinationModal(false);
    }
  };

  const handleShowRoute = () => {
    if (origin && destination && cropType && quantity) {
      const routeData = {
        origin: origin,
        destination: destination,
        cropType: cropType,
        quantity: quantity,
        status: 'active'
      };
      
      // Store the route data in localStorage to be used by the map component
      localStorage.setItem('customRoute', JSON.stringify(routeData));
      navigate('/transportation-map');
    } else {
      alert('Please fill in all fields: Origin, Destination, Crop Type, and Quantity');
    }
  };

  const CityModal = ({ isOpen, onClose, onSelect, title, excludeCity = '' }) => {
    if (!isOpen) return null;

    const filteredCities = excludeCity 
      ? indianCities.filter(city => city.name !== excludeCity)
      : indianCities;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">{title}</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-2 gap-3">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => onSelect(city)}
                  className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="font-semibold text-gray-800">{city.name}</div>
                  <div className="text-sm text-gray-600">{city.state}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🚚 Plan Your Agricultural Transport Route
          </h1>

          <div className="space-y-6">
            {/* Origin Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                📍 Origin Location
              </label>
              <button
                onClick={() => setShowOriginModal(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                {origin ? (
                  <div>
                    <div className="font-semibold text-gray-800">{origin.name}</div>
                    <div className="text-sm text-gray-600">{origin.state}</div>
                  </div>
                ) : (
                  <div className="text-gray-500">Click to select origin city</div>
                )}
              </button>
            </div>

            {/* Destination Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                🎯 Destination Location
              </label>
              <button
                onClick={() => setShowDestinationModal(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
              >
                {destination ? (
                  <div>
                    <div className="font-semibold text-gray-800">{destination.name}</div>
                    <div className="text-sm text-gray-600">{destination.state}</div>
                  </div>
                ) : (
                  <div className="text-gray-500">Click to select destination city</div>
                )}
              </button>
            </div>

            {/* Crop Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                🌾 Crop Type
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select crop type</option>
                {cropTypes.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                ⚖️ Quantity
              </label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 500 tons, 1000 kg"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Route Summary */}
            {origin && destination && (
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Route Summary:</h3>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="font-bold text-gray-800">{origin.name}</div>
                    <div className="text-sm text-gray-600">{origin.state}</div>
                  </div>
                  <div className="text-blue-600 text-2xl">→</div>
                  <div className="text-center">
                    <div className="font-bold text-gray-800">{destination.name}</div>
                    <div className="text-sm text-gray-600">{destination.state}</div>
                  </div>
                </div>
                {cropType && quantity && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Cargo:</span> {cropType} - {quantity}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Show Route Button */}
            <button
              onClick={handleShowRoute}
              disabled={!origin || !destination || !cropType || !quantity}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                origin && destination && cropType && quantity
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🗺️ Show Route on Map
            </button>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate('/transportation-map')}
            className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition"
          >
            📊 View All Routes
          </button>
          <button
            onClick={() => navigate('/market-suggestion')}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            🏪 Market Analysis
          </button>
        </div>
      </div>

      {/* Modals */}
      <CityModal
        isOpen={showOriginModal}
        onClose={() => setShowOriginModal(false)}
        onSelect={(city) => handleCitySelect(city, 'origin')}
        title="Select Origin City"
        excludeCity={destination?.name}
      />

      <CityModal
        isOpen={showDestinationModal}
        onClose={() => setShowDestinationModal(false)}
        onSelect={(city) => handleCitySelect(city, 'destination')}
        title="Select Destination City"
        excludeCity={origin?.name}
      />
    </div>
  );
};

export default LocationEntry;
