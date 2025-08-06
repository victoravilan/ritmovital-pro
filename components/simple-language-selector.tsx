"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useSimpleTranslations } from "@/lib/simple-translations"

const LANGUAGES = {
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇺🇸' },
  ru: { name: 'Русский', flag: '🇷🇺' }
}

export default function SimpleLanguageSelector() {
  const { currentLanguage, changeLanguage } = useSimpleTranslations()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (language: 'es' | 'en' | 'ru') => {
    changeLanguage(language)
    setIsOpen(false)
  }

  const currentLangInfo = LANGUAGES[currentLanguage]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50 min-w-[120px]"
        >
          <Globe className="mr-2 h-4 w-4" />
          <span className="mr-1">{currentLangInfo.flag}</span>
          <span className="hidden sm:inline">{currentLangInfo.name}</span>
          <span className="sm:hidden">{currentLanguage.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-slate-800 border-slate-700 min-w-[160px]"
      >
        {Object.entries(LANGUAGES).map(([code, info]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as 'es' | 'en' | 'ru')}
            className="text-white hover:bg-slate-700 cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center">
              <span className="mr-2">{info.flag}</span>
              <span>{info.name}</span>
            </div>
            {currentLanguage === code && (
              <Check className="h-4 w-4 text-amber-400" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}