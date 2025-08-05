"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Brain, Heart } from "lucide-react"
import { ComparisonType } from "../lib/multi-biorhythm-calculator"

interface ComparisonSelectorProps {
  selectedType: ComparisonType
  onTypeChange: (type: ComparisonType) => void
}

const comparisonOptions = [
  {
    type: 'physical' as ComparisonType,
    label: 'Físico',
    icon: Activity,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    description: 'Energía, resistencia y vitalidad física'
  },
  {
    type: 'emotional' as ComparisonType,
    label: 'Emocional',
    icon: Heart,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    description: 'Estado de ánimo, sensibilidad y estabilidad emocional'
  },
  {
    type: 'intellectual' as ComparisonType,
    label: 'Intelectual',
    icon: Brain,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    description: 'Capacidad mental, concentración y claridad de pensamiento'
  }
]

export default function ComparisonSelector({ selectedType, onTypeChange }: ComparisonSelectorProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-center">
          Selecciona el Tipo de Comparación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {comparisonOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedType === option.type

            return (
              <Button
                key={option.type}
                variant="outline"
                onClick={() => onTypeChange(option.type)}
                className={`h-auto p-4 flex flex-col items-center space-y-3 transition-all duration-200 ${isSelected
                  ? `${option.bgColor} ${option.borderColor} border-2`
                  : 'bg-slate-700/50 border-slate-600 hover:bg-slate-600/50'
                  }`}
              >
                <Icon
                  className={`h-8 w-8 ${isSelected ? option.color : 'text-slate-400'}`}
                />
                <div className="text-center">
                  <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {option.label}
                  </h3>
                  <p className={`text-xs mt-1 ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                    {option.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </Button>
            )
          })}
        </div>

        {/* Selected type info */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
          <h4 className="font-semibold text-white mb-2">
            Comparando: {comparisonOptions.find(o => o.type === selectedType)?.label}
          </h4>
          <p className="text-sm text-slate-300">
            {comparisonOptions.find(o => o.type === selectedType)?.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}