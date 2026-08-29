"use client"

import { ConfirmAction } from "@/components/admin/confirm-action"
import { Section } from "@/components/admin/detail"
import { TableFrame } from "@/components/data-table/table-frame"
import { CanAct } from "@/components/rbac/can"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RuleDialog } from "./rule-dialog"
import { SURFACE_LABELS } from "./surfaces"
import type {
  ModerationAction,
  ModerationRule,
  ModerationSurface,
} from "./index"
import type { useModerationMutations } from "./use-moderation"

const ACTION_VARIANT: Record<
  ModerationAction,
  "outline" | "secondary" | "default" | "destructive"
> = {
  allow: "outline",
  flag: "secondary",
  hold: "default",
  block: "destructive",
}

export function RulesTable({
  rules,
  mutations,
  surface,
  onSurface,
  onTune,
}: {
  rules: ModerationRule[]
  mutations: ReturnType<typeof useModerationMutations>
  surface: string
  onSurface: (next: string) => void
  onTune: (rule: ModerationRule) => void
}) {
  const shown =
    surface === "all" ? rules : rules.filter((rule) => rule.surface === surface)

  return (
    <Section
      title="Rules"
      description="What a score means. Everything the pipeline does to someone's content is decided here."
      action={
        <CanAct permission="moderation.write">
          <RuleDialog
            surface={
              surface === "all" ? undefined : (surface as ModerationSurface)
            }
            mutations={mutations}
            trigger={<Button size="sm">Add rule</Button>}
          />
        </CanAct>
      }
    >
      <TableFrame
        toolbar={
          <Select
            value={surface}
            onValueChange={(next) => next && onSurface(next)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Surface" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All surfaces</SelectItem>
              {Object.entries(SURFACE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              {surface === "all" ? <TableHead>Surface</TableHead> : null}
              <TableHead>Category</TableHead>
              <TableHead className="text-right">At or above</TableHead>
              <TableHead>Does</TableHead>
              <TableHead>Why</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={surface === "all" ? 6 : 5}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No rules here yet. Without one, this surface is scored and
                  recorded but nothing is ever acted on.
                </TableCell>
              </TableRow>
            ) : (
              shown.map((rule) => (
                <TableRow key={rule.id}>
                  {surface === "all" ? (
                    <TableCell className="text-sm whitespace-nowrap">
                      {SURFACE_LABELS[rule.surface] ?? rule.surface}
                    </TableCell>
                  ) : null}
                  <TableCell className="font-mono text-xs">
                    <span className="inline-flex items-center gap-2">
                      {rule.category}
                      {rule.retired ? (
                        <Badge variant="outline">retired</Badge>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rule.threshold.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ACTION_VARIANT[rule.action]}>
                      {rule.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md text-sm text-pretty text-muted-foreground">
                    {rule.note ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTune(rule)}
                      >
                        Tune
                      </Button>
                      <CanAct permission="moderation.write">
                        <RuleDialog
                          rule={rule}
                          mutations={mutations}
                          trigger={
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          }
                        />
                      </CanAct>
                      <CanAct permission="moderation.write">
                        <ConfirmAction
                          label={rule.retired ? "Restore" : "Retire"}
                          variant="ghost"
                          confirmVariant={
                            rule.retired ? "default" : "destructive"
                          }
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
                          confirmLabel={
                            rule.retired ? "Restore it" : "Retire it"
                          }
                          pending={mutations.update.isPending}
                          onConfirm={(close) =>
                            mutations.update.mutate(
                              {
                                id: rule.id,
                                input: { retired: !rule.retired },
                              },
                              { onSuccess: close }
                            )
                          }
                        />
                      </CanAct>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableFrame>
    </Section>
  )
}
