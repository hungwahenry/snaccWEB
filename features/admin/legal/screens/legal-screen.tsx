"use client"

import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { LegalTable } from "../components/legal-table"
import { NewVersionDialog } from "../components/new-version-dialog"
import { useLegalScreen } from "../hooks/use-legal-screen"

export function LegalScreen() {
  const screen = useLegalScreen()

  return (
    <>
      <PageHeader
        title="Legal"
        description="Terms of Use and Privacy Policy. People get their legal country's version, or the default set where it has none."
        action={
          <CanAct permission="legal.write">
            <NewVersionDialog
              whereOptions={screen.whereOptions}
              onStart={screen.start}
            />
          </CanAct>
        }
      />
      <LegalTable query={screen.query} countryNames={screen.countryNames} />
    </>
  )
}
