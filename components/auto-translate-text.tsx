"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from '@/lib/translations-provider'

interface AutoTranslateTextProps {
  children: string
  className?: string
  fallback?: string
}

export default function AutoTranslateText({ children, className, fallback }: AutoTranslateTextProps) {
  const { autoTranslate, currentLanguage } = useTranslations()
  const [translatedText, setTranslatedText] = useState(children)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const translate = async () => {
      if (currentLanguage === 'es') {
        setTranslatedText(children)
        return
      }

      setIsLoading(true)
      try {
        const translated = await autoTranslate(children)
        setTranslatedText(translated)
      } catch (error) {
        console.error('Auto-translation failed:', error)
        setTranslatedText(fallback || children)
      } finally {
        setIsLoading(false)
      }
    }

    translate()
  }, [children, currentLanguage, autoTranslate, fallback])

  if (isLoading) {
    return <span className={className}>...</span>
  }

  return <span className={className}>{translatedText}</span>
}

// Hook para usar traducción automática directamente
export function useAutoTranslate() {
  const { autoTranslate, currentLanguage } = useTranslations()
  
  const translateAsync = async (text: string): Promise<string> => {
    if (currentLanguage === 'es') {
      return text
    }
    
    try {
      return await autoTranslate(text)
    } catch (error) {
      console.error('Auto-translation failed:', error)
      return text
    }
  }

  return {
    translate: translateAsync,
    currentLanguage
  }
}