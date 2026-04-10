import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("vi");

  useEffect(() => {
    const saved = localStorage.getItem("app_language");
    if (saved === "vi" || saved === "en") {
      setLanguage(saved);
    } else {
      setLanguage("vi");
    }
  }, []);

  function changeLanguage(nextLanguage) {
    const safeLanguage = nextLanguage === "en" ? "en" : "vi";
    setLanguage(safeLanguage);
    localStorage.setItem("app_language", safeLanguage);
  }

  function t(path) {
    const keys = path.split(".");
    let current = translations[language];

    for (const key of keys) {
      current = current?.[key];
    }

    if (current !== undefined) return current;

    let fallback = translations.vi;
    for (const key of keys) {
      fallback = fallback?.[key];
    }
    return fallback ?? path;
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      t,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    return {
      language: "vi",
      setLanguage: () => {},
      t: (key) => key,
    };
  }

  return context;
}