import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const login = () => {
    if (mobile.length === 10) navigate("/crop-selection");
    else alert(t("invalid_mobile"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-lime-600 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 text-center">
        <h2 className="text-3xl font-bold text-green-700">{t("login")}</h2>
        <p className="text-gray-600 mt-2">{t("enter_mobile")}</p>

    <input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  maxLength={10}
  className="w-full p-3 border rounded-xl text-lg"
  placeholder={t("enter_mobile")}
  onChange={(e) => setMobile(e.target.value)}
/>



        <button
          onClick={login}
          className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
