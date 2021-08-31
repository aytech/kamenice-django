import i18next from "i18next";

import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next";

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "cs",
    debug: false,
    lng: "cs"
  })

export default i18next
