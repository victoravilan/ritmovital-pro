"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Activity, Brain, Heart, TrendingUp, TrendingDown } from "lucide-react"
import { PersonBiorhythmData } from "../lib/multi-biorhythm-calculator"

interface PersonDetailsCardProps {
  personData: PersonBiorhythmData
  selectedDate?: Date
}

export default function PersonDetailsCard({ personData, selectedDate }: PersonDetailsCardProps) {
  const { profile, today, selectedDate: selectedDateData } = personData
  const isToday = !selectedDate || selectedDate.toDateString() === new Date().toDateString()
  const currentData = isToday ? today : selectedDateData || today

  const cycles = [
    {
      name: "Físico",
      value: currentData.physical,
      icon: Activity,
      color: "text-orange-400",
      bgColor: "[&>div]:bg-orange-400",
      description: getDescription(currentData.physical, "physical")
    },
    {
      name: "Emocional", 
      value: currentData.emotional,
      icon: Heart,
      color: "text-blue-400",
      bgColor: "[&>div]:bg-blue-400",
      description: getDescription(currentData.emotional, "emotional")
    },
    {
      name: "Intelectual",
      value: currentData.intellectual,
      icon: Brain,
      color: "text-green-400", 
      bgColor: "[&>div]:bg-green-400",
      description: getDescription(currentData.intellectual, "intellectual")
    }
  ]

  const overallScore = Math.round((currentData.physical + currentData.emotional + currentData.intellectual) / 3)

  function getDescription(value: number, type: "physical" | "emotional" | "intellectual"): string {
    if (type === "physical") {
      if (value > 70) return "Energía física excepcional"
      if (value > 30) return "Buena energía física"
      if (value > -30) return "Energía física moderada"
      if (value > -70) return "Energía física baja"
      return "Necesita descanso físico"
    }

    if (type === "emotional") {
      if (value > 70) return "Estado emocional excelente"
      if (value > 30) return "Buen estado emocional"
      if (value > -30) return "Estado emocional estable"
      if (value > -70) return "Estado emocional sensible"
      return "Necesita cuidado emocional"
    }

    if (type === "intellectual") {
      if (value > 70) return "Capacidad mental excepcional"
      if (value > 30) return "Buena capacidad mental"
      if (value > -30) return "Capacidad mental moderada"
      if (value > -70) return "Capacidad mental baja"
      return "Necesita descanso mental"
    }

    return "Estado normal"
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2" style={{ borderColor: profile.color }}>
              <AvatarFallback 
                className="text-white font-bold"
                style={{ backgroundColor: profile.color }}
              >
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-white">{profile.name}</CardTitle>
              <p className="text-sm text-slate-400">
                {new Date(profile.birthDate).toLocaleDateString("es-ES")}
                {profile.birthPlace && ` • ${profile.birthPlace}`}
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400 mb-1">
              {overallScore}%
            </div>
            <div className="text-xs text-slate-400">General</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cycles.map((cycle) => {
          const Icon = cycle.icon
          const trend = cycle.value >= 0 ? TrendingUp : TrendingDown
          const TrendIcon = trend
          
          return (
            <div key={cycle.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-4 w-4 ${cycle.color}`} />
                  <span className="font-medium text-white">{cycle.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendIcon className={`h-4 w-4 ${cycle.value >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <span className={`font-bold ${cycle.color}`}>
                    {cycle.value}%
                  </span>
                </div>
              </div>
              <Progress 
                value={Math.abs(cycle.value)} 
                className={`h-2 ${cycle.bgColor}`}
              />
              <p className="text-xs text-slate-400">{cycle.description}</p>
            </div>
          )
        })}
        
        {/* Date info */}
        <div className="pt-2 border-t border-slate-600">
          <p className="text-xs text-slate-500 text-center">
            {isToday ? "Estado actual" : `Estado para ${selectedDate?.toLocaleDateString("es-ES")}`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}