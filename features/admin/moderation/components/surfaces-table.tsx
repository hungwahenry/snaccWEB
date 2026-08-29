"use client"

import { ConfirmAction } from "@/components/admin/confirm-action"
import { Section } from "@/components/admin/detail"
import { TableFrame } from "@/components/data-table/table-frame"
import { CanAct } from "@/components/rbac/can"
import { Badge } from "@/components/ui/badge"
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
import { SURFACE_LABELS } from "../utils/surfaces"
import type { ModerationMode, SurfaceSetting } from "../types"
import type { useModerationMutations } from "../hooks/use-moderation"

export function SurfacesTable({
  surfaces,
  mutations,
}: {
  surfaces: SurfaceSetting[]
  mutations: ReturnType<typeof useModerationMutations>
}) {
  return (
    <Section
      title="Surfaces"
      description="Which kinds of content are reviewed, and whether they are checked before the write. Inline is the only mode that can stop something reaching a feed."
    >
      <TableFrame>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Surface</TableHead>
              <TableHead>Reviewed</TableHead>
              <TableHead>When</TableHead>
              <TableHead className="text-right">Timeout</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surfaces.map((row) => (
              <TableRow key={row.surface}>
                <TableCell className="font-medium">
                  {SURFACE_LABELS[row.surface] ?? row.surface}
                </TableCell>
                <TableCell>
                  {row.enabled ? (
                    <Badge>on</Badge>
                  ) : (
                    <Badge variant="outline">off</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <CanAct permission="moderation.write">
                    <Select
                      value={row.mode}
                      onValueChange={(next) =>
                        next &&
                        mutations.surface.mutate({
                          surface: row.surface,
                          mode: next as ModerationMode,
                        })
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inline">Before the write</SelectItem>
                        <SelectItem value="queued">After the write</SelectItem>
                      </SelectContent>
                    </Select>
                  </CanAct>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.timeout_ms} ms
                </TableCell>
                <TableCell className="text-right">
                  <CanAct permission="moderation.write">
                    <ConfirmAction
                      label={row.enabled ? "Turn off" : "Turn on"}
                      confirmVariant={row.enabled ? "destructive" : "default"}
                      title={
                        row.enabled
                          ? `Stop reviewing ${SURFACE_LABELS[row.surface] ?? row.surface}?`
                          : `Start reviewing ${SURFACE_LABELS[row.surface] ?? row.surface}?`
                      }
                      description={
                        row.enabled
                          ? "Nothing on this surface is sent for review from now on. Existing holds stay as they are."
                          : "Content here starts being sent to the classifier. Whether anything is acted on still depends on the enforcement flag."
                      }
                      confirmLabel={row.enabled ? "Turn it off" : "Turn it on"}
                      pending={mutations.surface.isPending}
                      onConfirm={(close) =>
                        mutations.surface.mutate(
                          { surface: row.surface, enabled: !row.enabled },
                          { onSuccess: close }
                        )
                      }
                    />
                  </CanAct>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableFrame>
    </Section>
  )
}
