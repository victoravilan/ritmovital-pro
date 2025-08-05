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
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize with Spanish translations and load saved language
  useEffect(() => {
    const initializeTranslations = async () => {
      try {
        // Always load Spanish first as fallback
        const spanishResponse = await fetch('/locales/es.json')
        const spanishData = await spanishResponse.json()
        translationsCache['es'] = spanishData
        
        // Check for saved language
        let targetLanguage: Language = 'es'
        if (typeof window !== 'undefined') {
          const savedLanguage = localStorage.getItem('biorhythm-pro-language') as Language
          if (savedLanguage && Object.keys(LANGUAGES).includes(savedLanguage)) {
            targetLanguage = savedLanguage
          } else {
            localStorage.setItem('biorhythm-pro-language', 'es')
          }
        }
        
        // Load target language if different from Spanish
        if (targetLanguage !== 'es') {
          try {
            const targetResponse = await fetch(`/locales/${targetLanguage}.json`)
            const targetData = await targetResponse.json()
            translationsCache[targetLanguage] = targetData
            setTranslations(targetData)
          } catch (error) {
            console.error(`Error loading ${targetLanguage} translations, using Spanish:`, error)
            setTranslations(spanishData)
            targetLanguage = 'es'
          }
        } else {
          setTranslations(spanishData)
        }
        
        setCurrentLanguage(targetLanguage)
        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing translations:', error)
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }

    initializeTranslations()
  }, [])

  // Load translations when language changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return

    const loadTranslations = async () => {
      setIsLoading(true)
      
      try {
        // Check cache first
        if (translationsCache[currentLanguage]) {
          setTranslations(translationsCache[currentLanguage])
          setIsLoading(false)
          return
        }

        // Load from file
        const response = await fetch(`/locales/${currentLanguage}.json`)
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${currentLanguage}`)
        }
        
        const data = await response.json()
        
        // Cache the translations
        translationsCache[currentLanguage] = data
        setTranslations(data)
      } catch (error) {
        console.error('Error loading translations:', error)
        // Fallback to Spanish if loading fails
        if (currentLanguage !== 'es' && translationsCache['es']) {
          setTranslations(translationsCache['es'])
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [currentLanguage, isInitialized])

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