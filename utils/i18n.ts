import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

const resources = {
  ja: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next!",
      About: "Flitz",
    },
  },
}

i18n.use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: false,
  keySeparator: false,
  nsSeparator: false,
  resources,
})

export default i18n
