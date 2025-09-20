import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./languages/en/translation.json";
import ar from "./languages/ar/translation.json";
import fr from "./languages/fr/translation.json";
import de from "./languages/de/translation.json";
import es from "./languages/es/translation.json";
import zh from "./languages/zh/translation.json";
import ita from "./languages/ita/translation.json";

i18n
  .use(LanguageDetector) // auto-detect language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      fr: { translation: fr },
      de: { translation: de },
      es: { translation: es },
      zh: { translation: zh },
      ita: { translation: ita },
    },
    lng: localStorage.getItem("lang") || "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
