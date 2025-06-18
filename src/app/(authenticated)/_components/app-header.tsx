'use client'

import dynamic from 'next/dynamic'

import { SidebarTrigger } from '@/components/ui/sidebar'

const ModeToggle = dynamic(
  () => import('@/components/ui/mode-toggle').then((mod) => mod.ModeToggle),
  {
    ssr: false,
  },
)

export function AppHeader() {
  return (
    <header className="w-full p-2">
      <div className="flex w-full items-center justify-between">
        <SidebarTrigger />
        <ModeToggle />
      </div>
    </header>
  )
}
