"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

// Traducciones completas para todos los idiomas
const TRANSLATIONS = {
  es: {}, // Español es el idioma base
  en: {
    // Títulos principales
    "¡Bienvenido a RitmoVital!": "Welcome to RitmoVital!",
    "Descubre tus ciclos naturales y optimiza tu vida diaria": "Discover your natural cycles and optimize your daily life",
    "¡Hola, {name}!": "Hello, {name}!",
    "Agregar y comparar personas": "Add and compare people",
    "Comparar": "Compare",
    "Estado General": "General State",
    
    // Biorritmos
    "Físico": "Physical",
    "Emocional": "Emotional", 
    "Intelectual": "Intellectual",
    "Energía física moderada": "Moderate physical energy",
    "Estado emocional sensible": "Sensitive emotional state",
    "Necesitas descanso mental": "You need mental rest",
    
    // Gráfico
    "Gráfico de Biorritmos (31 días)": "Biorhythm Chart (31 days)",
    "15 días antes y 15 días después de la fecha seleccionada": "15 days before and 15 days after the selected date",
    "Hoy": "Today",
    "Fecha seleccionada": "Selected date",
    "Información para": "Information for",
    
    // Recomendaciones
    "Recomendaciones Detalladas": "Detailed Recommendations",
    "Consejos personalizados basados en tu estado actual y perfil": "Personalized advice based on your current state and profile",
    "Nutrición": "Nutrition",
    "Ejercicio": "Exercise", 
    "Creatividad": "Creativity",
    "Bienestar": "Wellness",
    
    // Nutrición detallada
    "Alimentación Recomendada": "Recommended Nutrition",
    "Alimentos Ideales para Hoy": "Ideal Foods for Today",
    "Horarios y Combinaciones": "Schedules and Combinations",
    "Proteínas magras:": "Lean proteins:",
    "Pollo, pescado, tofu y legumbres para mantener energía sostenida": "Chicken, fish, tofu and legumes to maintain sustained energy",
    "Frutas cítricas:": "Citrus fruits:",
    "Naranjas, limones y pomelos ricos en vitamina C para vitalidad": "Oranges, lemons and grapefruits rich in vitamin C for vitality",
    "Frutos secos:": "Nuts:",
    "Almendras, nueces y pistachos para mejorar la concentración": "Almonds, walnuts and pistachios to improve concentration",
    "Vegetales verdes:": "Green vegetables:",
    "Espinacas, brócoli y kale cargados de nutrientes esenciales": "Spinach, broccoli and kale loaded with essential nutrients",
    "Granos integrales:": "Whole grains:",
    "Quinoa, avena y arroz integral para energía de liberación lenta": "Quinoa, oats and brown rice for slow-release energy",
    "Grasas saludables:": "Healthy fats:",
    "Aguacate, aceite de oliva y semillas de chía para función cerebral": "Avocado, olive oil and chia seeds for brain function",
    "Hidratación:": "Hydration:",
    "8-10 vasos de agua, tés verdes y agua con limón para optimizar metabolismo": "8-10 glasses of water, green teas and lemon water to optimize metabolism",
    
    // Horarios de comida
    "Desayuno (7-9 AM):": "Breakfast (7-9 AM):",
    "Combina proteínas con carbohidratos complejos. Ejemplo: avena con frutos rojos y almendras.": "Combine proteins with complex carbohydrates. Example: oats with berries and almonds.",
    "Media mañana (10-11 AM):": "Mid-morning (10-11 AM):",
    "Fruta fresca con un puñado de nueces para mantener energía estable.": "Fresh fruit with a handful of nuts to maintain stable energy.",
    "Almuerzo (12-2 PM):": "Lunch (12-2 PM):",
    "Plato balanceado: 50% vegetales, 25% proteína magra, 25% granos integrales.": "Balanced plate: 50% vegetables, 25% lean protein, 25% whole grains.",
    "Merienda (3-4 PM):": "Snack (3-4 PM):",
    "Yogur griego con semillas o hummus con vegetales crudos.": "Greek yogurt with seeds or hummus with raw vegetables.",
    "Cena (6-8 PM):": "Dinner (6-8 PM):",
    "Ligera pero nutritiva, evita carbohidratos pesados 3 horas antes de dormir.": "Light but nutritious, avoid heavy carbohydrates 3 hours before sleep.",
    "Suplementos:": "Supplements:",
    "Considera vitamina D, omega-3 y magnesio según tu estado energético actual.": "Consider vitamin D, omega-3 and magnesium according to your current energy state."
  },
  ru: {
    // Títulos principales
    "¡Bienvenido a RitmoVital!": "Добро пожаловать в RitmoVital!",
    "Descubre tus ciclos naturales y optimiza tu vida diaria": "Откройте свои природные циклы и оптимизируйте повседневную жизнь",
    "¡Hola, {name}!": "Привет, {name}!",
    "Agregar y comparar personas": "Добавить и сравнить людей",
    "Comparar": "Сравнить",
    "Estado General": "Общее Состояние",
    
    // Biorritmos
    "Físico": "Физический",
    "Emocional": "Эмоциональный", 
    "Intelectual": "Интеллектуальный",
    "Energía física moderada": "Умеренная физическая энергия",
    "Estado emocional sensible": "Чувствительное эмоциональное состояние",
    "Necesitas descanso mental": "Вам нужен умственный отдых",
    
    // Gráfico
    "Gráfico de Biorritmos (31 días)": "График Биоритмов (31 день)",
    "15 días antes y 15 días después de la fecha seleccionada": "15 дней до и 15 дней после выбранной даты",
    "Hoy": "Сегодня",
    "Fecha seleccionada": "Выбранная дата",
    "Información para": "Информация для",
    
    // Recomendaciones
    "Recomendaciones Detalladas": "Подробные Рекомендации",
    "Consejos personalizados basados en tu estado actual y perfil": "Персонализированные советы на основе вашего текущего состояния и профиля",
    "Nutrición": "Питание",
    "Ejercicio": "Упражнения", 
    "Creatividad": "Творчество",
    "Bienestar": "Благополучие"
  }
}

type Language = 'es' | 'en' | 'ru'

const SimpleTranslationContext = createContext<{
  currentLanguage: Language
  changeLanguage: (lang: Language) => void
  t: (text: string) => string
}>({
  currentLanguage: 'es',
  changeLanguage: () => {},
  t: (text: string) => text
})

export function SimpleTranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('biorhythm-pro-language') as Language
      if (saved && ['es', 'en', 'ru'].includes(saved)) {
        setCurrentLanguage(saved)
      }
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('biorhythm-pro-language', lang)
    }
  }

  const t = (text: string): string => {
    if (currentLanguage === 'es') return text
    
    const translations = TRANSLATIONS[currentLanguage]
    if (!translations) return text
    
    // Buscar traducción exacta
    if (translations[text]) {
      return translations[text]
    }
    
    // Buscar traducción parcial (para textos con variables)
    for (const [key, value] of Object.entries(translations)) {
      if (key.includes('{') && text.includes(key.split('{')[0])) {
        return value
      }
    }
    
    return text
  }

  return (
    <SimpleTranslationContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </SimpleTranslationContext.Provider>
  )
}

export function useSimpleTranslations() {
  return useContext(SimpleTranslationContext)
}