"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import type { AdminPrompt, PromptDraft } from "../types"
import { PromptDialog } from "./prompt-dialog"

export function PromptsTable({
  query,
  onSave,
  onDelete,
}: {
  query: UseQueryResult<AdminPrompt[]>
  onSave: (draft: PromptDraft, id: string) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminPrompt>[]>(
    () => [
      {
        id: "prompt",
        header: "Prompt",
        cell: (prompt) => (
          <p className="font-medium">
            <span className="mr-1.5" aria-hidden>
              {prompt.emoji}
            </span>
            {prompt.label}
          </p>
        ),
      },
      {
        id: "placeholder",
        header: "Placeholder",
        className: "max-w-sm whitespace-normal text-muted-foreground",
        cell: (prompt) => <p className="line-clamp-2">{prompt.placeholder}</p>,
      },
      {
        id: "position",
        header: "Position",
        align: "end",
        className: "tabular-nums",
        cell: (prompt) => prompt.position,
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (prompt) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="onboarding_prompts.write">
              <PromptDialog
                prompt={prompt}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, prompt.id)}
              />
            </CanAct>
            <CanAct permission="onboarding_prompts.delete">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                title={`Delete ${prompt.label}?`}
                description="New people stop being offered it. Snaccs already posted from it stay where they are."
                confirmLabel="Delete prompt"
                onConfirm={() => onDelete(prompt.id)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [onSave, onDelete]
  )

  return (
    <QueryTable
      query={query}
      what="prompts"
      columns={columns}
      rowKey={(prompt) => prompt.id}
      empty="No prompts yet. Add one to give new people a starting point."
    />
  )
}
