"use client"

import * as React from "react"
import { Check } from "lucide-react"

export interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked = false, onCheckedChange, disabled = false, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={`
          inline-flex items-center justify-center w-4 h-4 border-2 rounded-sm
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${checked 
            ? 'bg-amber-500 border-amber-500 text-white' 
            : 'bg-transparent border-slate-400 hover:border-amber-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        {...props}
      >
        {checked && <Check className="w-3 h-3" />}
      </button>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }