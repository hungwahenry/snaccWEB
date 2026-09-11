import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import {
  EmptyNote,
  Fact,
  Facts,
  Section,
} from "@/features/admin/shell/components/detail"
import { SettingRow } from "@/features/admin/shell/components/setting-row"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { walletPath, withdrawalPath } from "@/features/admin/shell/routes"
import { humanize, plural } from "@/features/admin/shell/utils/format"
import { WITHDRAWAL_STATUS } from "@/features/admin/withdrawals/utils/status"
import { formatDate, formatNaira, formatNumber } from "@/lib/format"
import type { AdminUserDetail, BankRecipient, UserBooster } from "../types"

type Withdrawal = AdminUserDetail["recent_withdrawals"][number]

const BOOSTERS: Column<UserBooster>[] = [
  {
    id: "account",
    header: "Account",
    cell: (booster) =>
      booster.username ? `@${booster.username}` : booster.email,
  },
  {
    id: "events",
    header: "Times",
    align: "end",
    className: "tabular-nums",
    cell: (booster) => formatNumber(booster.events),
  },
  {
    id: "paid",
    header: "Paid them",
    align: "end",
    className: "tabular-nums",
    cell: (booster) => formatNaira(booster.kobo),
  },
]

const BANKS: Column<BankRecipient>[] = [
  { id: "bank", header: "Bank", cell: (bank) => bank.bank_name ?? "—" },
  {
    id: "account",
    header: "Account",
    cell: (bank) =>
      `${bank.account_name ?? "—"}${bank.account_last4 ? ` ···· ${bank.account_last4}` : ""}`,
  },
  {
    id: "used",
    header: "Last used",
    className: "text-muted-foreground",
    cell: (bank) => formatDate(bank.last_used_at),
  },
]

const WITHDRAWALS: Column<Withdrawal>[] = [
  {
    id: "reference",
    header: "Reference",
    cell: (withdrawal) => (
      <Link
        href={withdrawalPath(withdrawal.id)}
        className="font-mono text-xs underline-offset-4 hover:underline"
      >
        {withdrawal.reference}
      </Link>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    align: "end",
    className: "tabular-nums",
    cell: (withdrawal) => formatNaira(withdrawal.amount),
  },
  {
    id: "status",
    header: "Status",
    cell: (withdrawal) => (
      <StatusBadge status={WITHDRAWAL_STATUS[withdrawal.status]} />
    ),
  },
  {
    id: "requested",
    header: "Asked for",
    className: "text-muted-foreground",
    cell: (withdrawal) => formatDate(withdrawal.created_at),
  },
]

export function UserMoneyTab({ user }: { user: AdminUserDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <Section
        title="Unclaimed earnings"
        description="Paid for engagement but not spendable yet. It becomes wallet money only when they claim it, and their milestones have to allow that."
      >
        <Facts>
          <Fact label="Balance" value={formatNaira(user.earnings.balance)} />
          {user.earnings.by_type.map((entry) => (
            <Fact
              key={entry.type}
              label={`${humanize(entry.type)}, ${plural(entry.events, "time")}`}
              value={formatNaira(entry.kobo)}
            />
          ))}
        </Facts>
      </Section>

      {user.earnings.top_boosters.length > 0 ? (
        <TableFrame
          title="Who paid into it most"
          description="One account paying most of someone's earnings is what farming looks like."
        >
          <DataTable
            columns={BOOSTERS}
            rows={user.earnings.top_boosters}
            rowKey={(booster) => booster.email}
            empty=""
          />
        </TableFrame>
      ) : null}

      <div className="rounded-lg border">
        <SettingRow
          label="Wallet"
          description="Spendable money. Every movement in it has two sides and can be traced."
          action={
            <CanAct permission="wallet.read">
              <Button
                variant="outline"
                size="sm"
                render={<Link href={walletPath(user.id)} />}
              >
                Open wallet
                <ExternalLink />
              </Button>
            </CanAct>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Bank accounts">
          {user.bank_recipients.length === 0 ? (
            <EmptyNote>They have not cashed out to a bank yet.</EmptyNote>
          ) : (
            <TableFrame>
              <DataTable
                columns={BANKS}
                rows={user.bank_recipients}
                rowKey={(bank) =>
                  bank.recipient_code ??
                  `${bank.bank_name}-${bank.account_last4}`
                }
                empty=""
              />
            </TableFrame>
          )}
        </Section>

        <Section title="Recent withdrawals">
          {user.recent_withdrawals.length === 0 ? (
            <EmptyNote>No withdrawals yet.</EmptyNote>
          ) : (
            <TableFrame>
              <DataTable
                columns={WITHDRAWALS}
                rows={user.recent_withdrawals}
                rowKey={(withdrawal) => withdrawal.id}
                empty=""
              />
            </TableFrame>
          )}
        </Section>
      </div>
    </div>
  )
}
