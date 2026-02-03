'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Language, DEFAULT_LANGUAGE } from '@/i18n/config'
import id from '@/i18n/locales/id'
import en from '@/i18n/locales/en'

const LOCALE_KEY = 'emasku_language'

const translations = {
  id,
  en,
}

// Helper for nested keys
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null
  }, obj) || path
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  mounted: boolean
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY) as Language
    if (saved && (saved === 'id' || saved === 'en')) {
      setLanguage(saved)
    }
    setMounted(true)
  }, [])

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang)
    localStorage.setItem(LOCALE_KEY, lang)
  }, [])

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const currentTranslations = translations[language]
    let text = getNestedValue(currentTranslations, key)

    if (params && text) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  )
}
