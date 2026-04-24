import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loadLanguage } from "../i18n";
import i18n from "../i18n";

export default function LanguageSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState("");

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "ta", label: "தமிழ்" },
    { code: "te", label: "తెలుగు" },
    { code: "bn", label: "বাংলা" },
  ];

  const handleSelect = () => {
    if (!selectedLang) return;
    loadLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-lime-600 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-[400px]">
        <h1 className="text-4xl font-extrabold text-green-700 text-center">
          {t("select_language")}
        </h1>

        {/* Dropdown */}
        <select
          className="w-full mt-6 p-3 border-2 border-green-600 rounded-xl text-lg text-green-800 font-semibold"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          <option value="">{t("select_language")}</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>

        {/* Continue Button */}
        <button
          onClick={handleSelect}
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg mt-6 w-full transition"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
