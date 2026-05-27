import { en } from "./en";
import { id } from "./id";
import { useLanguage } from "../contexts/LanguageContext";

const translations = {
  en,
  id,
};

export function useTranslation() {
  const { language, setLanguage } = useLanguage();
  return {
    t: translations[language],
    language,
    setLanguage
  };
}

export { en, id };
export type { Translation } from "./en";
