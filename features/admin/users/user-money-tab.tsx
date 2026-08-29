"use client"

import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { Fact, Facts, Section } from "@/components/admin/detail"
import { TableFrame } from "@/components/data-table/table-frame"
import { CanAct } from "@/components/rbac/can"
import { SettingRow } from "@/components/admin/setting-row"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatNaira, formatNumber } from "@/lib/format"
import type { AdminUserDetail } from "./types"

export function UserMoneyTab({ user }: { user: AdminUserDetail }) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <Section
        title="Unclaimed earnings"
        description="Accrued from engagement. Not spendable — it becomes wallet money only when they claim it, and their milestones have to allow that."
      >
        <Facts>
          <Fact label="Balance" value={formatNaira(user.earnings.balance)} />
          {user.earnings.by_type.map((entry) => (
            <Fact
              key={entry.type}
              label={`${entry.type} · ${formatNumber(entry.events)} events`}
              value={formatNaira(entry.kobo)}
            />
          ))}
        </Facts>
      </Section>

      {user.earnings.top_boosters.length > 0 ? (
        <Section
          title="Top boosters"
          description="Who paid the most into this balance. One account dominating is what farming looks like."
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Events</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.earnings.top_boosters.map((booster, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm">
                      {booster.username
                        ? `@${booster.username}`
                        : booster.email}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(booster.events)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNaira(booster.kobo)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>
        </Section>
      ) : null}

      <div className="rounded-lg border">
        <SettingRow
          label="Wallet"
          description="Real, spendable money, backed by the ledger. Every movement has two sides and can be traced."
          action={
            <CanAct permission="wallet.read">
              <Button
                variant="outline"
                size="sm"
                render={<Link href={`/admin/wallet/${user.id}`} />}
              >
                Open wallet
                <ExternalLink />
              </Button>
            </CanAct>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Payout account">
          {user.payout_account ? (
            <Facts>
              <Fact label="Bank" value={user.payout_account.bank_name} />
              <Fact
                label="Account name"
                value={user.payout_account.account_name}
              />
              <Fact
                label="Account"
                value={`•••• ${user.payout_account.account_last4}`}
              />
              <Fact
                label="Linked"
                value={formatDate(user.payout_account.created_at)}
              />
            </Facts>
          ) : (
            <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
              No payout account linked.
            </p>
          )}
        </Section>

        <Section title="Recent withdrawals">
          {user.recent_withdrawals.length === 0 ? (
            <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
              No withdrawals.
            </p>
          ) : (
            <TableFrame>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.recent_withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-mono text-xs">
                        {withdrawal.reference}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNaira(withdrawal.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{withdrawal.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(withdrawal.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableFrame>
          )}
        </Section>
      </div>
    </div>
  )
}
