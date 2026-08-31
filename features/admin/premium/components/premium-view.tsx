"use client"

import { useState } from "react"
import { ConfirmAction } from "@/components/admin/confirm-action"
import { Fact, Facts, Section } from "@/components/admin/detail"
import { TableFrame } from "@/components/data-table/table-frame"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber } from "@/lib/format"
import {
  useBenefits,
  usePremiumMutations,
  usePremiumStats,
  useSubscribers,
} from "../hooks/use-premium"
import type { AdminBenefit, AdminSubscriber } from "../types"

const STORES: Record<AdminSubscriber["store"], string> = {
  app_store: "App Store",
  play_store: "Play Store",
  promotional: "Granted",
}

export function PremiumView() {
  const [q, setQ] = useState("")
  const stats = usePremiumStats()
  const subscribers = useSubscribers({ q: q || undefined, page: 1 })
  const benefits = useBenefits()

  return (
    <div className="flex flex-col gap-6">
      <Section title="Subscriptions">
        {stats.isPending ? (
          <Loading />
        ) : stats.data ? (
          <div className="grid gap-3 lg:grid-cols-2">
            <Facts>
              <Fact label="Active" value={formatNumber(stats.data.active)} />
              <Fact
                label="Cancelling"
                value={formatNumber(stats.data.cancelling)}
              />
              <Fact label="Lapsed" value={formatNumber(stats.data.lapsed)} />
              <Fact
                label="Lifetime"
                value={formatNumber(stats.data.lifetime)}
              />
            </Facts>
            <Facts>
              {stats.data.byStore.map((row) => (
                <Fact
                  key={row.store}
                  label={STORES[row.store as AdminSubscriber["store"]] ?? row.store}
                  value={formatNumber(row.count)}
                />
              ))}
            </Facts>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load subscription figures.
          </p>
        )}
      </Section>

      <Section
        title="Subscribers"
        description="Granting Premium here writes a promotional subscription, so it never shows up as revenue. Ending one takes access away immediately rather than at the end of the period."
        action={
          <Input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search by name"
            className="w-56"
          />
        }
      >
        {subscribers.isPending ? (
          <Loading />
        ) : subscribers.data && subscribers.data.items.length > 0 ? (
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Who</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Standing</TableHead>
                  <TableHead>Until</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.data.items.map((row) => (
                  <SubscriberRow key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableFrame>
        ) : (
          <p className="text-sm text-muted-foreground">Nobody yet.</p>
        )}
      </Section>

      <Section
        title="What the paywall says"
        description="The wording here is what the app shows on the Premium screen, in this order. Changing it takes effect without a release."
      >
        {benefits.isPending ? (
          <Loading />
        ) : benefits.data ? (
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Heading</TableHead>
                  <TableHead>Line</TableHead>
                  <TableHead className="w-32">Icon</TableHead>
                  <TableHead className="w-24 text-right">Shown</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benefits.data.map((benefit) => (
                  <BenefitRow key={benefit.id} benefit={benefit} />
                ))}
              </TableBody>
            </Table>
          </TableFrame>
        ) : (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load the paywall.
          </p>
        )}
      </Section>
    </div>
  )
}

function SubscriberRow({ row }: { row: AdminSubscriber }) {
  const mutations = usePremiumMutations()
  const name = row.user.username ?? row.user.display_name ?? row.user.id

  return (
    <TableRow>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{STORES[row.store] ?? row.store}</TableCell>
      <TableCell className="text-muted-foreground">{row.product_id}</TableCell>
      <TableCell>
        <Badge variant={row.active ? "secondary" : "outline"}>
          {row.active
            ? row.lifetime
              ? "lifetime"
              : row.will_renew
                ? "active"
                : "cancelling"
            : "lapsed"}
        </Badge>
      </TableCell>
      <TableCell className="tabular-nums">
        {row.expires_at ? (
          new Date(row.expires_at).toLocaleDateString()
        ) : (
          <span className="text-muted-foreground">never</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {row.active ? (
          <ConfirmAction
            label="End"
            title="End this subscription now?"
            description="Access stops immediately, rather than running to the end of the period they paid for. The store is not refunded by this — do that in the store's own console."
            confirmLabel="End it"
            pending={mutations.revoke.isPending}
            onConfirm={(close) =>
              mutations.revoke.mutate(
                { userId: row.user.id, reason: "Ended from the admin panel." },
                { onSuccess: close }
              )
            }
          />
        ) : (
          <ConfirmAction
            label="Grant 30 days"
            confirmVariant="default"
            title="Give this account 30 days?"
            description="Writes a promotional subscription. It does not renew, and it is never counted as revenue."
            confirmLabel="Grant"
            pending={mutations.grant.isPending}
            onConfirm={(close) =>
              mutations.grant.mutate(
                {
                  userId: row.user.id,
                  days: 30,
                  reason: "Granted from the admin panel.",
                },
                { onSuccess: close }
              )
            }
          />
        )}
      </TableCell>
    </TableRow>
  )
}

function BenefitRow({ benefit }: { benefit: AdminBenefit }) {
  const mutations = usePremiumMutations()
  const [label, setLabel] = useState(benefit.label)
  const [description, setDescription] = useState(benefit.description)

  const save = (input: Parameters<typeof mutations.updateBenefit.mutate>[0]["input"]) =>
    mutations.updateBenefit.mutate({ id: benefit.id, input })

  return (
    <TableRow>
      <TableCell>
        <Input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          onBlur={() => label !== benefit.label && save({ label })}
        />
      </TableCell>
      <TableCell>
        <Input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() =>
            description !== benefit.description && save({ description })
          }
        />
      </TableCell>
      <TableCell className="text-muted-foreground">{benefit.icon}</TableCell>
      <TableCell className="text-right">
        <Switch
          checked={benefit.enabled}
          onCheckedChange={(enabled) => save({ enabled })}
        />
      </TableCell>
    </TableRow>
  )
}

function Loading() {
  return (
    <div className="flex justify-center py-6">
      <Spinner />
    </div>
  )
}
