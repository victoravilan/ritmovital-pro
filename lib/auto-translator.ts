"use client"

export type Language = 'es' | 'en' | 'ca' | 'fr' | 'ru' | 'it'

// Cache para evitar traducir el mismo texto múltiples veces
const translationCache: Record<string, Record<Language, string>> = {}

// Mapeo de códigos de idioma para LibreTranslate
const languageMap: Record<Language, string> = {
  es: 'es',
  en: 'en',
  ca: 'ca', 
  fr: 'fr',
  ru: 'ru',
  it: 'it'
}

export async function translateText(text: string, targetLanguage: Language): Promise<string> {
  // Si el idioma objetivo es español, devolver el texto original
  if (targetLanguage === 'es') {
    return text
  }

  // Verificar cache primero
  const cacheKey = text.trim()
  if (translationCache[cacheKey] && translationCache[cacheKey][targetLanguage]) {
    return translationCache[cacheKey][targetLanguage]
  }

  try {
    // Usar LibreTranslate API gratuita
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'es',
        target: languageMap[targetLanguage],
        format: 'text'
      })
    })

    if (!response.ok) {
      throw new Error('Translation failed')
    }

    const data = await response.json()
    const translatedText = data.translatedText || text

    // Guardar en cache
    if (!translationCache[cacheKey]) {
      translationCache[cacheKey] = {} as Record<Language, string>
    }
    translationCache[cacheKey][targetLanguage] = translatedText

    return translatedText
  } catch (error) {
    console.error('Translation error:', error)
    // En caso de error, devolver el texto original
    return text
  }
}

// Hook para usar traducciones automáticas
export function useAutoTranslate() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es')

  // Cargar idioma guardado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('biorhythm-pro-language') as Language
      if (saved && Object.keys(languageMap).includes(saved)) {
        setCurrentLanguage(saved)
      }
    }
  }, [])

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language)
    if (typeof window !== 'undefined') {
      localStorage.setItem('biorhythm-pro-language', language)
    }
  }

  const t = async (text: string): Promise<string> => {
    return await translateText(text, currentLanguage)
  }

  return {
    currentLanguage,
    changeLanguage,
    t,
    translateText: (text: string) => translateText(text, currentLanguage)
  }
}

// Componente para texto auto-traducido
import { useState, useEffect } from 'react'

interface AutoTranslateTextProps {
  text: string
  language: Language
  className?: string
}

export function AutoTranslateText({ text, language, className }: AutoTranslateTextProps) {
  const [translatedText, setTranslatedText] = useState(text)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const translate = async () => {
      if (language === 'es') {
        setTranslatedText(text)
        return
      }

      setIsLoading(true)
      try {
        const translated = await translateText(text, language)
        setTranslatedText(translated)
      } catch (error) {
        console.error('Translation failed:', error)
        setTranslatedText(text)
      } finally {
        setIsLoading(false)
      }
    }

    translate()
  }, [text, language])

  if (isLoading) {
    return <span className={className}>...</span>
  }

  return <span className={className}>{translatedText}</span>
}