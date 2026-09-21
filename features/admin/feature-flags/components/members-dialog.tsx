"use client"

import type { ReactElement } from "react"
import {
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { FlagMembers } from "../containers/flag-members"
import type { AdminFeatureFlag } from "../types"
import { audienceLabel } from "../utils/flags"

export function MembersDialog({
  flag,
  trigger,
}: {
  flag: AdminFeatureFlag
  trigger: ReactElement
}) {
  return (
    <FormDialog
      trigger={trigger}
      title={
        <>
          People on <span className="font-mono">{flag.key}</span>
        </>
      }
      description="While the flag is set to listed people, only these people get it."
    >
      {flag.audience === "listed" ? null : (
        <FormNote>
          Right now it goes to: {audienceLabel(flag).toLowerCase()}. The list is
          kept, and only counts once Who gets it is set to listed people.
        </FormNote>
      )}
      <FlagMembers flagKey={flag.key} />
    </FormDialog>
  )
}
