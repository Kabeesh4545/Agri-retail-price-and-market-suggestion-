import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import statePrices from "../data/statePrices";
import { useTranslation } from "react-i18next";
import stateMarkets from "../data/stateMarkets";

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

export default function MarketSuggestion() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const crop = JSON.parse(localStorage.getItem("selectedCrop"));
  const prices = statePrices[crop?.key] || {};

  const [showMarkets, setShowMarkets] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [transportCost, setTransportCost] = useState("");
  const [distance, setDistance] = useState("");
  const [location, setLocation] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  if (!prices || Object.keys(prices).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <h2 className="text-2xl font-bold text-red-700">
          ❌ {t("price_not_available")} {t(`crop.${crop.key}`)}
        </h2>
      </div>
    );
  }

  const bestMarket = useMemo(() => {
    return Object.keys(prices).reduce((a, b) =>
      prices[a] > prices[b] ? a : b
    );
  }, [prices]);

  const bestMarketKey = bestMarket.toLowerCase().replace(/\s+/g, "_");

  const handleAnalysis = () => {
    const todayPrice = prices[bestMarket];
    const tomorrowPrediction = todayPrice * 1.03;

    if (tomorrowPrediction > todayPrice) {
      setAnalysisResult(`${t("sell_tomorrow")} ₹${tomorrowPrediction.toFixed(2)}/Kg`);
    } else {
      setAnalysisResult(`${t("sell_today")} ₹${todayPrice}/Kg`);
    }
  };

  const handleLocationSelect = (city, type) => {
    if (type === 'location') {
      setSelectedLocation(city);
      setLocation(city.name);
      setShowLocationModal(false);
    } else {
      setSelectedDestination(city);
      setSelectedMarket(city.name);
      setShowDestinationModal(false);
    }
  };

  const calculateTransport = () => {
    if (selectedLocation && selectedDestination) {
      // Simple distance calculation (in real app, use actual distance API)
      const latDiff = Math.abs(selectedLocation.lat - selectedDestination.lat);
      const lngDiff = Math.abs(selectedLocation.lng - selectedDestination.lng);
      const estimatedDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion
      setDistance(Math.round(estimatedDistance));
      const cost = estimatedDistance * 8; // ₹8 per km
      setTransportCost(Math.round(cost));
    }
  };

  const showRouteOnMap = () => {
    if (selectedLocation && selectedDestination) {
      const routeData = {
        origin: selectedLocation,
        destination: selectedDestination,
        cropType: crop?.key || 'Unknown',
        quantity: '500 tons', // Default quantity
        status: 'active'
      };
      
      localStorage.setItem('customRoute', JSON.stringify(routeData));
      navigate('/transportation-map');
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
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
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
                  className="p-3 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
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
    <div className="min-h-screen bg-green-100 p-10">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
        {t("best_market")} ({t(`crop.${crop.key}`)})
      </h2>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold text-green-700 mb-3">
          {t("price_states")}
        </h3>

        {Object.keys(prices).map((state) => (
          <p key={state} className="text-lg flex justify-between border-b py-2">
            <span>{t(`state.${state}`)}</span> <span>₹ {prices[state]}</span>
          </p>
        ))}

        {/* BEST MARKET CARD WITH DROPDOWN */}
        <div
          className="mt-6 p-4 bg-green-300 rounded-xl text-center font-semibold text-xl cursor-pointer hover:bg-green-400 transition"
          onClick={() => setShowMarkets(!showMarkets)}
        >
          🌟 {t("best_market")}: {t(`state.${bestMarket}`)} — ₹{prices[bestMarket]}/Kg
          <p className="text-sm text-blue-700">(Tap to view markets)</p>
        </div>

        {/* MARKET LIST DROPDOWN */}
        {showMarkets && (
          <div className="mt-4 bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-3">{t("select_market")}</h3>

            {stateMarkets[bestMarketKey]?.map((market, index) => (
              <button
                key={index}
                className="w-full border p-3 rounded-lg mb-2 hover:bg-green-200 transition"
                onClick={() => {
                  setSelectedMarket(market);
                  setShowMarkets(false);
                }}
              >
                {market}
              </button>
            ))}
          </div>
        )}

        {/* TRANSPORT SECTION */}
        <div className="mt-6">
          <label className="block font-semibold text-green-800 mb-2">
            📍 Select Your Location
          </label>

          <button
            onClick={() => setShowLocationModal(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
          >
            {selectedLocation ? (
              <div>
                <div className="font-semibold text-gray-800">{selectedLocation.name}</div>
                <div className="text-sm text-gray-600">{selectedLocation.state}</div>
              </div>
            ) : (
              <div className="text-gray-500">Click to select your location</div>
            )}
          </button>

          <label className="block font-semibold text-green-800 mt-4 mb-2">
            🎯 Select Destination Market
          </label>

          <button
            onClick={() => setShowDestinationModal(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
          >
            {selectedDestination ? (
              <div>
                <div className="font-semibold text-gray-800">{selectedDestination.name}</div>
                <div className="text-sm text-gray-600">{selectedDestination.state}</div>
              </div>
            ) : (
              <div className="text-gray-500">Click to select destination market</div>
            )}
          </button>

          {selectedLocation && selectedDestination && (
            <div className="mt-4 bg-green-50 p-3 rounded-xl border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="font-bold text-gray-800">{selectedLocation.name}</div>
                  <div className="text-sm text-gray-600">{selectedLocation.state}</div>
                </div>
                <div className="text-green-600 text-2xl">→</div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">{selectedDestination.name}</div>
                  <div className="text-sm text-gray-600">{selectedDestination.state}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={calculateTransport}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              💰 Calculate Cost
            </button>
            
            <button
              onClick={showRouteOnMap}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              🗺️ Show Route
            </button>
          </div>

          {transportCost !== "" && (
            <p className="mt-4 text-xl text-center font-bold text-green-700">
              From <b>{selectedLocation?.name}</b> → <b>{selectedDestination?.name || bestMarket}</b>
              <br />
              📏 Distance: ~{distance} km
              <br />
              🚚 {t("transport_result")}: ₹{transportCost}
            </p>
          )}
        </div>

        {/* ANALYSIS BUTTON */}
        <button
          onClick={handleAnalysis}
          className="w-full mt-6 bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition"
        >
          {t("analyze")}
        </button>

        {analysisResult !== "" && (
          <div className="mt-4 bg-green-200 p-4 rounded-xl text-center font-bold text-lg">
            {analysisResult}
          </div>
        )}

        {/* QUICK ACCESS BUTTONS */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => navigate("/transportation-map")}
            className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition"
          >
            � View All Routes
          </button>
        </div>
      </div>

      {/* MODALS */}
      <CityModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={(city) => handleLocationSelect(city, 'location')}
        title="Select Your Location"
        excludeCity={selectedDestination?.name}
      />

      <CityModal
        isOpen={showDestinationModal}
        onClose={() => setShowDestinationModal(false)}
        onSelect={(city) => handleLocationSelect(city, 'destination')}
        title="Select Destination Market"
        excludeCity={selectedLocation?.name}
      />
    </div>
  );
}
