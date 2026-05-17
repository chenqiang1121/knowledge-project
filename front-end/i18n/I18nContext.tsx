import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

/**
 * Provides dependency-free UI localization for the public frontend placeholders.
 * The API content itself stays untouched; this layer only translates static UI text.
 */
export type Locale = "en" | "zh-CN";

type TranslationKey = keyof typeof en;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const STORAGE_KEY = "knowledge_locale";
const DEFAULT_LOCALE: Locale = "en";
const SUPPORTED_LOCALES: Locale[] = ["en", "zh-CN"];

const en = {
  "document.detailPlaceholder": "TODO: Document detail placeholder content",
  "document.title": "Document Detail",
  "header.brand": "Knowledge Project",
  "header.language": "Language",
  "header.languageEnglish": "English",
  "header.languageChinese": "中文",
  "header.navigationPlaceholder": "TODO: Header navigation placeholder",
  "home.placeholder": "TODO: Home page placeholder content",
  "home.title": "Knowledge Project",
  "search.placeholder": "TODO: Search page placeholder content",
  "search.title": "Search",
};

const zh: Record<TranslationKey, string> = {
  "document.detailPlaceholder": "TODO: 文档详情占位内容",
  "document.title": "文档详情",
  "header.brand": "知识库项目",
  "header.language": "语言",
  "header.languageEnglish": "English",
  "header.languageChinese": "中文",
  "header.navigationPlaceholder": "TODO: 页头导航占位",
  "home.placeholder": "TODO: 首页占位内容",
  "home.title": "知识库项目",
  "search.placeholder": "TODO: 搜索页占位内容",
  "search.title": "搜索",
};

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  en,
  "zh-CN": zh,
};

const I18nContext = createContext<I18nContextValue | null>(null);

function normalizeLocale(value: string | null): Locale {
  return SUPPORTED_LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(normalizeLocale(localStorage.getItem(STORAGE_KEY)));
  }, []);

  function setLocale(nextLocale: Locale) {
    const normalized = normalizeLocale(nextLocale);
    localStorage.setItem(STORAGE_KEY, normalized);
    setLocaleState(normalized);
  }

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    function t(key: TranslationKey) {
      return dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
    }

    return { locale, setLocale, t };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
