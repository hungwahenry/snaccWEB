"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { RequirePermission } from "@/components/rbac/require-permission"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { permissionForPath } from "@/lib/nav"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const permission = permissionForPath(pathname)

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        {/* min-w-0: without it this flex item grows to its content and a wide table
            pushes the whole page sideways instead of scrolling inside itself. */}
        <SidebarInset className="min-w-0">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
          </header>
          <div className="min-w-0 p-4 sm:p-6">
            {permission ? (
              <RequirePermission permission={permission}>
                {children}
              </RequirePermission>
            ) : (
              children
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
