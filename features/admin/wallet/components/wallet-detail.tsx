"use client"

import { Snowflake, Sun } from "lucide-react"
import { ConfirmAction } from "@/components/admin/confirm-action"
import { DetailHeader, Stat, StatGrid } from "@/components/admin/detail"
import { UserInline } from "@/components/admin/user-inline"
import { TableFrame } from "@/components/data-table/table-frame"
import { CanAct } from "@/components/rbac/can"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate, formatNaira, formatNumber } from "@/lib/format"
import { WalletAdjustForm } from "./wallet-adjust-form"
import type { useWalletMutations } from "../hooks/use-wallet"
import type { WalletDetail as WalletDetailData } from "../types"

function Empty({ what, columns }: { what: string; columns: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={columns}
        className="py-8 text-center text-sm text-muted-foreground"
      >
        No {what} yet.
      </TableCell>
    </TableRow>
  )
}

export function WalletDetail({
  wallet,
  actions,
}: {
  wallet: WalletDetailData
  actions: ReturnType<typeof useWalletMutations>
}) {
  const frozen = wallet.frozen_at !== null

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={formatNaira(wallet.balance)}
        badges={
          <>
            {frozen ? (
              <Badge variant="destructive">
                <Snowflake className="size-3" />
                Frozen
              </Badge>
            ) : null}
            {wallet.pin_locked ? (
              <Badge variant="outline">PIN locked</Badge>
            ) : null}
          </>
        }
        subtitle="Spendable balance, and every movement behind it."
        meta={
          <>
            <span>Opened {formatDate(wallet.created_at)}</span>
            {frozen ? <span>Frozen {formatDate(wallet.frozen_at)}</span> : null}
          </>
        }
        actions={
          <CanAct permission="wallet.freeze">
            {frozen ? (
              <ConfirmAction
                label="Unfreeze"
                icon={<Sun />}
                confirmVariant="default"
                title="Unfreeze this wallet?"
                description="They can spend and withdraw again straight away."
                confirmLabel="Unfreeze wallet"
                pending={actions.freeze.isPending}
                onConfirm={(close) =>
                  actions.freeze.mutate({ frozen: false }, { onSuccess: close })
                }
              />
            ) : (
              <ConfirmAction
                label="Freeze"
                icon={<Snowflake />}
                variant="destructive"
                title="Freeze this wallet?"
                description="They stop being able to spend or withdraw straight away. Money still lands in it, and the balance is untouched."
                confirmLabel="Freeze wallet"
                pending={actions.freeze.isPending}
                onConfirm={(close) =>
                  actions.freeze.mutate({ frozen: true }, { onSuccess: close })
                }
              />
            )}
          </CanAct>
        }
      />

      {wallet.user ? (
        <div className="rounded-lg border px-4 py-3">
          <UserInline user={wallet.user} note="Holder" />
        </div>
      ) : null}

      <StatGrid columns={4}>
        <Stat label="Balance" value={formatNaira(wallet.balance)} />
        <Stat label="Movements" value={formatNumber(wallet.entries_count)} />
        <Stat label="Deposits" value={formatNumber(wallet.deposits.length)} />
        <Stat
          label="Payout recipients"
          value={formatNumber(wallet.recipients.length)}
        />
      </StatGrid>

      <WalletAdjustForm actions={actions} />

      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries">Movements</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="entries">
          <TableFrame>
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
                {wallet.entries.length === 0 ? (
                  <Empty what="movements" columns={5} />
                ) : (
                  wallet.entries.map((entry) => (
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
                        className={`text-right tabular-nums ${entry.amount < 0 ? "text-destructive" : ""}`}
                      >
                        {entry.amount > 0 ? "+" : ""}
                        {formatNaira(entry.amount)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNaira(entry.balance_after)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableFrame>
        </TabsContent>

        <TabsContent value="deposits">
          <TableFrame
            description={
              wallet.virtual_account
                ? `Personal account ${wallet.virtual_account.account_number ?? "—"} · ${wallet.virtual_account.bank_name ?? "—"} (${wallet.virtual_account.status})`
                : undefined
            }
          >
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
                {wallet.deposits.length === 0 ? (
                  <Empty what="deposits" columns={4} />
                ) : (
                  wallet.deposits.map((deposit) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableFrame>
        </TabsContent>

        <TabsContent value="recipients">
          <TableFrame>
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
                {wallet.recipients.length === 0 ? (
                  <Empty what="recipients" columns={4} />
                ) : (
                  wallet.recipients.map((recipient, index) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableFrame>
        </TabsContent>
      </Tabs>
    </div>
  )
}
