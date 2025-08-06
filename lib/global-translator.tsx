"use client"

import React, { useEffect, useState } from 'react'
import { useTranslations } from './translations-provider'
import { translateText } from './auto-translator'

// Cache global para traducciones
const globalTranslationCache: Record<string, Record<string, string>> = {}

// Función para traducir automáticamente todo el contenido de texto
export function useGlobalTranslation() {
  const { currentLanguage } = useTranslations()
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    if (currentLanguage === 'es') return
    if (typeof window === 'undefined') return // Solo ejecutar en el cliente

    const translateAllText = async () => {
      setIsTranslating(true)
      
      try {
        // Encontrar todos los elementos de texto en la página
        const textNodes = getTextNodes(document.body)
        
        for (const node of textNodes) {
          const originalText = node.textContent?.trim()
          if (!originalText || originalText.length < 2) continue
          
          // Verificar si es un texto que debe traducirse (no números, fechas, etc.)
          if (shouldTranslate(originalText)) {
            try {
              const translatedText = await translateText(originalText, currentLanguage)
              if (translatedText !== originalText) {
                node.textContent = translatedText
              }
            } catch (error) {
              console.error('Translation failed for:', originalText, error)
            }
          }
        }
      } catch (error) {
        console.error('Global translation failed:', error)
      } finally {
        setIsTranslating(false)
      }
    }

    // Ejecutar traducción después de un pequeño delay para que el DOM se cargue
    const timer = setTimeout(translateAllText, 1000)
    return () => clearTimeout(timer)
  }, [currentLanguage])

  return { isTranslating }
}

// Función para obtener todos los nodos de texto
function getTextNodes(element: Element): Text[] {
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Excluir scripts, estilos, y elementos ocultos
        const parent = node.parentElement
        if (!parent) return NodeFilter.FILTER_REJECT
        
        const tagName = parent.tagName.toLowerCase()
        if (['script', 'style', 'noscript'].includes(tagName)) {
          return NodeFilter.FILTER_REJECT
        }
        
        // Solo nodos con texto visible
        const text = node.textContent?.trim()
        if (!text || text.length < 2) {
          return NodeFilter.FILTER_REJECT
        }
        
        return NodeFilter.FILTER_ACCEPT
      }
    }
  )

  let node
  while (node = walker.nextNode()) {
    textNodes.push(node as Text)
  }
  
  return textNodes
}

// Función para determinar si un texto debe traducirse
function shouldTranslate(text: string): boolean {
  // No traducir si es solo números
  if (/^\d+%?$/.test(text)) return false
  
  // No traducir fechas
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(text)) return false
  
  // No traducir URLs
  if (text.startsWith('http')) return false
  
  // No traducir si es muy corto
  if (text.length < 3) return false
  
  // No traducir si contiene solo símbolos
  if (/^[^\w\s]+$/.test(text)) return false
  
  // No traducir nombres propios conocidos
  const properNouns = ['RitmoVital', 'Victor', 'Avilan', 'GitHub', 'Netlify']
  if (properNouns.some(name => text.includes(name))) return false
  
  return true
}

// Componente wrapper que aplica traducción global
export function GlobalTranslationWrapper({ children }: { children: React.ReactNode }) {
  const { isTranslating } = useGlobalTranslation()
  
  return (
    <div className={isTranslating ? 'translating' : ''}>
      {children}
      {isTranslating && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Traduciendo...</span>
          </div>
        </div>
      )}
    </div>
  )
}