import type { ReactNode } from "react"
import { PanelShell } from "@/features/admin/shell/screens/panel-shell"
import { requireAdminSession } from "@/lib/auth-server"

export default async function PanelLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireAdminSession()
  return <PanelShell>{children}</PanelShell>
}
