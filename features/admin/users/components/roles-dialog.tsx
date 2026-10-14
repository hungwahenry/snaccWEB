"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { X } from "lucide-react"
import { useState, type ReactElement } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import type { AdminGrant, GrantInput } from "@/features/admin/roles/types"
import { grantLabel } from "@/features/admin/roles/utils/roles"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { InlineConfirm } from "@/features/admin/shell/components/inline-confirm"
import { FormDialog } from "@/features/admin/shell/components/form-dialog"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { QueryView } from "@/features/admin/shell/components/query-view"
import type { Option } from "@/features/admin/shell/types"
import { CampusSearchField } from "@/features/admin/universities/containers/campus-search-field"

function Grants({
  grants,
  grantable,
  onGrant,
  onRevoke,
}: {
  grants: UseQueryResult<AdminGrant[]>
  grantable: Option[]
  onGrant: (input: GrantInput) => Promise<unknown>
  onRevoke: (grantId: string) => Promise<unknown>
}) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [where, setWhere] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <QueryView query={grants} what="their roles">
        {(held) =>
          held.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No roles. They can use the app but not this panel.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {held.map((grant) => (
                <li key={grant.id}>
                  <InlineConfirm
                    question={`Take away ${grantLabel(grant)}? They lose what it allows straight away.`}
                    confirmLabel="Take it away"
                    onConfirm={() => onRevoke(grant.id)}
                    trigger={(ask) => (
                      <Badge variant="secondary" className="gap-1 pr-1">
                        {grantLabel(grant)}
                        <button
                          type="button"
                          aria-label={`Take away ${grantLabel(grant)}`}
                          className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                          onClick={ask}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    )}
                  />
                </li>
              ))}
            </ul>
          )
        }
      </QueryView>
      {grantable.length > 0 ? (
        <div className="flex flex-col gap-3">
          <OptionSelect
            label="Role to give"
            value={chosen}
            onChange={setChosen}
            options={grantable}
            placeholder="Give a role…"
          />
          <CampusSearchField
            label="Where"
            value={where}
            onChange={setWhere}
            anyLabel="Every campus"
            hint="On one campus, only the parts of the role that work campus by campus apply, and only to that campus's people and posts."
          />
          <ActionButton
            size="sm"
            className="self-end"
            disabled={chosen === null}
            onClick={async () => {
              if (!chosen) return
              await onGrant({ roleId: chosen, campusId: where ?? undefined })
              setChosen(null)
              setWhere(null)
            }}
          >
            Give
          </ActionButton>
        </div>
      ) : null}
    </div>
  )
}

export function RolesDialog({
  grants,
  grantable,
  trigger,
  disabled,
  onGrant,
  onRevoke,
}: {
  grants: UseQueryResult<AdminGrant[]>
  grantable: Option[]
  trigger: ReactElement
  disabled?: boolean
  onGrant: (input: GrantInput) => Promise<unknown>
  onRevoke: (grantId: string) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Roles"
      description="What someone can do in this panel comes from the roles they hold. You can only give or take away access you hold yourself, on every campus."
    >
      <Grants
        grants={grants}
        grantable={grantable}
        onGrant={onGrant}
        onRevoke={onRevoke}
      />
      <DialogFooter>
        <DialogClose render={<Button variant="ghost" />}>Done</DialogClose>
      </DialogFooter>
    </FormDialog>
  )
}
