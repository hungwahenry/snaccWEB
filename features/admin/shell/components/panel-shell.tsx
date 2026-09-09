"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { AppSidebar } from "./app-sidebar"
import { AuthGuard } from "@/features/admin/auth/components/auth-guard"
import { RequirePermission } from "@/features/admin/auth/components/require-permission"
import { CircleUser } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { permissionForPath } from "../nav"

export function PanelShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const permission = permissionForPath(pathname)

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/admin/profile" />}
              >
                <CircleUser />
                Your access
              </Button>
            </div>
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
