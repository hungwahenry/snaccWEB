"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { NEW_PAGE_PATH } from "@/features/admin/shell/routes"
import { PagesTable } from "../components/pages-table"
import { usePagesScreen } from "../hooks/use-pages-screen"

export function PagesScreen() {
  const { query, actions } = usePagesScreen()

  return (
    <>
      <PageHeader
        title="Pages"
        description="Custom pages like Terms and Privacy."
        action={
          <CanAct permission="pages.write">
            <Button size="sm" render={<Link href={NEW_PAGE_PATH} />}>
              New page
            </Button>
          </CanAct>
        }
      />
      <PagesTable query={query} onDelete={actions.remove} />
    </>
  )
}
