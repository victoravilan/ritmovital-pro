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
import { useTranslations } from "@/lib/translations-provider"
import LanguageSelector from "@/components/ui/language-selector"

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<Partial<UserProfile>>({})
  const { t } = useTranslations()

  const steps = [
    { title: t('welcome.title'), description: t('welcome.description'), icon: <div className="text-6xl">🌟</div>, },
    { title: t('personal.title'), description: t('personal.description'), icon: <User className="h-12 w-12 text-amber-400" />, },
    { title: t('birthdate.title'), description: t('birthdate.description'), icon: <Calendar className="h-12 w-12 text-blue-400" />, },
    { title: t('location.title'), description: t('location.description'), icon: <Globe className="h-12 w-12 text-green-400" />, },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      if (profile.name && profile.birthDate && profile.birthPlace && profile.ethnicity) {
        onComplete(profile as UserProfile)
      } else {
        alert(t('validation.complete_fields'));
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative">
      {/* Language Selector in top right corner */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>
      
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
              <p className="text-slate-300">{t('welcome.explanation')}</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-orange-400"><div className="font-semibold">{t('cycles.physical')}</div><div>{t('cycles.physical_days')}</div></div>
                <div className="text-blue-400"><div className="font-semibold">{t('cycles.emotional')}</div><div>{t('cycles.emotional_days')}</div></div>
                <div className="text-green-400"><div className="font-semibold">{t('cycles.intellectual')}</div><div>{t('cycles.intellectual_days')}</div></div>
              </div>
            </div>
          )}
          {step === 1 && <div><Label htmlFor="name" className="text-white">{t('fields.name')}</Label><Input id="name" placeholder={t('fields.name_placeholder')} value={profile.name || ""} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" /></div>}
          {step === 2 && <><div><Label htmlFor="birthDate" className="text-white font-semibold">{t('fields.birth_date')}</Label><Input id="birthDate" type="date" value={profile.birthDate || ""} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-black font-semibold" style={{colorScheme: 'light'}} /></div><div><Label htmlFor="birthTime" className="text-white font-semibold">{t('fields.birth_time')}</Label><Input id="birthTime" type="time" value={profile.birthTime || ""} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-black font-semibold" style={{colorScheme: 'light'}} /></div></>}
          {step === 3 && <><div><Label htmlFor="birthPlace" className="text-white">{t('fields.birth_place')}</Label><Input id="birthPlace" placeholder={t('fields.birth_place_placeholder')} value={profile.birthPlace || ""} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" /></div><div><Label htmlFor="ethnicity" className="text-white">{t('fields.ethnicity')}</Label><Select onValueChange={handleSelectChange} value={profile.ethnicity}><SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue placeholder={t('fields.ethnicity_placeholder')} /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-600 text-white"><SelectItem value="latino">{t('ethnicity.latino')}</SelectItem><SelectItem value="europeo">{t('ethnicity.european')}</SelectItem><SelectItem value="asiatico">{t('ethnicity.asian')}</SelectItem><SelectItem value="africano">{t('ethnicity.african')}</SelectItem><SelectItem value="otro">{t('ethnicity.other')}</SelectItem></SelectContent></Select></div></>}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={step === 0} className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">{t('buttons.previous')}</Button>
            <Button onClick={handleNext} className="bg-amber-500 hover:bg-amber-600 text-slate-900">{step === steps.length - 1 ? t('buttons.start') : t('buttons.next')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}