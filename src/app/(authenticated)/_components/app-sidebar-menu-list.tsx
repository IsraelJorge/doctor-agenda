'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Icon, IconProps } from '@/components/ui/icon'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export type AppSidebarManuItem = {
  title: string
  url: string
  icon: IconProps['name']
}

export type AppSidebarMenuListProps = {
  items: AppSidebarManuItem[]
}

export function AppSidebarMenuList({ items }: AppSidebarMenuListProps) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={pathname === item.url}>
            <Link href={item.url}>
              <Icon name={item.icon} />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
