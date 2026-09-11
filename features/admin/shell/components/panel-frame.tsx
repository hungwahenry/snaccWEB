import { CircleUser } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function PanelFrame({
  sidebar,
  profileHref,
  children,
}: {
  sidebar: ReactNode
  profileHref: string
  children: ReactNode
}) {
  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href={profileHref} />}
            >
              <CircleUser />
              Your access
            </Button>
          </div>
        </header>
        <div className="min-w-0 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
