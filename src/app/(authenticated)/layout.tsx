import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getUserSession } from '@/lib/auth'
import { Route } from '@/utils/routes'

import { AppHeader } from './_components/app-header'
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
      <SidebarInset>
        <main className="@container/main w-full">
          <AppHeader />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
