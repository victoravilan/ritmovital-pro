"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Activity, Brain, Heart, Utensils, Dumbbell, Palette, Smile, Info, Crown } from "lucide-react"
import OnboardingFlow from "@/components/onboarding-flow"
import BiorhythmChart from "@/components/ui/biorhythm-chart"
import DateSelector from "@/components/ui/date-selector"
import RecommendationsPanel from "@/components/recommendations-panel"
import DashboardSkeleton from "@/components/dashboard-skeleton"
import ProDashboard from "@/pro-version/pro-dashboard"
import {
  calculateBiorhythms,
  getBiorhythmState,
  type UserProfile,
  type BiorhythmData,
} from "@/lib/biorhythm-calculator"

export default function BiorhythmApp() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [biorhythmData, setBiorhythmData] = useState<BiorhythmData | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [showProVersion, setShowProVersion] = useState(false)

  useEffect(() => {
    // Check if user profile exists in localStorage
    const savedProfile = localStorage.getItem("biorhythm-profile")
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUserProfile(profile)
      setShowOnboarding(false)

      // Calculate biorhythms
      const data = calculateBiorhythms(new Date(profile.birthDate), selectedDate)
      setBiorhythmData(data)
    }
  }, [selectedDate])

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    localStorage.setItem("biorhythm-profile", JSON.stringify(profile))
    setShowOnboarding(false)

    // Calculate biorhythms
    const data = calculateBiorhythms(new Date(profile.birthDate), selectedDate)
    setBiorhythmData(data)
  }

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate)
    if (userProfile) {
      const data = calculateBiorhythms(new Date(userProfile.birthDate), newDate)
      setBiorhythmData(data)
    }
  }

  const MeditationTimer = () => {
    const [isActive, setIsActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds

    useEffect(() => {
      let interval: NodeJS.Timeout | null = null
      if (isActive && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((timeLeft) => timeLeft - 1)
        }, 1000)
      } else if (timeLeft === 0) {
        setIsActive(false)
      }
      return () => {
        if (interval) clearInterval(interval)
      }
    }, [isActive, timeLeft])

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleStart = () => {
      setIsActive(!isActive)
    }

    const handleReset = () => {
      setIsActive(false)
      setTimeLeft(600)
    }

    return (
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-400 mb-2">{formatTime(timeLeft)}</div>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleStart}
              variant="outline"
              className="bg-transparent border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900"
            >
              {isActive ? "Pausar" : "Iniciar"} Meditación
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-transparent border-slate-400 text-slate-400 hover:bg-slate-400 hover:text-slate-900"
            >
              Reiniciar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  if (!userProfile || !biorhythmData) {
    return <DashboardSkeleton />
  }

  // Show Pro version if selected
  if (showProVersion) {
    return (
      <ProDashboard 
        onBackToBasic={() => setShowProVersion(false)}
        initialUser={userProfile ? {
          name: userProfile.name,
          birthDate: userProfile.birthDate,
          birthPlace: userProfile.birthPlace
        } : undefined}
      />
    )
  }

  const state = getBiorhythmState(biorhythmData.today, biorhythmData.yesterday)
  const overallScore = Math.round(
    (biorhythmData.today.physical + biorhythmData.today.emotional + biorhythmData.today.intellectual) / 3,
  )

  return (
    <div className="min-h-screen relative text-white">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/img/cover-ritmovital.png"
          alt="RitmoVital Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto p-4 space-y-6">
        {/* App Title Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            RitmoVital
          </h1>
          <p className="text-xl md:text-2xl text-amber-300 drop-shadow-lg">
            Descubre tus ciclos naturales
          </p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-amber-400">
              <AvatarImage src="/img/icono-ritmoovital.png" />
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 font-bold">
                {userProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">¡Hola, {userProfile.name}!</h2>
              <p className="text-slate-300">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Pro button only in development or when NEXT_PUBLIC_ENABLE_PRO is true */}
            {(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_PRO === 'true') && (
              <Button
                onClick={() => setShowProVersion(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
              >
                <Crown className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Agregar y comparar personas</span>
                <span className="sm:hidden">Comparar</span>
              </Button>
            )}
            <Badge variant="outline" className="text-amber-400 border-amber-400">
              Estado General: {overallScore}%
            </Badge>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Biorhythm Status Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Physical */}
              <Card className="bg-slate-800/50 border-orange-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-orange-400">
                    <Activity className="mr-2 h-5 w-5" />
                    Físico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400 mb-2">{biorhythmData.today.physical}%</div>
                  <Progress value={Math.abs(biorhythmData.today.physical)} className="h-2 mb-2 [&>div]:bg-orange-400" />
                  <p className="text-sm text-slate-300">{state.physical.description}</p>
                </CardContent>
              </Card>

              {/* Emotional */}
              <Card className="bg-slate-800/50 border-blue-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-blue-400">
                    <Heart className="mr-2 h-5 w-5" />
                    Emocional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400 mb-2">{biorhythmData.today.emotional}%</div>
                  <Progress value={Math.abs(biorhythmData.today.emotional)} className="h-2 mb-2 [&>div]:bg-blue-400" />
                  <p className="text-sm text-slate-300">{state.emotional.description}</p>
                </CardContent>
              </Card>

              {/* Intellectual */}
              <Card className="bg-slate-800/50 border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-green-400">
                    <Brain className="mr-2 h-5 w-5" />
                    Intelectual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-2">{biorhythmData.today.intellectual}%</div>
                  <Progress value={Math.abs(biorhythmData.today.intellectual)} className="h-2 mb-2 [&>div]:bg-green-400" />
                  <p className="text-sm text-slate-300">{state.intellectual.description}</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Gráfico de Biorritmos (31 días)</span>
                    <span className="sm:hidden">Biorritmos (31 días)</span>
                  </CardTitle>
                  <div className="w-full sm:w-auto">
                    <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />
                  </div>
                </div>
                <CardDescription className="mt-2 text-xs sm:text-sm">
                  <span className="block sm:inline">15 días antes y 15 días después de la fecha seleccionada.</span>
                  <span className="block sm:inline mt-1 sm:mt-0">
                    <span className="text-amber-400 ml-0 sm:ml-2">● Hoy</span>
                    {selectedDate.toDateString() !== new Date().toDateString() && (
                      <span className="text-purple-400 ml-2">● Fecha seleccionada</span>
                    )}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <BiorhythmChart data={biorhythmData.chartData} />

                {/* Selected Date Information */}
                {selectedDate.toDateString() !== new Date().toDateString() && biorhythmData.selectedDate && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-700/50 rounded-lg border border-purple-500/20">
                    <h4 className="text-base sm:text-lg font-semibold text-purple-400 mb-3 flex items-center">
                      <Info className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">
                        Información para {selectedDate.toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="text-center p-2 sm:p-0">
                        <div className="text-xl sm:text-2xl font-bold text-orange-400 mb-1">
                          {biorhythmData.selectedDate.physical}%
                        </div>
                        <div className="text-xs sm:text-sm text-slate-300">Físico</div>
                        <Progress
                          value={Math.abs(biorhythmData.selectedDate.physical)}
                          className="h-2 mt-2 [&>div]:bg-orange-400"
                        />
                      </div>
                      <div className="text-center p-2 sm:p-0">
                        <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">
                          {biorhythmData.selectedDate.emotional}%
                        </div>
                        <div className="text-xs sm:text-sm text-slate-300">Emocional</div>
                        <Progress
                          value={Math.abs(biorhythmData.selectedDate.emotional)}
                          className="h-2 mt-2 [&>div]:bg-blue-400"
                        />
                      </div>
                      <div className="text-center p-2 sm:p-0">
                        <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1">
                          {biorhythmData.selectedDate.intellectual}%
                        </div>
                        <div className="text-xs sm:text-sm text-slate-300">Intelectual</div>
                        <Progress
                          value={Math.abs(biorhythmData.selectedDate.intellectual)}
                          className="h-2 mt-2 [&>div]:bg-green-400"
                        />
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 text-center">
                      <div className="text-base sm:text-lg font-semibold text-amber-400">
                        Estado General: {Math.round(
                          (biorhythmData.selectedDate.physical + biorhythmData.selectedDate.emotional + biorhythmData.selectedDate.intellectual) / 3
                        )}%
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recommendations Panel */}
          <div className="space-y-4">
            <RecommendationsPanel biorhythmState={state} userProfile={userProfile} />
          </div>
        </div>

        {/* Detailed Recommendations */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>Recomendaciones Detalladas</CardTitle>
            <CardDescription>Consejos personalizados basados en tu estado actual y perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="nutrition" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                <TabsTrigger value="nutrition" className="flex items-center gap-1">
                  <Utensils className="h-4 w-4" />
                  Nutrición
                </TabsTrigger>
                <TabsTrigger value="exercise" className="flex items-center gap-1">
                  <Dumbbell className="h-4 w-4" />
                  Ejercicio
                </TabsTrigger>
                <TabsTrigger value="creativity" className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  Creatividad
                </TabsTrigger>
                <TabsTrigger value="wellness" className="flex items-center gap-1">
                  <Smile className="h-4 w-4" />
                  Bienestar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nutrition" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-400">Alimentación Recomendada</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-700/50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 text-white">Alimentos Ideales para Hoy</h4>
                        <ul className="text-sm space-y-2 text-white">
                          <li>• <strong>Proteínas magras:</strong> Pollo, pescado, tofu y legumbres para mantener energía sostenida</li>
                          <li>• <strong>Frutas cítricas:</strong> Naranjas, limones y pomelos ricos en vitamina C para vitalidad</li>
                          <li>• <strong>Frutos secos:</strong> Almendras, nueces y pistachos para mejorar la concentración</li>
                          <li>• <strong>Vegetales verdes:</strong> Espinacas, brócoli y kale cargados de nutrientes esenciales</li>
                          <li>• <strong>Granos integrales:</strong> Quinoa, avena y arroz integral para energía de liberación lenta</li>
                          <li>• <strong>Grasas saludables:</strong> Aguacate, aceite de oliva y semillas de chía para función cerebral</li>
                          <li>• <strong>Hidratación:</strong> 8-10 vasos de agua, tés verdes y agua con limón para optimizar metabolismo</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-700/50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 text-white">Horarios y Combinaciones</h4>
                        <div className="text-sm space-y-2 text-white">
                          <p><strong>Desayuno (7-9 AM):</strong> Combina proteínas con carbohidratos complejos. Ejemplo: avena con frutos rojos y almendras.</p>
                          <p><strong>Media mañana (10-11 AM):</strong> Fruta fresca con un puñado de nueces para mantener energía estable.</p>
                          <p><strong>Almuerzo (12-2 PM):</strong> Plato balanceado: 50% vegetales, 25% proteína magra, 25% granos integrales.</p>
                          <p><strong>Merienda (3-4 PM):</strong> Yogur griego con semillas o hummus con vegetales crudos.</p>
                          <p><strong>Cena (6-8 PM):</strong> Ligera pero nutritiva, evita carbohidratos pesados 3 horas antes de dormir.</p>
                          <p><strong>Suplementos:</strong> Considera vitamina D, omega-3 y magnesio según tu estado energético actual.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="exercise" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-400">Actividad Física Personalizada</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-700/50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 text-white">
                          {state.physical.value > 50 ? "Rutina de Alta Intensidad" : "Rutina de Recuperación"}
                        </h4>
                        <ul className="text-sm space-y-2 text-white">
                          {state.physical.value > 50 ? (
                            <>
                              <li>• <strong>Cardio HIIT:</strong> 20-30 min de intervalos de alta intensidad para maximizar quema calórica</li>
                              <li>• <strong>Entrenamiento de fuerza:</strong> Levantamiento de pesas con 3-4 series de 8-12 repeticiones</li>
                              <li>• <strong>Deportes dinámicos:</strong> Fútbol, básquet, tenis o artes marciales para desafío físico</li>
                              <li>• <strong>CrossFit o funcional:</strong> Ejercicios compuestos que trabajen múltiples grupos musculares</li>
                              <li>• <strong>Running intenso:</strong> Sprints, cuestas o carreras de tempo para resistencia</li>
                              <li>• <strong>Natación vigorosa:</strong> Estilos variados con series de velocidad y resistencia</li>
                              <li>• <strong>Ciclismo de montaña:</strong> Rutas desafiantes que combinen cardio y fuerza</li>
                            </>
                          ) : (
                            <>
                              <li>• <strong>Yoga restaurativo:</strong> Posturas suaves que promuevan relajación y flexibilidad</li>
                              <li>• <strong>Caminata consciente:</strong> 30-45 min en la naturaleza, enfocándote en la respiración</li>
                              <li>• <strong>Tai Chi o Qigong:</strong> Movimientos lentos que equilibren energía y mejoren postura</li>
                              <li>• <strong>Estiramientos profundos:</strong> Sesiones de 20-30 min para liberar tensión muscular</li>
                              <li>• <strong>Pilates suave:</strong> Fortalecimiento del core con movimientos controlados</li>
                              <li>• <strong>Aqua aeróbicos:</strong> Ejercicio de bajo impacto en agua para articulaciones</li>
                              <li>• <strong>Meditación en movimiento:</strong> Combina actividad física ligera con mindfulness</li>
                            </>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-700/50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 text-white">Plan Semanal Optimizado</h4>
                        <div className="text-sm space-y-2 text-white">
                          <p><strong>Frecuencia:</strong> {state.physical.value > 50 ? "5-6 días por semana" : "3-4 días por semana"}</p>
                          <p><strong>Duración:</strong> {state.physical.value > 50 ? "45-75 minutos" : "20-40 minutos"}</p>
                          <p><strong>Mejor horario:</strong> {state.physical.value > 50 ? "Mañana (6-9 AM) para máxima energía" : "Tarde (4-6 PM) para activación gradual"}</p>
                          <p><strong>Calentamiento:</strong> {state.physical.value > 50 ? "10-15 min dinámico" : "5-10 min suave"}</p>
                          <p><strong>Enfriamiento:</strong> Siempre incluir 10-15 min de estiramientos y respiración profunda</p>
                          <p><strong>Hidratación:</strong> {state.physical.value > 50 ? "500ml antes, 200ml cada 15-20 min durante" : "250ml antes, sorbos pequeños durante"}</p>
                          <p><strong>Descanso:</strong> {state.physical.value > 50 ? "1-2 días de recuperación activa" : "Días alternos con actividades muy suaves"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="creativity" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-400">Actividades Creativas Personalizadas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-700/50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 text-white">
                          {state.intellectual.value > 50 ? "Proyectos de Alta Complejidad" : "Expresión Creativa Relajante"}
                        </h4>
                        <ul className="text-sm space-y-2 text-white">
                          {state.intellectual.value > 50 ? (
                            <>
                              <li>• <strong>Escritura creativa:</strong> Novelas, cuentos o poesía que desafíen tu imaginación y estructura narrativa</li>
                              <li>• <strong>Programación creativa:</strong> Desarrolla apps, juegos o proyectos de código abierto innovadores</li>
                              <li>• <strong>Composición musical:</strong> Crea melodías complejas, armonías o experimenta con nuevos géneros</li>
                              <li>• <strong>Diseño arquitectónico:</strong> Planifica espacios, diseña estructuras o modela en 3D</li>
                              <li>• <strong>Investigación y análisis:</strong> Profundiza en temas que te apasionen, crea teorías o hipótesis</li>
                              <li>• <strong>Arte digital avanzado:</strong> Ilustración vectorial, animación 3D o efectos visuales complejos</li>
                              <li>• <strong>Resolución de problemas:</strong> Puzzles complejos, acertijos matemáticos o desafíos lógicos</li>
                            </>
                          ) : (
                            <>
                              <li>• <strong>Dibujo libre:</strong> Sketching sin presión, garabatos conscientes o arte abstracto intuitivo</li>
                              <li>• <strong>Manualidades terapéuticas:</strong> Tejido, bordado, origami o trabajos con arcilla</li>
                              <li>• <strong>Fotografía contemplativa:</strong> Captura momentos simples, naturaleza o detalles cotidianos</li>
                              <li>• <strong>Jardinería creativa:</strong> Diseña espacios verdes, cultiva plantas o crea composiciones florales</li>
                              <li>• <strong>Cocina experimental:</strong> Prueba recetas nuevas, combina sabores o presenta platos artísticamente</li>
                              <li>• <strong>Música relajante:</strong> Toca instrumentos suaves, canta o escucha música mientras dibujas</li>
                              <li>• <strong>Escritura reflexiva:</strong> Diario personal, cartas, poemas cortos o pensamientos libres</li>
                            </>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-700/50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 text-white">Técnicas de Estimulación Creativa</h4>
                        <div className="text-sm space-y-2 text-white">
                          <p><strong>Ambiente ideal:</strong> {state.intellectual.value > 50 ? "Espacio organizado con buena iluminación y herramientas accesibles" : "Ambiente cálido, música suave y sin distracciones"}</p>
                          <p><strong>Duración recomendada:</strong> {state.intellectual.value > 50 ? "Sesiones de 2-4 horas con descansos cada 45 min" : "Sesiones de 30-60 min sin presión de tiempo"}</p>
                          <p><strong>Mejor momento:</strong> {state.intellectual.value > 50 ? "Mañana temprano cuando la mente está fresca" : "Tarde-noche cuando puedes relajarte completamente"}</p>
                          <p><strong>Inspiración:</strong> Mantén un cuaderno de ideas, visita galerías virtuales o explora Pinterest</p>
                          <p><strong>Colaboración:</strong> {state.intellectual.value > 50 ? "Únete a grupos de creadores o participa en desafíos online" : "Comparte tu proceso con amigos cercanos o familiares"}</p>
                          <p><strong>Documentación:</strong> Fotografía tu proceso, mantén un portafolio digital o blog creativo</p>
                          <p><strong>Experimentación:</strong> Prueba una técnica nueva cada semana, mezcla disciplinas o usa materiales inusuales</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wellness" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-400">Bienestar Emocional Integral</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-700/50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 text-white">
                          {state.emotional.value > 50 ? "Actividades de Conexión Social" : "Prácticas de Autocuidado Profundo"}
                        </h4>
                        <ul className="text-sm space-y-2 text-white">
                          {state.emotional.value > 50 ? (
                            <>
                              <li>• <strong>Reuniones sociales:</strong> Organiza cenas, salidas o actividades grupales para fortalecer vínculos</li>
                              <li>• <strong>Voluntariado comunitario:</strong> Participa en causas que te apasionen y conecta con personas afines</li>
                              <li>• <strong>Conversaciones profundas:</strong> Dedica tiempo a charlas significativas con amigos y familiares</li>
                              <li>• <strong>Actividades colaborativas:</strong> Únete a clubes, equipos deportivos o grupos de interés común</li>
                              <li>• <strong>Expresión emocional:</strong> Comparte tus sentimientos positivos a través del arte, música o escritura</li>
                              <li>• <strong>Mentoring o enseñanza:</strong> Ayuda a otros compartiendo tus conocimientos y experiencias</li>
                              <li>• <strong>Celebraciones conscientes:</strong> Reconoce y celebra logros propios y de otros de manera significativa</li>
                            </>
                          ) : (
                            <>
                              <li>• <strong>Meditación guiada:</strong> Sesiones de 15-30 min con apps como Headspace o Calm para centrar la mente</li>
                              <li>• <strong>Baños terapéuticos:</strong> Agua caliente con sales de Epsom, aceites esenciales y velas aromáticas</li>
                              <li>• <strong>Journaling emocional:</strong> Escribe 3 páginas diarias sobre pensamientos y sentimientos sin censura</li>
                              <li>• <strong>Terapia de naturaleza:</strong> Pasa tiempo en parques, bosques o junto al agua para reconectar</li>
                              <li>• <strong>Respiración consciente:</strong> Técnicas de pranayama o respiración 4-7-8 para calmar el sistema nervioso</li>
                              <li>• <strong>Masajes o auto-masajes:</strong> Libera tensión física que afecta el estado emocional</li>
                              <li>• <strong>Límites saludables:</strong> Practica decir &quot;no&quot; y protege tu energía emocional de demandas externas</li>
                            </>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-700/50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 text-white">Rutina de Bienestar Diaria</h4>
                        <div className="text-sm space-y-2 text-white">
                          <p><strong>Mañana (6-8 AM):</strong> {state.emotional.value > 50 ? "Gratitud y afirmaciones positivas, planifica conexiones sociales del día" : "Meditación de 10 min, respiración profunda y establecimiento de intenciones suaves"}</p>
                          <p><strong>Mediodía (12-2 PM):</strong> {state.emotional.value > 50 ? "Almuerzo social o llamada a un ser querido para mantener conexiones" : "Pausa consciente de 5 min, camina al aire libre o practica mindfulness"}</p>
                          <p><strong>Tarde (4-6 PM):</strong> {state.emotional.value > 50 ? "Actividad grupal, ejercicio social o tiempo de calidad con otros" : "Actividad creativa relajante o tiempo en soledad para procesar emociones"}</p>
                          <p><strong>Noche (8-10 PM):</strong> Reflexión del día, gratitud por experiencias positivas y preparación mental para descanso</p>
                          <p><strong>Suplementos naturales:</strong> Considera magnesio, ashwagandha o té de manzanilla según tu estado emocional</p>
                          <p><strong>Música terapéutica:</strong> {state.emotional.value > 50 ? "Música alegre y energizante que invite al movimiento" : "Sonidos de la naturaleza, música clásica suave o frecuencias binaurales"}</p>
                          <p><strong>Sueño reparador:</strong> 7-9 horas con rutina de relajación 30 min antes de dormir</p>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-semibold mb-2 text-amber-400">Temporizador de Meditación</h5>
                          <MeditationTimer />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Credit */}
        <div className="text-center py-4">
          <p className="text-xs text-slate-400">
            Creado por Victor M.F. Avilan
          </p>
        </div>
      </div>
    </div>
  )
}