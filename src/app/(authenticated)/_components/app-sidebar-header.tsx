'use client'

import dynamic from 'next/dynamic'

import { SidebarHeader } from '@/components/ui/sidebar'

const AppLogo = dynamic(() => import('./app-logo').then((mod) => mod.AppLogo), {
  ssr: false,
})

export function AppSidebarHeader() {
  return (
    <SidebarHeader className="border-b p-4">
      <AppLogo />
    </SidebarHeader>
  )
}
