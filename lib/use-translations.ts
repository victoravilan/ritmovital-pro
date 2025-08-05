"use client"

import { useState, useEffect, useCallback } from 'react'

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

let translationsCache: Record<Language, TranslationData> = {} as Record<Language, TranslationData>

export function useTranslations() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es')
  const [translations, setTranslations] = useState<TranslationData>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('biorhythm-pro-language') as Language
      if (savedLanguage && Object.keys(LANGUAGES).includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage)
      } else {
        // Set Spanish as default and save it
        setCurrentLanguage('es')
        localStorage.setItem('biorhythm-pro-language', 'es')
      }
    }
  }, [])

  // Load translations when language changes
  useEffect(() => {
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
        if (currentLanguage !== 'es') {
          try {
            const fallbackResponse = await fetch('/locales/es.json')
            const fallbackData = await fallbackResponse.json()
            translationsCache['es'] = fallbackData
            setTranslations(fallbackData)
          } catch (fallbackError) {
            console.error('Error loading fallback translations:', fallbackError)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [currentLanguage])

  // Save language preference
  const changeLanguage = useCallback((newLanguage: Language) => {
    setCurrentLanguage(newLanguage)
    localStorage.setItem('biorhythm-pro-language', newLanguage)
  }, [])

  // Translation function with nested key support
  const t = useCallback((key: string, fallback?: string): string => {
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
  }, [translations])

  // Get current language info
  const getCurrentLanguageInfo = useCallback(() => {
    return LANGUAGES[currentLanguage]
  }, [currentLanguage])

  return {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    getCurrentLanguageInfo,
    availableLanguages: LANGUAGES
  }
}