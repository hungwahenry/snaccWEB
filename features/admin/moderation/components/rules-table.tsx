"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useMemo, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import type {
  CategoryUsage,
  ModerationRule,
  ModerationSurface,
  RuleDraft,
} from "../types"
import { ACTION_STATUS } from "../utils/actions"
import { surfaceLabel } from "../utils/surfaces"
import { RuleDialog } from "./rule-dialog"

const SURFACE_COLUMN: Column<ModerationRule> = {
  id: "surface",
  header: "Surface",
  className: "text-sm",
  cell: (rule) => surfaceLabel(rule.surface),
}

export function RulesTable({
  query,
  surface,
  categories,
  toolbar,
  onTune,
  onSave,
  onSetRetired,
}: {
  query: UseQueryResult<ModerationRule[]>
  surface: ModerationSurface | null
  categories: CategoryUsage[]
  toolbar: ReactNode
  onTune: (rule: ModerationRule) => void
  onSave: (draft: RuleDraft, id?: string) => Promise<unknown>
  onSetRetired: (id: string, retired: boolean) => Promise<unknown>
}) {
  const columns = useMemo<Column<ModerationRule>[]>(() => {
    const columns: Column<ModerationRule>[] = [
      {
        id: "category",
        header: "Category",
        className: "font-mono text-xs",
        cell: (rule) => (
          <span className="inline-flex items-center gap-2">
            {rule.category}
            {rule.retired ? <Badge variant="outline">retired</Badge> : null}
          </span>
        ),
      },
      {
        id: "threshold",
        header: "At or above",
        align: "end",
        className: "tabular-nums",
        cell: (rule) => rule.threshold.toFixed(2),
      },
      {
        id: "action",
        header: "Does",
        cell: (rule) => <StatusBadge status={ACTION_STATUS[rule.action]} />,
      },
      {
        id: "note",
        header: "Why",
        className:
          "max-w-md text-sm whitespace-normal text-pretty text-muted-foreground",
        cell: (rule) => rule.note ?? "—",
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (rule) => (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onTune(rule)}>
              Tune
            </Button>
            <CanAct permission="moderation.write">
              <RuleDialog
                rule={rule}
                categories={categories}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, rule.id)}
              />
            </CanAct>
            <CanAct permission="moderation.write">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    {rule.retired ? "Restore" : "Retire"}
                  </Button>
                }
                tone={rule.retired ? "default" : "destructive"}
                title={
                  rule.retired
                    ? `Put ${rule.category} back?`
                    : `Retire ${rule.category}?`
                }
                description={
                  rule.retired
                    ? "It starts deciding again on the next post."
                    : "It stops firing. The scans that cite it keep their record."
                }
                confirmLabel={rule.retired ? "Restore it" : "Retire it"}
                onConfirm={() => onSetRetired(rule.id, !rule.retired)}
              />
            </CanAct>
          </div>
        ),
      },
    ]

    return surface === null ? [SURFACE_COLUMN, ...columns] : columns
  }, [surface, categories, onTune, onSave, onSetRetired])

  return (
    <QueryTable
      query={query}
      what="rules"
      title="Rules"
      description="What a score means. Everything the pipeline does to someone's content is decided here."
      actions={
        <CanAct permission="moderation.write">
          <RuleDialog
            surface={surface}
            categories={categories}
            trigger={
              <Button size="sm">
                <Plus />
                Add rule
              </Button>
            }
            onSubmit={(draft) => onSave(draft)}
          />
        </CanAct>
      }
      toolbar={toolbar}
      columns={columns}
      rowKey={(rule) => rule.id}
      empty="No rules here yet. Without one, this surface is scored and recorded but nothing is ever acted on."
    />
  )
}
