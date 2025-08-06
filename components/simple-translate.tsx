"use client"

import { useSimpleTranslations } from '@/lib/simple-translations'

interface SimpleTranslateProps {
  children: string
  className?: string
}

export default function SimpleTranslate({ children, className }: SimpleTranslateProps) {
  const { t } = useSimpleTranslations()
  
  return <span className={className}>{t(children)}</span>
}

// Hook para traducir texto directamente
export function useTranslate() {
  const { t } = useSimpleTranslations()
  return t
}