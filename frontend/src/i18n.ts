import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import en from "./locales/en/index";
import pt from "./locales/pt/index";
import es from "./locales/es/index";

const resources = {
  en: {
    translation: en,
  },
  pt: {
    translation: pt,
  },
  es: {
    translation: es,
  },
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",

    // Language detection options
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Namespace configuration
    defaultNS: "translation",
    ns: ["translation"],

    // React options
    react: {
      useSuspense: false,
    },
  });

export default i18n;
