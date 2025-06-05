import { headers } from 'next/headers'
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
  const headersList = await headers()
  const referer = headersList.get('referer')
  const url = new URL(referer || '')
  const pathname = url.pathname

  if (!session) {
    redirect(Route.authentication)
  }

  if (session.user?.clinic && pathname !== Route.clinicForm) {
    redirect(Route.clinicForm)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
