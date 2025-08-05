"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type Language = 'es' | 'en' | 'ca' | 'fr' | 'ru' | 'it'

export const LANGUAGES = {
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇺🇸' },
  ca: { name: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
  fr: { name: 'Français', flag: '🇫🇷' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  it: { name: 'Italiano', flag: '🇮🇹' }
} as const

interface TranslationData {
  [key: string]: any
}

interface TranslationsContextType {
  currentLanguage: Language
  changeLanguage: (language: Language) => void
  t: (key: string, fallback?: string) => string
  isLoading: boolean
  getCurrentLanguageInfo: () => typeof LANGUAGES[Language]
  availableLanguages: typeof LANGUAGES
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined)

let translationsCache: Record<Language, TranslationData> = {} as Record<Language, TranslationData>

export function TranslationsProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es')
  const [translations, setTranslations] = useState<TranslationData>({})
  const [isLoading, setIsLoading] = useState(true)

  // Initialize translations
  useEffect(() => {
    const loadInitialTranslations = async () => {
      try {
        // Load Spanish translations first
        const spanishResponse = await fetch('/locales/es.json')
        const spanishData = await spanishResponse.json()
        translationsCache['es'] = spanishData
        setTranslations(spanishData)
        
        // Check for saved language preference
        if (typeof window !== 'undefined') {
          const savedLanguage = localStorage.getItem('biorhythm-pro-language') as Language
          if (savedLanguage && savedLanguage !== 'es' && Object.keys(LANGUAGES).includes(savedLanguage)) {
            // Load the saved language
            try {
              const savedResponse = await fetch(`/locales/${savedLanguage}.json`)
              const savedData = await savedResponse.json()
              translationsCache[savedLanguage] = savedData
              setTranslations(savedData)
              setCurrentLanguage(savedLanguage)
            } catch (error) {
              console.error(`Error loading saved language ${savedLanguage}:`, error)
              // Keep Spanish as fallback
            }
          }
        }
      } catch (error) {
        console.error('Error loading initial translations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialTranslations()
  }, [])

  // Load translations when language changes
  useEffect(() => {
    if (isLoading) return // Don't load during initial load

    const loadLanguageTranslations = async () => {
      try {
        // Check cache first
        if (translationsCache[currentLanguage]) {
          setTranslations(translationsCache[currentLanguage])
          return
        }

        // Load from file
        const response = await fetch(`/locales/${currentLanguage}.json`)
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${currentLanguage}`)
        }
        
        const data = await response.json()
        translationsCache[currentLanguage] = data
        setTranslations(data)
      } catch (error) {
        console.error('Error loading language translations:', error)
        // Fallback to Spanish
        if (translationsCache['es']) {
          setTranslations(translationsCache['es'])
        }
      }
    }

    loadLanguageTranslations()
  }, [currentLanguage, isLoading])

  // Save language preference and update state immediately
  const changeLanguage = useCallback((newLanguage: Language) => {
    setCurrentLanguage(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('biorhythm-pro-language', newLanguage)
    }
  }, [])

  // Translation function with nested key support
  const t = useCallback((key: string, fallback?: string): string => {
    // If translations are still loading, return fallback or key
    if (isLoading || !translations || Object.keys(translations).length === 0) {
      return fallback || key
    }

    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return fallback || key
      }
    }
    
    return typeof value === 'string' ? value : fallback || key
  }, [translations, isLoading])

  // Get current language info
  const getCurrentLanguageInfo = useCallback(() => {
    return LANGUAGES[currentLanguage]
  }, [currentLanguage])

  const value: TranslationsContextType = {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    getCurrentLanguageInfo,
    availableLanguages: LANGUAGES
  }

  return (
    <TranslationsContext.Provider value={value}>
      {isLoading ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-white text-lg">Cargando...</div>
        </div>
      ) : (
        children
      )}
    </TranslationsContext.Provider>
  )
}

export function useTranslations() {
  const context = useContext(TranslationsContext)
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider')
  }
  return context
}