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
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with Spanish translations immediately
  useEffect(() => {
    const initTranslations = async () => {
      setIsLoading(true)
      try {
        console.log('Loading Spanish translations...')
        const response = await fetch('/locales/es.json')
        if (!response.ok) {
          throw new Error('Failed to load Spanish translations')
        }
        const data = await response.json()
        console.log('Spanish translations loaded:', data)
        translationsCache['es'] = data
        setTranslations(data)
        
        // Check for saved language
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('biorhythm-pro-language') as Language
          if (saved && saved !== 'es' && Object.keys(LANGUAGES).includes(saved)) {
            setCurrentLanguage(saved)
          }
        }
      } catch (error) {
        console.error('Error loading translations:', error)
        // Set fallback translations
        setTranslations({
          welcome: { title: "¡Bienvenido a RitmoVital!", description: "Descubre tus ciclos naturales" },
          fields: { name: "Nombre", birth_place: "Lugar de Nacimiento", ethnicity: "Origen Étnico" }
        })
      } finally {
        setIsLoading(false)
      }
    }

    initTranslations()
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
      console.log('Translations not loaded yet:', { isLoading, translations })
      return fallback || key
    }

    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.log('Translation key not found:', key, 'in', translations)
        return fallback || key
      }
    }
    
    const result = typeof value === 'string' ? value : fallback || key
    console.log('Translation result:', key, '->', result)
    return result
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