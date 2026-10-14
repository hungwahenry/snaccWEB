"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  DataTable,
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { EmptyNote } from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import type { Option } from "@/features/admin/shell/types"
import { humanize } from "@/features/admin/shell/utils/format"
import type { AdminFeatureFlag, FlagDraft, FlagGroup } from "../types"
import {
  audienceLabel,
  PLATFORM_LABELS,
  PLATFORMS,
  reachLabel,
  windowLabel,
} from "../utils/flags"
import { AvailabilityDialog } from "./availability-dialog"
import { MembersDialog } from "./members-dialog"

function Reach({ flag }: { flag: AdminFeatureFlag }) {
  if (flag.overrides.length === 0) {
    const window = windowLabel(flag)

    return window ? (
      <Badge variant="outline" className="tabular-nums">
        {window}
      </Badge>
    ) : (
      <span className="text-xs text-muted-foreground">Every build</span>
    )
  }

  return (
    <dl className="flex flex-col gap-1">
      {PLATFORMS.map((platform) => {
        const label = reachLabel(flag, platform)

        return (
          <div key={platform} className="flex items-center gap-2">
            <dt className="w-14 shrink-0 text-xs text-muted-foreground">
              {PLATFORM_LABELS[platform]}
            </dt>
            <dd>
              <Badge
                variant={label === "Off" ? "secondary" : "outline"}
                className="tabular-nums"
              >
                {label}
              </Badge>
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

function CountryReach({
  flag,
  countries,
}: {
  flag: AdminFeatureFlag
  countries: Option[]
}) {
  if (flag.countries.length === 0) return null

  const names = new Map(
    countries.map((country) => [country.value, country.label])
  )

  return (
    <div className="flex flex-wrap gap-1">
      {flag.countries.map((rule) => (
        <Badge
          key={rule.country}
          variant={rule.enabled ? "outline" : "secondary"}
        >
          {names.get(rule.country) ?? rule.country}{" "}
          {rule.enabled ? "on" : "off"}
        </Badge>
      ))}
    </div>
  )
}

export function FlagsTables({
  groups,
  countries,
  onSetEnabled,
  onSaveAvailability,
}: {
  groups: FlagGroup[]
  countries: Option[]
  onSetEnabled: (key: string, enabled: boolean) => Promise<unknown>
  onSaveAvailability: (key: string, draft: FlagDraft) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminFeatureFlag>[]>(
    () => [
      {
        id: "flag",
        header: "Flag",
        className: "max-w-md whitespace-normal",
        cell: (flag) => (
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-mono text-xs">
              {flag.key}
              {flag.is_public ? null : (
                <Badge variant="secondary" className="font-sans">
                  Server only
                </Badge>
              )}
              {flag.money ? (
                <Badge
                  variant="outline"
                  className="font-sans"
                  title="Reaches only people whose currency is switched on, on the Currencies page."
                >
                  Money
                </Badge>
              ) : null}
            </p>
            <p className="mt-1 text-xs text-pretty text-muted-foreground">
              {flag.description}
            </p>
          </div>
        ),
      },
      {
        id: "audience",
        header: "For",
        cell: (flag) =>
          flag.audience === "everyone" ? (
            <span className="text-xs text-muted-foreground">Everyone</span>
          ) : (
            <Badge variant="outline">{audienceLabel(flag)}</Badge>
          ),
      },
      {
        id: "reach",
        header: "Reaches",
        cell: (flag) =>
          flag.is_public ? (
            <div className="flex flex-col gap-2">
              <Reach flag={flag} />
              <CountryReach flag={flag} countries={countries} />
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">
              Everyone at once
            </span>
          ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (flag) => (
          <div className="flex items-center justify-end gap-3">
            {flag.is_public &&
            (flag.audience === "listed" || flag.member_count > 0) ? (
              <MembersDialog
                flag={flag}
                trigger={
                  <Button variant="outline" size="sm">
                    People
                  </Button>
                }
              />
            ) : null}
            {flag.is_public ? (
              <CanAct permission="flags.write">
                <AvailabilityDialog
                  flag={flag}
                  countries={countries}
                  trigger={
                    <Button variant="outline" size="sm">
                      Who gets it
                    </Button>
                  }
                  onSubmit={(draft) => onSaveAvailability(flag.key, draft)}
                />
              </CanAct>
            ) : null}
            <CanAct permission="flags.write">
              <ConfirmAction
                trigger={
                  <Button variant="outline" size="sm">
                    {flag.enabled ? "Turn off" : "Turn on"}
                  </Button>
                }
                tone={flag.enabled ? "destructive" : "default"}
                title={
                  flag.enabled
                    ? `Turn ${humanize(flag.key)} off?`
                    : `Turn ${humanize(flag.key)} on?`
                }
                description={
                  flag.enabled
                    ? flag.countries.some((rule) => rule.enabled)
                      ? "Within a few minutes it goes away everywhere except the countries whose own rule keeps it on."
                      : "It goes away for everyone within a few minutes."
                    : "It reaches whoever its rules allow, within a few minutes."
                }
                confirmLabel={flag.enabled ? "Turn it off" : "Turn it on"}
                onConfirm={() => onSetEnabled(flag.key, !flag.enabled)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [countries, onSetEnabled, onSaveAvailability]
  )

  if (groups.length === 0) return <EmptyNote>No flags yet.</EmptyNote>

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <TableFrame key={group.category} title={humanize(group.category)}>
          <DataTable
            columns={columns}
            rows={group.flags}
            rowKey={(flag) => flag.key}
            empty="Nothing in this category."
            topAligned
          />
        </TableFrame>
      ))}
    </div>
  )
}
