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

    let translationCount = 0
    const maxTranslations = 5 // Máximo 5 ejecuciones

    const translateAllText = async () => {
      if (translationCount >= maxTranslations) return
      
      setIsTranslating(true)
      translationCount++
      
      try {
        console.log(`🔄 Ejecutando traducción global #${translationCount}`)
        
        // Encontrar todos los elementos de texto en la página (más agresivo)
        const textNodes = getTextNodesAggressive(document.body)
        
        let translatedNodes = 0
        
        for (const node of textNodes) {
          const originalText = node.textContent?.trim()
          if (!originalText || originalText.length < 2) continue
          
          // Verificar si es un texto que debe traducirse (más permisivo)
          if (shouldTranslateAggressive(originalText)) {
            try {
              const translatedText = await translateText(originalText, currentLanguage)
              if (translatedText !== originalText) {
                node.textContent = translatedText
                translatedNodes++
              }
            } catch (error) {
              console.error('Translation failed for:', originalText, error)
            }
          }
        }
        
        console.log(`✅ Traducción #${translationCount} completada: ${translatedNodes} nodos traducidos`)
        
        // Si es la primera ejecución, programar más ejecuciones
        if (translationCount === 1) {
          // Segunda ejecución después de 2 segundos (para contenido dinámico)
          setTimeout(translateAllText, 2000)
          // Tercera ejecución después de 5 segundos (para contenido tardío)
          setTimeout(translateAllText, 5000)
          // Cuarta ejecución después de 10 segundos (para asegurar todo)
          setTimeout(translateAllText, 10000)
        }
        
      } catch (error) {
        console.error('Global translation failed:', error)
      } finally {
        // Solo ocultar el indicador después de la última ejecución
        if (translationCount >= 3) {
          setIsTranslating(false)
        }
      }
    }

    // Ejecutar primera traducción inmediatamente
    translateAllText()

    // Observer para detectar cambios en el DOM y traducir contenido nuevo
    const observer = new MutationObserver((mutations) => {
      let hasNewText = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
              hasNewText = true
            }
          })
        }
      })
      
      if (hasNewText && translationCount < maxTranslations) {
        console.log('🔍 Detectado nuevo contenido, ejecutando traducción...')
        setTimeout(translateAllText, 500)
      }
    })

    // Observar cambios en todo el documento
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })

    return () => {
      observer.disconnect()
    }
  }, [currentLanguage])

  return { isTranslating }
}

// Función AGRESIVA para obtener todos los nodos de texto (incluye más elementos)
function getTextNodesAggressive(element: Element): Text[] {
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Excluir solo scripts y estilos críticos
        const parent = node.parentElement
        if (!parent) return NodeFilter.FILTER_REJECT
        
        const tagName = parent.tagName.toLowerCase()
        if (['script', 'style', 'noscript', 'code'].includes(tagName)) {
          return NodeFilter.FILTER_REJECT
        }
        
        // Incluir más tipos de texto (más permisivo)
        const text = node.textContent?.trim()
        if (!text || text.length < 1) {
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

// Función para obtener todos los nodos de texto (versión original)
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

// Función AGRESIVA para determinar si un texto debe traducirse (más permisiva)
function shouldTranslateAggressive(text: string): boolean {
  // No traducir si es solo números simples
  if (/^\d+%?$/.test(text)) return false
  
  // No traducir URLs
  if (text.startsWith('http')) return false
  
  // No traducir si es muy corto (solo 1 carácter)
  if (text.length < 2) return false
  
  // No traducir si contiene solo símbolos especiales
  if (/^[^\w\s\u00C0-\u017F]+$/.test(text)) return false
  
  // No traducir nombres propios conocidos (lista reducida)
  const properNouns = ['RitmoVital', 'GitHub', 'Netlify', 'API']
  if (properNouns.some(name => text.includes(name))) return false
  
  // TRADUCIR TODO LO DEMÁS (más agresivo)
  return true
}

// Función para determinar si un texto debe traducirse (versión original)
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