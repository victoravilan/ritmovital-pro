"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }
  
  const handleDateChange = (year: number, month: number, day: number) => {
    const newDate = new Date(year, month, day)
    onDateChange(newDate)
    setIsOpen(false)
  }
  
  const goToToday = () => {
    onDateChange(new Date())
    setIsOpen(false)
  }
  
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    onDateChange(newDate)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateDate('prev')}
          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 flex-1 min-w-0 text-xs sm:text-sm sm:min-w-[200px] sm:flex-none"
        >
          <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">
            {selectedDate.toLocaleDateString("es-ES", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateDate('next')}
          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="bg-amber-600 border-amber-500 text-white hover:bg-amber-500 text-xs sm:text-sm px-2 sm:px-3"
        >
          Hoy
        </Button>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-800 border-slate-600 mx-2 sm:mx-0 sm:left-0 sm:right-auto sm:w-80">
          <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2 block">Año</label>
                <Select
                  value={selectedDate.getFullYear().toString()}
                  onValueChange={(value) => {
                    const year = parseInt(value)
                    handleDateChange(year, selectedDate.getMonth(), selectedDate.getDate())
                  }}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()} className="text-white hover:bg-slate-600 text-xs sm:text-sm">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2 block">Mes</label>
                <Select
                  value={selectedDate.getMonth().toString()}
                  onValueChange={(value) => {
                    const month = parseInt(value)
                    const maxDay = getDaysInMonth(selectedDate.getFullYear(), month)
                    const day = Math.min(selectedDate.getDate(), maxDay)
                    handleDateChange(selectedDate.getFullYear(), month, day)
                  }}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {months.map((month, index) => (
                      <SelectItem key={index} value={index.toString()} className="text-white hover:bg-slate-600 text-xs sm:text-sm">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2 block">Día</label>
              <div className="grid grid-cols-7 gap-1 max-h-32 sm:max-h-48 overflow-y-auto">
                {Array.from({ length: getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth()) }, (_, i) => i + 1).map((day) => (
                  <Button
                    key={day}
                    variant={day === selectedDate.getDate() ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDateChange(selectedDate.getFullYear(), selectedDate.getMonth(), day)}
                    className={`h-6 w-6 sm:h-8 sm:w-8 p-0 text-xs ${
                      day === selectedDate.getDate()
                        ? "bg-amber-600 hover:bg-amber-500"
                        : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    }`}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}