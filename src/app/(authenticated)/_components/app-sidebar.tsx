import Image from 'next/image'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { getUserSession } from '@/lib/auth'
import { Route } from '@/utils/routes'

import { AppSidebarManuItem, AppSidebarMenuList } from './app-sidebar-menu-list'
import { NavUser } from './nav-user'

const items: AppSidebarManuItem[] = [
  {
    title: 'Dashboard',
    url: Route.dashboard,
    icon: 'layout-dashboard',
  },
  {
    title: 'Agendamentos',
    url: Route.appointment,
    icon: 'calendar-days',
  },
  {
    title: 'Médicos',
    url: Route.doctor,
    icon: 'stethoscope',
  },
  {
    title: 'Pacientes',
    url: Route.patient,
    icon: 'users-round',
  },
]

export async function AppSidebar() {
  const session = await getUserSession()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Image src="/logo.svg" alt="Doutor Agenda" width={136} height={28} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <AppSidebarMenuList items={items} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {session?.user && (
          <NavUser
            user={{
              avatar: session.user.image ?? '',
              name: session.user.name,
              email: session.user.email,
              clinicName: session.user?.clinic?.name ?? '',
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
