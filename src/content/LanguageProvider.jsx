import { useEffect, useState } from 'react';
import { LanguageContext } from './LanguageContext';
import { readStorage, writeStorage } from './storage';
import { copy } from './portfolio';
import { messages } from './translations';
export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => readStorage('portfolio-language', 'tr') === 'en' ? 'en' : 'tr');
  useEffect(() => {
    writeStorage('portfolio-language', language);
    document.documentElement.lang = language;
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: copy[language], ui: messages[language] }}>{children}</LanguageContext.Provider>;
}
