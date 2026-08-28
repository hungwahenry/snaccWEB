"use client"

import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { CanAct } from "@/components/rbac/can"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatNaira, formatNumber } from "@/lib/format"
import { Row } from "./user-detail-parts"
import type { AdminUserDetail } from "./types"

export function UserMoneyTab({ user }: { user: AdminUserDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Unclaimed earnings</CardTitle>
          <CardDescription>
            Accrued from engagement. Not spendable — it becomes wallet money
            only when they claim it, and their milestones have to allow that.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="divide-y">
            <Row label="Balance" value={formatNaira(user.earnings.balance)} />
            {user.earnings.by_type.map((entry) => (
              <Row
                key={entry.type}
                label={`${entry.type} · ${formatNumber(entry.events)}`}
                value={formatNaira(entry.kobo)}
              />
            ))}
          </div>
          {user.earnings.top_boosters.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Top boosters
              </p>
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
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base">Wallet</CardTitle>
            <CardDescription>
              Real, spendable money, backed by the ledger. Every movement has
              two sides and can be traced.
            </CardDescription>
          </div>
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
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payout account</CardTitle>
        </CardHeader>
        <CardContent>
          {user.payout_account ? (
            <div className="divide-y">
              <Row label="Bank" value={user.payout_account.bank_name} />
              <Row
                label="Account name"
                value={user.payout_account.account_name}
              />
              <Row
                label="Account"
                value={`•••• ${user.payout_account.account_last4}`}
              />
              <Row
                label="Linked"
                value={formatDate(user.payout_account.created_at)}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No payout account linked.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          {user.recent_withdrawals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No withdrawals.</p>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
