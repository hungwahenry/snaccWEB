"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/sidebar"
import { useLogout, useMe } from "@/features/admin/auth/hooks/use-auth"
import { NAV } from "@/lib/nav"
import { can } from "@/lib/permissions"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useLogout()
  const me = useMe()

  const sections = NAV.map((section) => ({
    ...section,
    items: section.items.filter((item) => can(me.data?.permissions, item.permission)),
  })).filter((section) => section.items.length > 0)

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-4">
        <span className="text-lg font-bold tracking-tight">
          snacc<span className="text-resnacc">.</span> admin
        </span>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.group}>
            <SidebarGroupLabel>{section.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton isActive={isActive(item.href)} render={<Link href={item.href} />}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start"
          onClick={() => logout.mutate(undefined, { onSuccess: () => router.replace("/admin/login") })}
        >
          <LogOut />
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
