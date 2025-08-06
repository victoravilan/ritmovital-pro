"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTranslations } from "@/lib/translations-provider"

interface TranslatedRecommendationsProps {
  type: 'nutrition' | 'exercise' | 'creativity' | 'wellness'
  physicalState: number
  intellectualState: number
}

export default function TranslatedRecommendations({ type, physicalState, intellectualState }: TranslatedRecommendationsProps) {
  const { t } = useTranslations()

  if (type === 'nutrition') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-amber-400">{t('recommendations.nutrition.title', 'Alimentación Recomendada')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-700/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 text-white">{t('recommendations.nutrition.idealFoods', 'Alimentos Ideales para Hoy')}</h4>
              <ul className="text-sm space-y-2 text-white">
                <li>• <strong>{t('recommendations.nutrition.proteins', 'Proteínas magras:')}</strong> {t('recommendations.nutrition.proteinsDesc', 'Pollo, pescado, tofu y legumbres para mantener energía sostenida')}</li>
                <li>• <strong>{t('recommendations.nutrition.fruits', 'Frutas cítricas:')}</strong> {t('recommendations.nutrition.fruitsDesc', 'Naranjas, limones y pomelos ricos en vitamina C para vitalidad')}</li>
                <li>• <strong>{t('recommendations.nutrition.nuts', 'Frutos secos:')}</strong> {t('recommendations.nutrition.nutsDesc', 'Almendras, nueces y pistachos para mejorar la concentración')}</li>
                <li>• <strong>{t('recommendations.nutrition.vegetables', 'Vegetales verdes:')}</strong> {t('recommendations.nutrition.vegetablesDesc', 'Espinacas, brócoli y kale cargados de nutrientes esenciales')}</li>
                <li>• <strong>{t('recommendations.nutrition.grains', 'Granos integrales:')}</strong> {t('recommendations.nutrition.grainsDesc', 'Quinoa, avena y arroz integral para energía de liberación lenta')}</li>
                <li>• <strong>{t('recommendations.nutrition.fats', 'Grasas saludables:')}</strong> {t('recommendations.nutrition.fatsDesc', 'Aguacate, aceite de oliva y semillas de chía para función cerebral')}</li>
                <li>• <strong>{t('recommendations.nutrition.hydration', 'Hidratación:')}</strong> {t('recommendations.nutrition.hydrationDesc', '8-10 vasos de agua, tés verdes y agua con limón para optimizar metabolismo')}</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-slate-700/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 text-white">{t('recommendations.nutrition.schedules', 'Horarios y Combinaciones')}</h4>
              <div className="text-sm space-y-2 text-white">
                <p><strong>{t('recommendations.nutrition.breakfast', 'Desayuno (7-9 AM):')}</strong> {t('recommendations.nutrition.breakfastDesc', 'Combina proteínas con carbohidratos complejos. Ejemplo: avena con frutos rojos y almendras.')}</p>
                <p><strong>{t('recommendations.nutrition.midMorning', 'Media mañana (10-11 AM):')}</strong> {t('recommendations.nutrition.midMorningDesc', 'Fruta fresca con un puñado de nueces para mantener energía estable.')}</p>
                <p><strong>{t('recommendations.nutrition.lunch', 'Almuerzo (12-2 PM):')}</strong> {t('recommendations.nutrition.lunchDesc', 'Plato balanceado: 50% vegetales, 25% proteína magra, 25% granos integrales.')}</p>
                <p><strong>{t('recommendations.nutrition.snack', 'Merienda (3-4 PM):')}</strong> {t('recommendations.nutrition.snackDesc', 'Yogur griego con semillas o hummus con vegetales crudos.')}</p>
                <p><strong>{t('recommendations.nutrition.dinner', 'Cena (6-8 PM):')}</strong> {t('recommendations.nutrition.dinnerDesc', 'Ligera pero nutritiva, evita carbohidratos pesados 3 horas antes de dormir.')}</p>
                <p><strong>{t('recommendations.nutrition.supplements', 'Suplementos:')}</strong> {t('recommendations.nutrition.supplementsDesc', 'Considera vitamina D, omega-3 y magnesio según tu estado energético actual.')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Para otros tipos, devolver contenido básico por ahora
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">{t(`recommendations.${type}.title`, 'Recomendaciones')}</h3>
      <Card className="bg-slate-700/50">
        <CardContent className="p-4">
          <p className="text-white">{t(`recommendations.${type}.content`, 'Contenido de recomendaciones personalizado según tu estado actual.')}</p>
        </CardContent>
      </Card>
    </div>
  )
}