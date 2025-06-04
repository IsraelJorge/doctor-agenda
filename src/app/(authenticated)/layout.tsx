import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getUserSession } from '@/lib/auth'
import { Route } from '@/utils/routes'

import { AppSidebar } from './_components/app-sidebar'

export default async function AuthenticatedLayout({
  children,
}: PropsWithChildren) {
  const session = await getUserSession()

  if (!session) {
    redirect(Route.authentication)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
