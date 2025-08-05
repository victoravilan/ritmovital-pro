"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Trash2, Users, Edit3, Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ProUserProfile, PERSON_COLORS } from "../lib/multi-biorhythm-calculator"

interface PeopleManagerProps {
  people: ProUserProfile[]
  onPeopleChange: (people: ProUserProfile[]) => void
  activePeople: string[] // IDs of people included in comparison
  onActivePeopleChange: (activeIds: string[]) => void
  maxPeople?: number
}

export default function PeopleManager({ people, onPeopleChange, activePeople, onActivePeopleChange, maxPeople = 3 }: PeopleManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthPlace: "",
  })

  const getNextColor = () => {
    const usedColors = people.map(p => p.color)
    return PERSON_COLORS.find(color => !usedColors.includes(color)) || PERSON_COLORS[0]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.birthDate) return

    if (editingId) {
      // Edit existing person
      const updatedPeople = people.map(person => 
        person.id === editingId 
          ? { ...person, ...formData }
          : person
      )
      onPeopleChange(updatedPeople)
      setEditingId(null)
    } else {
      // Add new person
      const newPerson: ProUserProfile = {
        id: Date.now().toString(),
        name: formData.name,
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace,
        color: getNextColor(),
      }
      onPeopleChange([...people, newPerson])
      setIsAdding(false)
    }

    setFormData({ name: "", birthDate: "", birthPlace: "" })
  }

  const handleEdit = (person: ProUserProfile) => {
    setFormData({
      name: person.name,
      birthDate: person.birthDate,
      birthPlace: person.birthPlace,
    })
    setEditingId(person.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    onPeopleChange(people.filter(p => p.id !== id))
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: "", birthDate: "", birthPlace: "" })
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Gestión de Personas ({people.length}/{maxPeople})
          </div>
          {!isAdding && people.length < maxPeople && (
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              className="bg-amber-600 hover:bg-amber-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* People List */}
        <div className="space-y-3">
          {people.map((person) => {
            const isActive = activePeople.includes(person.id)
            return (
              <div key={person.id} className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isActive ? 'bg-slate-700/70 border border-amber-500/30' : 'bg-slate-700/30 opacity-60'
              }`}>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onActivePeopleChange([...activePeople, person.id])
                      } else {
                        onActivePeopleChange(activePeople.filter(id => id !== person.id))
                      }
                    }}
                    className="border-amber-400 data-[state=checked]:bg-amber-500"
                  />
                  <Avatar className="h-10 w-10 border-2" style={{ borderColor: person.color }}>
                    <AvatarFallback 
                      className="text-white font-bold"
                      style={{ backgroundColor: person.color }}
                    >
                      {person.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      {person.name}
                      {isActive ? (
                        <Eye className="h-4 w-4 text-amber-400" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      )}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {new Date(person.birthDate).toLocaleDateString("es-ES")}
                      {person.birthPlace && ` • ${person.birthPlace}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ borderColor: person.color, color: person.color }}
                  >
                    {Math.floor((new Date().getTime() - new Date(person.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} años
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(person)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(person.id)}
                    className="text-red-400 hover:text-red-300"
                    disabled={person.id === 'initial-user'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white mb-2 block">Nombre *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nombre completo"
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate" className="text-white mb-2 block">Fecha de Nacimiento *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="bg-white border-slate-400 text-black [&::-webkit-calendar-picker-indicator]:filter-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="birthPlace" className="text-white mb-2 block">Lugar de Nacimiento</Label>
                  <Input
                    id="birthPlace"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                    placeholder="Ciudad, País"
                    className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500"
                  >
                    {editingId ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {people.length === 0 && !isAdding && (
          <div className="text-center py-8 text-slate-400">
            <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">No hay personas agregadas</p>
            <p className="text-sm mb-4">Agrega hasta {maxPeople} personas para comparar sus biorritmos</p>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-amber-600 hover:bg-amber-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Primera Persona
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}