import { Snowflake, Sun } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  DetailHeader,
  Stat,
  StatGrid,
} from "@/features/admin/shell/components/detail"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { formatDate, formatNaira, formatNumber } from "@/lib/format"
import type {
  AdjustWalletInput,
  WalletDetail as WalletDetailData,
} from "../types"
import { WALLET_TAB_LABELS, WALLET_TABS, type WalletTab } from "../utils/wallet"
import { WalletAdjustForm } from "./wallet-adjust-form"
import { WalletStateBadge } from "./wallet-state-badge"
import {
  WalletDepositsTable,
  WalletEntriesTable,
  WalletRecipientsTable,
} from "./wallet-tables"

export function WalletDetail({
  wallet,
  tab,
  onTabChange,
  onFreeze,
  onUnfreeze,
  onAdjust,
}: {
  wallet: WalletDetailData
  tab: WalletTab
  onTabChange: (tab: WalletTab) => void
  onFreeze: () => Promise<unknown>
  onUnfreeze: () => Promise<unknown>
  onAdjust: (input: AdjustWalletInput) => Promise<unknown>
}) {
  const frozen = wallet.frozen_at !== null

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={formatNaira(wallet.balance)}
        badges={
          <>
            {frozen ? <WalletStateBadge frozenAt={wallet.frozen_at} /> : null}
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
                trigger={
                  <Button variant="outline" size="sm">
                    <Sun />
                    Unfreeze
                  </Button>
                }
                tone="default"
                title="Unfreeze this wallet?"
                description="They can spend and withdraw again straight away."
                confirmLabel="Unfreeze wallet"
                onConfirm={() => onUnfreeze()}
              />
            ) : (
              <ConfirmAction
                trigger={
                  <Button variant="destructive" size="sm">
                    <Snowflake />
                    Freeze
                  </Button>
                }
                title="Freeze this wallet?"
                description="They stop being able to spend or withdraw straight away. Money still lands in it, and the balance is untouched."
                confirmLabel="Freeze wallet"
                onConfirm={() => onFreeze()}
              />
            )}
          </CanAct>
        }
      />

      {wallet.user ? (
        <div className="rounded-lg border px-4 py-3">
          <UserCell user={wallet.user} note="Holder" />
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

      <WalletAdjustForm balance={wallet.balance} onSubmit={onAdjust} />

      <Tabs
        value={tab}
        onValueChange={(next) => onTabChange(next as WalletTab)}
      >
        <TabsList>
          {WALLET_TABS.map((key) => (
            <TabsTrigger key={key} value={key}>
              {WALLET_TAB_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="entries">
          <WalletEntriesTable entries={wallet.entries} />
        </TabsContent>
        <TabsContent value="deposits">
          <WalletDepositsTable
            deposits={wallet.deposits}
            account={wallet.virtual_account}
          />
        </TabsContent>
        <TabsContent value="recipients">
          <WalletRecipientsTable recipients={wallet.recipients} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
