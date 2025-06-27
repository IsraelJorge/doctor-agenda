import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import { getUserSession } from '@/lib/auth'
import { Route } from '@/utils/routes'

import { AppSidebarHeader } from './app-sidebar-header'
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

const otherItems: AppSidebarManuItem[] = [
  {
    title: 'Planos',
    url: Route.subscription,
    icon: 'gem',
  },
]

export async function AppSidebar() {
  const session = await getUserSession()

  return (
    <Sidebar variant="inset">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <AppSidebarMenuList items={items} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Outros</SidebarGroupLabel>
          <SidebarGroupContent>
            <AppSidebarMenuList items={otherItems} />
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
