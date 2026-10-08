"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { ThemeThumbnail } from "@/features/messages/components/themes/theme-thumbnail"
import { useColorMode } from "@/features/chat-themes/hooks/use-color-mode"
import { paintOf } from "@/features/chat-themes/utils/paint"
import type { AdminChatTheme } from "../types"

export function ChatThemesTable({
  query,
  onSetEnabled,
  onSetPremium,
}: {
  query: UseQueryResult<AdminChatTheme[]>
  onSetEnabled: (id: string, enabled: boolean) => Promise<unknown>
  onSetPremium: (id: string, premium: boolean) => Promise<unknown>
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
            photoUrl={null}
            needsPhoto={theme.kind === "photo"}
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
              {theme.kind === "photo" ? " · own photo" : ""}
            </span>
          </div>
        ),
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
    ],
    [mode, onSetEnabled, onSetPremium]
  )

  return (
    <QueryTable
      query={query}
      what="chat themes"
      columns={columns}
      rowKey={(theme) => theme.id}
      empty="No chat themes yet."
    />
  )
}
