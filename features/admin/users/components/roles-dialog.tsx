"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { X } from "lucide-react"
import { useState, type ReactElement } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import type { AdminGrant } from "@/features/admin/roles/types"
import { grantLabel } from "@/features/admin/roles/utils/roles"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { FormDialog } from "@/features/admin/shell/components/form-dialog"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { QueryView } from "@/features/admin/shell/components/query-view"
import type { Option } from "@/features/admin/shell/types"

function Grants({
  grants,
  grantable,
  onGrant,
  onRevoke,
}: {
  grants: UseQueryResult<AdminGrant[]>
  grantable: Option[]
  onGrant: (roleId: string) => Promise<unknown>
  onRevoke: (roleId: string) => Promise<unknown>
}) {
  const [chosen, setChosen] = useState<string | null>(null)

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
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {grantLabel(grant)}
                    <ConfirmAction
                      trigger={
                        <button
                          type="button"
                          aria-label={`Take away ${grant.role.name}`}
                          className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      }
                      title={`Take away ${grant.role.name}?`}
                      description="They lose everything this role let them do, straight away."
                      confirmLabel="Take it away"
                      onConfirm={() => onRevoke(grant.role.id)}
                    />
                  </Badge>
                </li>
              ))}
            </ul>
          )
        }
      </QueryView>
      {grantable.length > 0 ? (
        <div className="flex items-center gap-2">
          <OptionSelect
            label="Role to give"
            value={chosen}
            onChange={setChosen}
            options={grantable}
            placeholder="Give a role…"
            className="flex-1"
          />
          <ActionButton
            size="sm"
            disabled={chosen === null}
            onClick={async () => {
              if (!chosen) return
              await onGrant(chosen)
              setChosen(null)
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
  onGrant: (roleId: string) => Promise<unknown>
  onRevoke: (roleId: string) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Roles"
      description="What someone can do in this panel comes from the roles they hold."
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
