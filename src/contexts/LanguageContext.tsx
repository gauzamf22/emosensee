import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const LANGUAGE_KEY = "app_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [loading, setLoading] = useState(true);

  // Load language from localStorage on mount
  useEffect(() => {
    const loadLanguage = () => {
      try {
        const savedLang = localStorage.getItem(LANGUAGE_KEY);
        if (savedLang === "en" || savedLang === "id") {
          setLanguageState(savedLang);
        }
      } catch (err) {
        console.error("Failed to load language preference:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // Save language to localStorage
  const setLanguage = async (lang: Language) => {
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
      setLanguageState(lang);
    } catch (err) {
      console.error("Failed to save language preference:", err);
      throw err;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
