export interface UserProfile {
  name: string
  birthDate: string
  birthTime?: string
  birthPlace: string
  ethnicity?: string
}

export interface BiorhythmValues {
  physical: number
  emotional: number
  intellectual: number
}

export interface BiorhythmState {
  physical: {
    value: number
    description: string
    trend: "up" | "down"
  }
  emotional: {
    value: number
    description: string
    trend: "up" | "down"
  }
  intellectual: {
    value: number
    description: string
    trend: "up" | "down"
  }
}

export interface BiorhythmData {
  today: BiorhythmValues
  yesterday: BiorhythmValues
  selectedDate?: BiorhythmValues
  chartData: Array<{
    date: string
    physical: number
    emotional: number
    intellectual: number
    isToday?: boolean
    isSelected?: boolean
    fullDate: Date
  }>
}

export function calculateBiorhythms(birthDate: Date, selectedDate?: Date): BiorhythmData {
  const today = new Date()
  const referenceDate = selectedDate || today
  const yesterday = new Date(referenceDate)
  yesterday.setDate(yesterday.getDate() - 1)

  // Calculate days since birth
  const daysSinceBirth = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysSinceBirthReference = Math.floor((referenceDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysSinceBirthYesterday = daysSinceBirthReference - 1

  // Biorhythm periods
  const PHYSICAL_PERIOD = 23
  const EMOTIONAL_PERIOD = 28
  const INTELLECTUAL_PERIOD = 33

  // Calculate today's values (always current day)
  const todayValues: BiorhythmValues = {
    physical: Math.round(Math.sin((2 * Math.PI * daysSinceBirth) / PHYSICAL_PERIOD) * 100),
    emotional: Math.round(Math.sin((2 * Math.PI * daysSinceBirth) / EMOTIONAL_PERIOD) * 100),
    intellectual: Math.round(Math.sin((2 * Math.PI * daysSinceBirth) / INTELLECTUAL_PERIOD) * 100),
  }

  // Calculate yesterday's values (relative to reference date)
  const yesterdayValues: BiorhythmValues = {
    physical: Math.round(Math.sin((2 * Math.PI * daysSinceBirthYesterday) / PHYSICAL_PERIOD) * 100),
    emotional: Math.round(Math.sin((2 * Math.PI * daysSinceBirthYesterday) / EMOTIONAL_PERIOD) * 100),
    intellectual: Math.round(Math.sin((2 * Math.PI * daysSinceBirthYesterday) / INTELLECTUAL_PERIOD) * 100),
  }

  // Calculate selected date values (if different from today)
  let selectedDateValues: BiorhythmValues | undefined
  if (selectedDate && selectedDate.getTime() !== today.getTime()) {
    selectedDateValues = {
      physical: Math.round(Math.sin((2 * Math.PI * daysSinceBirthReference) / PHYSICAL_PERIOD) * 100),
      emotional: Math.round(Math.sin((2 * Math.PI * daysSinceBirthReference) / EMOTIONAL_PERIOD) * 100),
      intellectual: Math.round(Math.sin((2 * Math.PI * daysSinceBirthReference) / INTELLECTUAL_PERIOD) * 100),
    }
  }

  // Generate chart data: 15 days before reference date to 15 days after
  const chartData = []
  for (let i = -15; i <= 15; i++) {
    const date = new Date(referenceDate)
    date.setDate(date.getDate() + i)
    const daysFromBirth = daysSinceBirthReference + i

    const isToday = date.toDateString() === today.toDateString()
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

    chartData.push({
      date: date.toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
      physical: Math.round(Math.sin((2 * Math.PI * daysFromBirth) / PHYSICAL_PERIOD) * 100),
      emotional: Math.round(Math.sin((2 * Math.PI * daysFromBirth) / EMOTIONAL_PERIOD) * 100),
      intellectual: Math.round(Math.sin((2 * Math.PI * daysFromBirth) / INTELLECTUAL_PERIOD) * 100),
      isToday,
      isSelected,
      fullDate: new Date(date),
    })
  }

  return {
    today: todayValues,
    yesterday: yesterdayValues,
    selectedDate: selectedDateValues,
    chartData,
  }
}

export function getBiorhythmState(today: BiorhythmValues, yesterday?: BiorhythmValues): BiorhythmState {
  const getDescription = (value: number, type: "physical" | "emotional" | "intellectual") => {
    if (type === "physical") {
      if (value > 70) return "Energía física excepcional"
      if (value > 30) return "Buena energía física"
      if (value > -30) return "Energía física moderada"
      if (value > -70) return "Energía física baja"
      return "Necesitas descanso físico"
    }

    if (type === "emotional") {
      if (value > 70) return "Estado emocional excelente"
      if (value > 30) return "Buen estado emocional"
      if (value > -30) return "Estado emocional estable"
      if (value > -70) return "Estado emocional sensible"
      return "Necesitas cuidado emocional"
    }

    if (type === "intellectual") {
      if (value > 70) return "Capacidad mental excepcional"
      if (value > 30) return "Buena capacidad mental"
      if (value > -30) return "Capacidad mental moderada"
      if (value > -70) return "Capacidad mental baja"
      return "Necesitas descanso mental"
    }

    return "Estado normal"
  }

  const getTrend = (todayValue: number, yesterdayValue?: number): "up" | "down" => {
    if (!yesterdayValue) return "up"
    return todayValue >= yesterdayValue ? "up" : "down"
  }

  return {
    physical: {
      value: today.physical,
      description: getDescription(today.physical, "physical"),
      trend: getTrend(today.physical, yesterday?.physical),
    },
    emotional: {
      value: today.emotional,
      description: getDescription(today.emotional, "emotional"),
      trend: getTrend(today.emotional, yesterday?.emotional),
    },
    intellectual: {
      value: today.intellectual,
      description: getDescription(today.intellectual, "intellectual"),
      trend: getTrend(today.intellectual, yesterday?.intellectual),
    },
  }
}