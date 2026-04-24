import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Load English by default
import en from "./locales/en.json";

const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
    fallbackLng: "en",
    debug: false,
    resources: {
      en: { translation: en },
    },
    interpolation: { escapeValue: false },
  });

export const loadLanguage = (lng) => {
  import(`./locales/${lng}.json`).then((translations) => {
    i18n.addResourceBundle(lng, "translation", translations, true, true);
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  });
};

export default i18n;
