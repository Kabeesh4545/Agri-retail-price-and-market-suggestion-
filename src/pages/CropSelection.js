import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CropSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const crops = [
    { id: 1, key: "rice", image: "/images/rice.jpg"},
    { id: 2, key: "wheat", image: "/images/wheat.webp" },
    { id: 3, key: "tomato", image: "/images/tomato.jpg" },
    { id: 4, key: "potato", image: "/images/potato.jpg" },
    { id: 5, key: "sugarcane", image: "/images/sugarcane.jpg" },
    { id: 6, key: "maize", image: "/images/maize.jpg" }
  ];

  const selectCrop = (crop) => {
    localStorage.setItem("selectedCrop", JSON.stringify(crop));
    navigate("/market-suggestion");
  };

  return (
    <div className="min-h-screen bg-green-100 p-10">
      <h2 className="text-4xl font-bold text-center text-green-800 mb-8">
        {t("select_crop")}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {crops.map((crop) => (
          <div
            key={crop.id}
            onClick={() => selectCrop(crop)}
            className="bg-white p-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition cursor-pointer"
          >
            <img
              src={crop.image}
              alt={crop.key}
              className="w-24 h-24 mx-auto mb-3"
            />
            <h3 className="text-xl font-bold text-center text-green-700">
              {t(`crop.${crop.key}`)}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
