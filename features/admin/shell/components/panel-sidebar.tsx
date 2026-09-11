"use client"

import { ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
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
import { Spinner } from "@/components/ui/spinner"
import type { NavItem, NavSection } from "../utils/nav"

export interface PanelNavSection extends NavSection {
  items: (NavItem & { active: boolean })[]
}

export function PanelSidebar({
  sections,
  appHref,
  loggingOut,
  onLogout,
}: {
  sections: PanelNavSection[]
  appHref: string
  loggingOut: boolean
  onLogout: () => void
}) {
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
                    <SidebarMenuButton
                      isActive={item.active}
                      render={
                        <Link
                          href={item.href}
                          aria-current={item.active ? "page" : undefined}
                        />
                      }
                    >
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
          render={<Link href={appHref} />}
        >
          <ArrowLeft />
          Back to Snacc
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start"
          disabled={loggingOut}
          onClick={onLogout}
        >
          {loggingOut ? <Spinner /> : <LogOut />}
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
