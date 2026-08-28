"use client"

import { Snowflake, Sun } from "lucide-react"
import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate, formatNaira } from "@/lib/format"
import { UserCell } from "../shared/user-cell"
import { useWallet, useWalletMutations } from "./use-wallet"

export function WalletDetailView({ userId }: { userId: string }) {
  const query = useWallet(userId)
  const mutations = useWalletMutations(userId)
  const [delta, setDelta] = useState("")
  const [reason, setReason] = useState("")

  if (query.isPending) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    )
  }
  if (!query.data) {
    return (
      <p className="text-sm text-muted-foreground">
        This user has no wallet yet.
      </p>
    )
  }

  const wallet = query.data
  const frozen = wallet.frozen_at !== null
  const kobo = Math.round(Number(delta) * 100)
  const canSubmit =
    Number.isFinite(kobo) && kobo !== 0 && reason.trim().length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="flex flex-col gap-2">
              <UserCell user={wallet.user} />
              <CardTitle className="text-3xl tabular-nums">
                {formatNaira(wallet.balance)}
              </CardTitle>
              <div className="flex gap-2">
                {frozen && (
                  <Badge variant="destructive">
                    <Snowflake className="size-3" />
                    Frozen
                  </Badge>
                )}
                {wallet.pin_locked && (
                  <Badge variant="outline">PIN locked</Badge>
                )}
              </div>
            </div>
            <CanAct permission="wallet.freeze">
              <Button
                variant={frozen ? "outline" : "destructive"}
                size="sm"
                disabled={mutations.freeze.isPending}
                onClick={() => mutations.freeze.mutate({ frozen: !frozen })}
              >
                {frozen ? <Sun /> : <Snowflake />}
                {frozen ? "Unfreeze" : "Freeze"}
              </Button>
            </CanAct>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adjust</CardTitle>
            <CardDescription>
              Posts against the adjustments pool, so the entries still explain
              the balance.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="delta">Amount in naira</Label>
              <Input
                id="delta"
                inputMode="decimal"
                placeholder="-500 to take money back"
                value={delta}
                onChange={(event) => setDelta(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                placeholder="Why this is being moved"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </div>
            <CanAct permission="wallet.adjust">
              <Button
                disabled={!canSubmit || mutations.adjust.isPending}
                onClick={() =>
                  mutations.adjust.mutate(
                    { delta: kobo, reason: reason.trim() },
                    {
                      onSuccess: () => {
                        setDelta("")
                        setReason("")
                      },
                    }
                  )
                }
              >
                Post adjustment
              </Button>
            </CanAct>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries">Movements</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="entries">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Kind</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance after</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wallet.entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(entry.created_at)}
                    </TableCell>
                    <TableCell className="text-sm capitalize">
                      {entry.transaction.type.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {entry.transaction.reference}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums ${
                        entry.amount < 0 ? "text-destructive" : ""
                      }`}
                    >
                      {entry.amount > 0 ? "+" : ""}
                      {formatNaira(entry.amount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNaira(entry.balance_after)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="deposits">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wallet.deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(deposit.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {deposit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {deposit.channel ?? "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNaira(deposit.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {wallet.virtual_account && (
            <p className="mt-3 text-sm text-muted-foreground">
              Personal account: {wallet.virtual_account.account_number ?? "—"} ·{" "}
              {wallet.virtual_account.bank_name ?? "—"} (
              {wallet.virtual_account.status})
            </p>
          )}
        </TabsContent>

        <TabsContent value="recipients">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kind</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Last used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wallet.recipients.map((recipient, index) => (
                  <TableRow key={`${recipient.kind}-${index}`}>
                    <TableCell className="text-sm capitalize">
                      {recipient.kind}
                    </TableCell>
                    <TableCell className="text-sm">
                      {recipient.bank_name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {recipient.account_name ?? "—"} ····
                      {recipient.account_last4 ?? ""}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(recipient.last_used_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
