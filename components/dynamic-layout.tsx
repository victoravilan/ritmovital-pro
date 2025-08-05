"use client"

import { useEffect } from 'react'
import { useTranslations } from '@/lib/use-translations'

interface DynamicLayoutProps {
  children: React.ReactNode
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
  const { t, currentLanguage, isLoading } = useTranslations()

  useEffect(() => {
    if (!isLoading) {
      // Update document title
      document.title = t('app.title')
      
      // Update HTML lang attribute
      document.documentElement.lang = currentLanguage
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', t('app.description'))
      }
      
      // Update apple-mobile-web-app-title
      const appleMobileTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]')
      if (appleMobileTitle) {
        appleMobileTitle.setAttribute('content', t('app.shortTitle'))
      }
    }
  }, [t, currentLanguage, isLoading])

  return <>{children}</>
}