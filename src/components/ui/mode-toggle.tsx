'use client'

import { useTheme } from 'next-themes'
import * as React from 'react'

import { Switch } from '@/components/ui/switch'

import { Icon } from './icon'
import { Label } from './label'

export function ModeToggle() {
  const id = React.useId()
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <Switch
          id={id}
          checked={theme === 'light'}
          onCheckedChange={(checked) => {
            setTheme(checked ? 'light' : 'dark')
          }}
          className="peer data-[state=checked]:bg-input data-[state=unchecked]:bg-input absolute inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        />
        <span className="peer-data-[state=checked]:text-muted-foreground/70 dark:text-foreground pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center">
          <Icon name="moon" className="size-4" aria-hidden="true" />
        </span>
        <span className="peer-data-[state=unchecked]:text-muted-foreground/70 pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center">
          <Icon name="sun" className="size-4" aria-hidden="true" />
        </span>
      </div>
      <Label htmlFor={id} className="sr-only">
        Labeled switch
      </Label>
    </div>
  )
}
