"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts"
import { ProUserProfile, ComparisonType } from "../lib/multi-biorhythm-calculator"

interface MultiChartDataPoint {
  date: string
  fullDate: Date
  isToday?: boolean
  isSelected?: boolean
  [key: string]: any
}

interface MultiBiorhythmChartProps {
  data: MultiChartDataPoint[]
  people: ProUserProfile[]
  comparisonType: ComparisonType
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg max-w-xs">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props
  if (payload && payload.isToday) {
    return <circle cx={cx} cy={cy} r={6} fill="#fbbf24" stroke="#f59e0b" strokeWidth={2} />
  }
  if (payload && payload.isSelected) {
    return <circle cx={cx} cy={cy} r={5} fill="#8b5cf6" stroke="#7c3aed" strokeWidth={2} />
  }
  return <circle cx={cx} cy={cy} r={0} />
}

const getComparisonTitle = (type: ComparisonType): string => {
  switch (type) {
    case 'physical': return 'Físico'
    case 'emotional': return 'Emocional'
    case 'intellectual': return 'Intelectual'
    default: return 'Comparación'
  }
}

export default function MultiBiorhythmChart({ data, people, comparisonType }: MultiBiorhythmChartProps) {
  // Calculate width based on data length to enable horizontal scroll
  const chartWidth = Math.max(800, data.length * 50) // More space for multiple lines
  
  return (
    <div className="w-full">
      {/* Chart Title */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-white">
          Comparación de Biorritmo {getComparisonTitle(comparisonType)}
        </h3>
        <p className="text-sm text-slate-400">
          {people.length} personas • 31 días de análisis
        </p>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap justify-center gap-4">
        {people.map((person) => (
          <div key={person.id} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: person.color }}
            />
            <span className="text-sm text-white">{person.name}</span>
          </div>
        ))}
      </div>

      {/* Scrollable container */}
      <div className="overflow-x-auto pb-4">
        <div 
          className="h-80 sm:h-96 lg:h-[28rem]" 
          style={{ width: `${chartWidth}px`, minWidth: '100%' }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ 
                top: 20, 
                right: 30, 
                left: 20, 
                bottom: 60 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={9}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 9 }}
              />
              <YAxis 
                domain={[-100, 100]} 
                stroke="#9ca3af" 
                fontSize={10}
                width={45}
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
              <ReferenceLine y={50} stroke="#4b5563" strokeDasharray="1 1" />
              <ReferenceLine y={-50} stroke="#4b5563" strokeDasharray="1 1" />

              {/* Generate a line for each person */}
              {people.map((person, index) => (
                <Line
                  key={person.id}
                  type="monotone"
                  dataKey={`${person.id}_${comparisonType}`}
                  stroke={person.color}
                  strokeWidth={2.5}
                  name={person.name}
                  dot={CustomDot}
                  activeDot={{ r: 5, fill: person.color }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="text-center mt-2">
        <p className="text-xs text-slate-400">
          ← Desliza horizontalmente para ver todos los días →
        </p>
      </div>
    </div>
  )
}