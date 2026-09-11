"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { usePanelAccess } from "@/features/admin/auth/hooks/use-panel-access"
import { OUTSIDE_PANEL_PATH } from "@/features/admin/auth/utils/panel-access"
import { NoAccess } from "../components/no-access"
import { PanelFrame } from "../components/panel-frame"
import { PanelSidebar } from "../components/panel-sidebar"
import { LoadingBlock } from "../components/query-view"
import { usePanelNav } from "../hooks/use-panel-nav"
import { ADMIN_PROFILE_PATH } from "../routes"

export function PanelShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const access = usePanelAccess(pathname)
  const nav = usePanelNav(pathname)

  return (
    <PanelFrame
      profileHref={ADMIN_PROFILE_PATH}
      sidebar={
        <PanelSidebar
          sections={nav.sections}
          appHref={OUTSIDE_PANEL_PATH}
          loggingOut={nav.loggingOut}
          onLogout={nav.logout}
        />
      }
    >
      {access.state === "allowed" ? (
        children
      ) : access.state === "denied" ? (
        <NoAccess permission={access.permission} />
      ) : (
        <LoadingBlock className="py-24" />
      )}
    </PanelFrame>
  )
}
