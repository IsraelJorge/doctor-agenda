import {
  CalendarDays,
  LayoutDashboard,
  Stethoscope,
  UsersRound,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getUserSession } from '@/lib/auth'
import { Route } from '@/utils/routes'

import { NavUser } from './nav-user'

const items = [
  {
    title: 'Dashboard',
    url: Route.dashboard,
    icon: LayoutDashboard,
  },
  {
    title: 'Agendamentos',
    url: Route.appointment,
    icon: CalendarDays,
  },
  {
    title: 'Médicos',
    url: Route.doctor,
    icon: Stethoscope,
  },
  {
    title: 'Pacientes',
    url: Route.patient,
    icon: UsersRound,
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
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
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
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
