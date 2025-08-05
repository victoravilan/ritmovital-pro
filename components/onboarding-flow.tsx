"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Calendar, User, Globe } from "lucide-react"
import type { UserProfile } from "@/lib/biorhythm-calculator"

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<Partial<UserProfile>>({})

  const steps = [
    { title: "¡Bienvenido a RitmoVital!", description: "Descubre tus ciclos naturales y optimiza tu vida diaria", icon: <div className="text-6xl">🌟</div>, },
    { title: "Información Personal", description: "Necesitamos algunos datos básicos para calcular tus biorritmos", icon: <User className="h-12 w-12 text-amber-400" />, },
    { title: "Fecha de Nacimiento", description: "La fecha exacta es crucial para calcular tus ciclos personales", icon: <Calendar className="h-12 w-12 text-blue-400" />, },
    { title: "Origen y Ubicación", description: "Esto nos ayuda a personalizar las recomendaciones culturales", icon: <Globe className="h-12 w-12 text-green-400" />, },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      if (profile.name && profile.birthDate && profile.birthPlace && profile.ethnicity) {
        onComplete(profile as UserProfile)
      } else {
        alert("Por favor, completa todos los campos requeridos para continuar.");
      }
    }
  }

  const handlePrevious = () => {
    if (step > 0) { setStep(step - 1) }
  }

  const progress = ((step + 1) / steps.length) * 100

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setProfile({ ...profile, ethnicity: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{steps[step].icon}</div>
          <CardTitle className="text-white">{steps[step].title}</CardTitle>
          <CardDescription className="text-slate-300">{steps[step].description}</CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="text-center space-y-4">
              <p className="text-slate-300">Los biorritmos son ciclos naturales que influyen en tu energía física, estado emocional y capacidad intelectual.</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-orange-400"><div className="font-semibold">Físico</div><div>23 días</div></div>
                <div className="text-blue-400"><div className="font-semibold">Emocional</div><div>28 días</div></div>
                <div className="text-green-400"><div className="font-semibold">Intelectual</div><div>33 días</div></div>
              </div>
            </div>
          )}
          {step === 1 && <div><Label htmlFor="name" className="text-white">Nombre</Label><Input id="name" placeholder="Tu nombre" value={profile.name || ""} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" /></div>}
          {step === 2 && <><div><Label htmlFor="birthDate" className="text-white">Fecha de Nacimiento</Label><Input id="birthDate" type="date" value={profile.birthDate || ""} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" /></div><div><Label htmlFor="birthTime" className="text-white">Hora de Nacimiento (opcional)</Label><Input id="birthTime" type="time" value={profile.birthTime || ""} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" /></div></>}
          {step === 3 && <><div><Label htmlFor="birthPlace" className="text-white">Lugar de Nacimiento</Label><Input id="birthPlace" placeholder="Ciudad, País" value={profile.birthPlace || ""} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" /></div><div><Label htmlFor="ethnicity" className="text-white">Origen Étnico</Label><Select onValueChange={handleSelectChange} value={profile.ethnicity}><SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue placeholder="Selecciona tu origen" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-600 text-white"><SelectItem value="latino">Latino/Hispano</SelectItem><SelectItem value="europeo">Europeo</SelectItem><SelectItem value="asiatico">Asiático</SelectItem><SelectItem value="africano">Africano</SelectItem><SelectItem value="otro">Otro</SelectItem></SelectContent></Select></div></>}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={step === 0} className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">Anterior</Button>
            <Button onClick={handleNext} className="bg-amber-500 hover:bg-amber-600 text-slate-900">{step === steps.length - 1 ? "Comenzar" : "Siguiente"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}