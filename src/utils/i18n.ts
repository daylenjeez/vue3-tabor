// Define languages
export type Language = 'zh' | 'en';

// Define translations
const translations = {
  zh: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其他'
  },
  en: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others'
  }
} as const;

// Define translation keys type
export type TranslationKey = keyof typeof translations.en;

// Track current language
let currentLanguage: Language = 'zh';

// Function to change language
export function setLanguage(lang: Language): void {
  currentLanguage = lang;
}

// Function to get current language
export function getLanguage(): Language {
  return currentLanguage;
}

// Function to get translation
export function t(key: TranslationKey): string {
  return translations[currentLanguage][key];
} 
