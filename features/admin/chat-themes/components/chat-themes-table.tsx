"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { useColorMode } from "@/features/chat-themes/hooks/use-color-mode"
import { paintOf } from "@/features/chat-themes/utils/paint"
import { ThemeThumbnail } from "@/features/messages/components/themes/theme-thumbnail"
import type { AdminChatTheme, ChatThemeDraft } from "../types"
import { deleteWarning, inUseLabel, kindNote } from "../utils/chat-themes"
import { ThemeDialog } from "./theme-dialog"

export function ChatThemesTable({
  query,
  onSetEnabled,
  onSetPremium,
  onSave,
  onDelete,
}: {
  query: UseQueryResult<AdminChatTheme[]>
  onSetEnabled: (id: string, enabled: boolean) => Promise<unknown>
  onSetPremium: (id: string, premium: boolean) => Promise<unknown>
  onSave: (draft: ChatThemeDraft, id: string) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}) {
  const mode = useColorMode()
  const columns = useMemo<Column<AdminChatTheme>[]>(
    () => [
      {
        id: "look",
        header: "Look",
        className: "w-20",
        cell: (theme) => (
          <ThemeThumbnail
            paint={paintOf(theme.look, mode)}
            photoUrl={theme.image_url}
            needsPhoto={theme.kind !== "preset" && theme.image_url === null}
            width={48}
          />
        ),
      },
      {
        id: "label",
        header: "Name",
        className: "font-medium",
        cell: (theme) => (
          <div className="flex flex-col">
            <span>{theme.label}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {theme.key}
              {kindNote(theme)}
            </span>
          </div>
        ),
      },
      {
        id: "position",
        header: "Position",
        align: "end",
        className: "w-24 tabular-nums",
        cell: (theme) => theme.position,
      },
      {
        id: "in-use",
        header: "In use",
        align: "end",
        className: "w-48 tabular-nums",
        cell: (theme) => inUseLabel(theme.in_use),
      },
      {
        id: "premium",
        header: "Premium",
        align: "end",
        className: "w-28",
        cell: (theme) => (
          <CanAct permission="chat_themes.write">
            <ActionSwitch
              checked={theme.premium}
              label={`${theme.label} needs Premium`}
              onChange={(premium) => onSetPremium(theme.id, premium)}
            />
          </CanAct>
        ),
      },
      {
        id: "offered",
        header: "Offered",
        align: "end",
        className: "w-28",
        cell: (theme) => (
          <CanAct permission="chat_themes.write">
            <ActionSwitch
              checked={theme.enabled}
              label={`Offer ${theme.label} in the picker`}
              onChange={(enabled) => onSetEnabled(theme.id, enabled)}
            />
          </CanAct>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (theme) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="chat_themes.write">
              <ThemeDialog
                theme={theme}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, theme.id)}
              />
            </CanAct>
            <CanAct permission="chat_themes.delete">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                title={`Delete ${theme.label}?`}
                description={deleteWarning(theme)}
                confirmLabel="Delete theme"
                onConfirm={() => onDelete(theme.id)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [mode, onSetEnabled, onSetPremium, onSave, onDelete]
  )

  return (
    <QueryTable
      query={query}
      what="chat themes"
      columns={columns}
      rowKey={(theme) => theme.id}
      empty="No chat themes yet. Add one to fill the picker."
    />
  )
}
