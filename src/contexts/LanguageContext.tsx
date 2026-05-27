import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [loading, setLoading] = useState(true);

  // Load language from Supabase user_metadata on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.user_metadata?.language) {
          setLanguageState(session.user.user_metadata.language);
        }
      } catch (err) {
        console.error("Failed to load language preference:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // Save language to Supabase user_metadata
  const setLanguage = async (lang: Language) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { language: lang }
      });

      if (error) throw error;

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
