import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

// Pages
import LanguageSelection from "./pages/LanguageSelection";
import Login from "./pages/Login";
import CropSelection from "./pages/CropSelection";
import MarketSuggestion from "./pages/MarketSuggestion";
import Payment from "./pages/Payment";
import TransportationMap from "./pages/TransportationMap";
import LocationEntry from "./pages/LocationEntry";

function App() {
  const { t } = useTranslation();

  // Load saved language on every app load
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved) {
      i18n.changeLanguage(saved);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LanguageSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crop-selection" element={<CropSelection />} />
        <Route path="/market-suggestion" element={<MarketSuggestion />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/transportation-map" element={<TransportationMap />} />
        <Route path="/location-entry" element={<LocationEntry />} />
      </Routes>
    </Router>
  );
}

export default App;
