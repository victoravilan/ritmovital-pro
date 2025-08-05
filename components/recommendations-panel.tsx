"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Utensils, Dumbbell, Palette, Heart, Star, TrendingUp, TrendingDown } from "lucide-react"
import type { BiorhythmState, UserProfile } from "@/lib/biorhythm-calculator"

interface RecommendationsPanelProps {
  biorhythmState: BiorhythmState
  userProfile: UserProfile
}

export default function RecommendationsPanel({ biorhythmState, userProfile }: RecommendationsPanelProps) {
  const getRecommendations = () => {
    const recommendations = []

    // Nutrition recommendation
    recommendations.push({
      type: "nutrition",
      title: biorhythmState.physical.value > 0 ? "Proteínas y Energía" : "Alimentos Reconstituyentes",
      description: biorhythmState.physical.value > 0 ? "Consume proteínas magras y carbohidratos complejos." : "Opta por alimentos ricos en vitaminas y minerales.",
      icon: <Utensils className="h-5 w-5" />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10 border-orange-500/20",
    });

    // Exercise recommendation
    recommendations.push({
      type: "exercise",
      title: biorhythmState.physical.value > 0 ? "Ejercicio Intenso" : "Actividad Suave",
      description: biorhythmState.physical.value > 0 ? "Perfecto para entrenamientos de alta intensidad." : "Yoga, caminata o estiramientos serán ideales.",
      icon: <Dumbbell className="h-5 w-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20",
    });

    // Creative recommendation
    recommendations.push({
      type: "creativity",
      title: biorhythmState.intellectual.value > 0 ? "Proyectos Complejos" : "Actividades Relajantes",
      description: biorhythmState.intellectual.value > 0 ? "Tu mente está activa. Ideal para resolver problemas." : "Opta por actividades creativas simples y relajantes.",
      icon: <Palette className="h-5 w-5" />,
      color: "text-green-400",
      bgColor: "bg-green-500/10 border-green-500/20",
    });

    // Emotional recommendation
    recommendations.push({
      type: "emotional",
      title: biorhythmState.emotional.value > 0 ? "Conexión Social" : "Autocuidado",
      description: biorhythmState.emotional.value > 0 ? "Tu estado emocional es positivo. Perfecto para socializar." : "Dedica tiempo a la introspección y cuidado personal.",
      icon: <Heart className="h-5 w-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10 border-purple-500/20",
    });

    return recommendations
  }

  const getCulturalRecommendation = (ethnicity: string, state: BiorhythmState) => {
    const recommendations: Record<string, any> = {
      latino: {
        high: "🌶️ Las tradiciones latinas celebran la vitalidad con comidas compartidas: prepara un sancocho o pozole con ingredientes frescos, invita a la familia para fortalecer lazos. La música salsa o merengue activa la energía ancestral. Considera rituales de gratitud al sol y conexión con la Pachamama. Los bailes tradicionales como cumbia o bachata son perfectos para canalizar tu energía física elevada.",
        low: "🌿 La sabiduría latina honra los ciclos naturales: prepara caldos de hueso con cilantro y ajo, tés de manzanilla con miel de abeja. Busca el consejo de los mayores, practica la sobadería (masajes tradicionales) o usa plantas medicinales como la ruda y albahaca. Dedica tiempo a la oración o meditación con velas. Los remedios caseros de la abuela son medicina para el alma.",
      },
      europeo: {
        high: "🏰 Las tradiciones europeas valoran la estructura y disciplina: organiza tu día con precisión alemana, practica deportes como el fútbol o ciclismo. Consume granos integrales, quesos artesanales y vinos con moderación. Lee filosofía clásica o literatura que desafíe tu intelecto. La música clásica de Bach o Beethoven sincroniza con tu energía mental elevada. Considera saunas o baños termales para purificación.",
        low: "🕯️ La sabiduría europea abraza la contemplación: prepara sopas nutritivas con vegetales de raíz, pan artesanal y tés de hierbas del bosque. Practica la hygge danesa creando espacios acogedores con velas y mantas. Lee poesía romántica o filosofía estoica. Los baños calientes con sales minerales y la aromaterapia con lavanda restauran el equilibrio. Honra el silencio y la introspección.",
      },
      asiatico: {
        high: "🐉 Las tradiciones asiáticas canalizan el chi elevado: practica artes marciales como kung fu o taekwondo, consume alimentos yang como jengibre, ajo y carnes magras. Medita en movimiento con tai chi al amanecer. Usa acupresión en puntos energéticos, quema incienso de sándalo. La caligrafía o pintura con tinta china expresan tu energía creativa. Los tés verdes y oolong mantienen la claridad mental.",
        low: "☯️ La filosofía asiática restaura el equilibrio yin: consume sopas de miso, arroz integral y vegetales cocidos al vapor. Practica meditación zen o vipassana en silencio. Usa medicina tradicional china con hierbas como ginseng y ginkgo. Los masajes shiatsu liberan bloqueos energéticos. Contempla jardines zen, practica origami o ikebana. El té de crisantemo y la música de cuencos tibetanos calman el espíritu.",
      },
      africano: {
        high: "🌍 Las tradiciones africanas celebran la fuerza vital: danza al ritmo de tambores djembe, consume alimentos ricos como ñame, plátano y pescados. Conecta con la comunidad a través de círculos de conversación y rituales de gratitud. Usa colores vibrantes, aceites esenciales de karité y baobab. La música afrobeat y los cantos tradicionales elevan el espíritu. Honra a los ancestros con ofrendas y ceremonias.",
        low: "🌳 La sabiduría africana sana con la naturaleza: prepara caldos con tubérculos y hierbas medicinales, usa plantas como la moringa y aloe vera. Busca la guía de los mayores y curanderos tradicionales. Practica rituales de purificación con agua bendita y sahumerios. Los masajes con aceites naturales y la conexión con la tierra descalzo restauran la energía. Medita bajo árboles sagrados y honra los espíritus protectores.",
      },
      indigena: {
        high: "🦅 Las tradiciones indígenas honran la energía del águila: realiza ceremonias de gratitud al amanecer, consume alimentos sagrados como quinoa, amaranto y cacao. Practica danzas ceremoniales y cantos de poder. Usa plantas maestras como salvia blanca para limpiezas energéticas. Conecta con los cuatro elementos a través de rituales en la naturaleza. Los tambores chamánicos y flautas nativas sintonizan con tu espíritu elevado.",
        low: "🌙 La medicina indígena restaura con la luna: prepara tés de plantas sagradas como cedro, copal y hierba dulce. Busca la guía de los abuelos y chamanes. Practica temazcales o baños de vapor purificadores. Usa cristales y piedras sagradas para equilibrar chakras. Medita en círculos de medicina, honra los espíritus de la naturaleza. Los rituales de luna nueva y llena reconectan con los ciclos naturales.",
      },
      otro: {
        high: "🌟 Tu herencia única es un tesoro: investiga las tradiciones de tus ancestros, busca recetas familiares que nutran cuerpo y alma. Conecta con comunidades que compartan tu origen, aprende danzas o música tradicional. Usa especias y hierbas de tu cultura, practica rituales de gratitud heredados. Tu diversidad cultural es una fortaleza que enriquece tu experiencia vital.",
        low: "🕊️ Honra tu linaje ancestral: busca en las tradiciones familiares remedios naturales y prácticas de sanación. Conecta con los mayores para aprender sabiduría heredada. Usa alimentos, plantas y rituales que tus antepasados empleaban para restaurar el equilibrio. Tu herencia cultural contiene las claves para tu bienestar integral.",
      }
    }

    const ethnicityData = recommendations[ethnicity.toLowerCase()] || recommendations.otro
    const overallEnergy = (state.physical.value + state.emotional.value + state.intellectual.value) / 3
    return overallEnergy > 0 ? ethnicityData.high : ethnicityData.low
  }

  const recommendations = getRecommendations()

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-400">
            <Star className="mr-2 h-5 w-5" />
            Recomendaciones del Día
          </CardTitle>
          <CardDescription>Basadas en tu estado actual y perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, index) => (
            <Card key={index} className={`${rec.bgColor} border`}>
              <CardContent className="p-3">
                <div className="flex items-start space-x-3">
                  <div className={rec.color}>{rec.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">{rec.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">{rec.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-amber-400">Tendencias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-orange-400">Físico</span>
            <div className="flex items-center">
              {biorhythmState.physical.trend === "up" ? <TrendingUp className="h-4 w-4 text-green-400 mr-1" /> : <TrendingDown className="h-4 w-4 text-red-400 mr-1" />}
              <Badge variant="outline" className="text-xs border-orange-400 text-orange-400">
                {biorhythmState.physical.trend === "up" ? "Subiendo" : "Bajando"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-400">Emocional</span>
            <div className="flex items-center">
              {biorhythmState.emotional.trend === "up" ? <TrendingUp className="h-4 w-4 text-green-400 mr-1" /> : <TrendingDown className="h-4 w-4 text-red-400 mr-1" />}
              <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                {biorhythmState.emotional.trend === "up" ? "Subiendo" : "Bajando"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-400">Intelectual</span>
            <div className="flex items-center">
              {biorhythmState.intellectual.trend === "up" ? <TrendingUp className="h-4 w-4 text-green-400 mr-1" /> : <TrendingDown className="h-4 w-4 text-red-400 mr-1" />}
              <Badge variant="outline" className="text-xs border-green-400 text-green-400">
                {biorhythmState.intellectual.trend === "up" ? "Subiendo" : "Bajando"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {userProfile.ethnicity && (
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-400">Sabiduría Cultural</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-xs text-slate-300">{getCulturalRecommendation(userProfile.ethnicity, biorhythmState)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}