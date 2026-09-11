"use client"

import { useLogout } from "@/features/auth/hooks/use-logout"
import { usePermissions } from "@/features/admin/auth/hooks/use-permissions"
import { isNavActive, visibleNav } from "../utils/nav"

export function usePanelNav(pathname: string) {
  const permissions = usePermissions()
  const logout = useLogout()

  const sections = visibleNav(permissions).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      active: isNavActive(item.href, pathname),
    })),
  }))

  return {
    sections,
    loggingOut: logout.isPending,
    logout: () => logout.mutate(),
  }
}
