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
  Tags,
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
  { group: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  { group: "People", items: [{ href: "/admin/users", label: "Users", icon: Users }] },
  {
    group: "Content",
    items: [
      { href: "/admin/snaccs", label: "Snaccs", icon: MessageSquare },
      { href: "/admin/reports", label: "Reports", icon: Flag },
      { href: "/admin/report-reasons", label: "Report reasons", icon: Tags },
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    ],
  },
  {
    group: "Money",
    items: [
      { href: "/admin/earnings", label: "Earnings", icon: Coins },
      { href: "/admin/withdrawals", label: "Withdrawals", icon: Banknote },
    ],
  },
  {
    group: "Platform",
    items: [
      { href: "/admin/universities", label: "Universities", icon: School },
      { href: "/admin/config", label: "Config", icon: SlidersHorizontal },
      { href: "/admin/flags", label: "Feature flags", icon: ToggleRight },
      { href: "/admin/audit", label: "Audit log", icon: ScrollText },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useLogout()

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
          onClick={() => logout.mutate(undefined, { onSuccess: () => router.replace("/admin/login") })}
        >
          <LogOut />
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
