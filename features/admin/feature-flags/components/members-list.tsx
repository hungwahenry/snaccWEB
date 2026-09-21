"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { EmptyNote } from "@/features/admin/shell/components/detail"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { formatDate } from "@/lib/format"
import type { FlagMember } from "../types"

export function MembersList({
  members,
  onAdd,
  onRemove,
}: {
  members: UseQueryResult<FlagMember[]>
  onAdd: (username: string) => Promise<unknown>
  onRemove: (userId: string) => Promise<unknown>
}) {
  const [username, setUsername] = useState("")
  const wanted = username.trim()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-2">
        <TextField
          label="Username"
          placeholder="@chioma"
          autoComplete="off"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="flex-1"
        />
        <CanAct permission="flags.write">
          <ActionButton
            disabled={wanted === ""}
            onClick={async () => {
              await onAdd(wanted)
              setUsername("")
            }}
          >
            Add
          </ActionButton>
        </CanAct>
      </div>

      <QueryView query={members} what="the list">
        {(people) =>
          people.length === 0 ? (
            <EmptyNote>Nobody on the list yet.</EmptyNote>
          ) : (
            <ul className="flex flex-col divide-y">
              {people.map((member) => (
                <li
                  key={member.user.id}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <UserCell
                    user={member.user}
                    note={`Added ${formatDate(member.added_at)}`}
                  />
                  <CanAct permission="flags.write">
                    <ConfirmAction
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Take @${member.user.username ?? "them"} off the list`}
                        >
                          <X />
                        </Button>
                      }
                      title="Take them off the list?"
                      description="They lose the feature the next time their app checks, within a few minutes."
                      confirmLabel="Take off"
                      onConfirm={() => onRemove(member.user.id)}
                    />
                  </CanAct>
                </li>
              ))}
            </ul>
          )
        }
      </QueryView>
    </div>
  )
}
