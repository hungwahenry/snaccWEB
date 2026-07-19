"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Banknote,
  Coins,
  Flag,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  School,
  ScrollText,
  SlidersHorizontal,
  ToggleRight,
  Users,
} from "lucide-react"
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
import { useLogout } from "@/features/auth/hooks/use-auth"

const NAV = [
  { group: "Overview", items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }] },
  { group: "People", items: [{ href: "/users", label: "Users", icon: Users }] },
  {
    group: "Content",
    items: [
      { href: "/snaccs", label: "Snaccs", icon: MessageSquare },
      { href: "/reports", label: "Reports", icon: Flag },
      { href: "/pages", label: "Pages", icon: FileText },
      { href: "/announcements", label: "Announcements", icon: Megaphone },
    ],
  },
  {
    group: "Money",
    items: [
      { href: "/earnings", label: "Earnings", icon: Coins },
      { href: "/withdrawals", label: "Withdrawals", icon: Banknote },
    ],
  },
  {
    group: "Platform",
    items: [
      { href: "/universities", label: "Universities", icon: School },
      { href: "/config", label: "Config", icon: SlidersHorizontal },
      { href: "/flags", label: "Feature flags", icon: ToggleRight },
      { href: "/audit", label: "Audit log", icon: ScrollText },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useLogout()

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href)
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-4">
        <span className="text-lg font-bold tracking-tight">
          snacc<span className="text-resnacc">.</span> admin
        </span>
      </SidebarHeader>
      <SidebarContent>
        {NAV.map((section) => (
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
          onClick={() => logout.mutate(undefined, { onSuccess: () => router.replace("/login") })}
        >
          <LogOut />
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
