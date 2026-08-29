"use client"

import { ExternalLink, ShieldAlert } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { ConfirmAction } from "@/components/admin/confirm-action"
import { Section } from "@/components/admin/detail"
import { SettingGroup, SettingRow } from "@/components/admin/setting-row"
import { CanAct } from "@/components/rbac/can"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, formatNaira } from "@/lib/format"
import {
  BalanceDialog,
  ConfirmDialog,
  DeleteDialog,
  ReasonDialog,
  RolesDialog,
  SuspendDialog,
} from "./user-action-dialogs"
import type { AdminUserDetail } from "../types"
import type { useUserMutations } from "../hooks/use-users"

type Mutations = ReturnType<typeof useUserMutations>

function Settings({
  title,
  description,
  children,
  tone = "default",
}: {
  title: ReactNode
  description: string
  children: ReactNode
  tone?: "default" | "danger"
}) {
  return (
    <Section title={title} description={description}>
      <div
        className={`rounded-lg border ${tone === "danger" ? "border-destructive/40" : ""}`}
      >
        <SettingGroup>{children}</SettingGroup>
      </div>
    </Section>
  )
}

export function UserManagePanel({
  user,
  actions,
}: {
  user: AdminUserDetail
  actions: Mutations
}) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <Settings
        title="Access"
        description="Whether they can use the app, and on which devices."
      >
        <SettingRow
          label="Account"
          state={
            user.suspended_at ? (
              <Badge variant="destructive">Suspended</Badge>
            ) : (
              <Badge variant="secondary">Active</Badge>
            )
          }
          description={
            user.suspended_at
              ? `Since ${formatDate(user.suspended_at)}${
                  user.suspended_until
                    ? `, lifts ${formatDate(user.suspended_until)}`
                    : ", indefinitely"
                }${user.suspended_reason ? ` — ${user.suspended_reason.label}` : ""}`
              : "They can post, message and earn as normal."
          }
          action={
            <CanAct permission="users.suspend">
              {user.suspended_at ? (
                <ConfirmAction
                  label="Reinstate"
                  confirmVariant="default"
                  title="Lift this suspension?"
                  description="They can post, message and earn again straight away."
                  confirmLabel="Reinstate them"
                  pending={actions.unsuspend.isPending}
                  onConfirm={(close) =>
                    actions.unsuspend.mutate(undefined, { onSuccess: close })
                  }
                />
              ) : (
                <SuspendDialog actions={actions} />
              )}
            </CanAct>
          }
        />
        <SettingRow
          label="Sessions"
          description="Signs them out of every device. They can sign back in."
          action={
            <CanAct permission="users.revoke_sessions">
              <ConfirmAction
                label="Revoke all"
                title="Sign this account out everywhere?"
                description="Every device is signed out immediately. They can sign back in with a fresh code."
                confirmLabel="Revoke sessions"
                pending={actions.revoke.isPending}
                onConfirm={(close) =>
                  actions.revoke.mutate(undefined, { onSuccess: close })
                }
              />
            </CanAct>
          }
        />
        <SettingRow
          label="Role"
          state={
            <Badge variant={user.role === "admin" ? "default" : "outline"}>
              {user.role}
            </Badge>
          }
          description="Which consoles they can reach, and what they may do there."
          action={
            <CanAct permission="roles.read">
              <RolesDialog user={user} />
            </CanAct>
          }
        />
      </Settings>

      <Settings
        title="Money"
        description="Two separate balances. Earnings are what they have accrued; the wallet is what they can actually spend."
      >
        <SettingRow
          label="Unclaimed earnings"
          state={
            <span className="text-sm font-semibold tabular-nums">
              {formatNaira(user.earnings.balance)}
            </span>
          }
          description="Accrued from engagement. Not spendable — it only becomes wallet money once they claim it, which their milestones have to allow."
          action={
            <CanAct permission="users.adjust_balance">
              <BalanceDialog user={user} actions={actions} />
            </CanAct>
          }
        />
        <SettingRow
          label="Wallet"
          description="Real, spendable money, backed by the ledger. Adjustments post through the adjustments account."
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
        <SettingRow
          label="Earning"
          state={
            user.earnings_paused_at ? (
              <Badge variant="secondary">Paused</Badge>
            ) : (
              <Badge variant="secondary">Accruing</Badge>
            )
          }
          description={
            user.earnings_paused_at
              ? `Paused ${formatDate(user.earnings_paused_at)}${
                  user.earnings_paused_reason
                    ? ` — ${user.earnings_paused_reason}`
                    : ""
                }`
              : "New engagement keeps crediting them."
          }
          action={
            <CanAct permission="users.moderate_earnings">
              {user.earnings_paused_at ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actions.resumeEarnings.isPending}
                  onClick={() => actions.resumeEarnings.mutate()}
                >
                  Resume
                </Button>
              ) : (
                <ReasonDialog
                  triggerLabel="Pause"
                  title="Pause earning"
                  description="Stops new credits. The account stays fully active and keeps what it already has."
                  confirmLabel="Pause earning"
                  pending={actions.pauseEarnings.isPending}
                  onConfirm={(reason, close) =>
                    actions.pauseEarnings.mutate(reason, { onSuccess: close })
                  }
                />
              )}
            </CanAct>
          }
        />
        <SettingRow
          label="Withdrawals"
          state={
            user.payouts_blocked_at ? (
              <Badge variant="destructive">Blocked</Badge>
            ) : (
              <Badge variant="secondary">Allowed</Badge>
            )
          }
          description={
            user.payouts_blocked_at
              ? `Blocked ${formatDate(user.payouts_blocked_at)}${
                  user.payouts_blocked_reason
                    ? ` — ${user.payouts_blocked_reason}`
                    : ""
                }`
              : "They can cash out to a bank."
          }
          action={
            <CanAct permission="users.moderate_payouts">
              {user.payouts_blocked_at ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actions.unblockPayouts.isPending}
                  onClick={() => actions.unblockPayouts.mutate()}
                >
                  Unblock
                </Button>
              ) : (
                <ReasonDialog
                  triggerLabel="Block"
                  title="Block withdrawals"
                  description="Stops them cashing out. The balance stays where it is."
                  confirmLabel="Block withdrawals"
                  pending={actions.blockPayouts.isPending}
                  onConfirm={(reason, close) =>
                    actions.blockPayouts.mutate(reason, { onSuccess: close })
                  }
                />
              )}
            </CanAct>
          }
        />
      </Settings>

      <Settings
        title="Reach"
        description="How far this account's snaccs travel."
      >
        <SettingRow
          label="Audience"
          state={
            <Badge variant={user.posts_globally ? "default" : "outline"}>
              {user.posts_globally ? "Every campus" : "Own campus"}
            </Badge>
          }
          description={
            user.posts_globally
              ? "Their snaccs appear on every campus feed, and they do not earn."
              : "Their snaccs stay on their own campus feed."
          }
          action={
            <CanAct permission="users.set_global">
              {user.posts_globally ? (
                <ConfirmAction
                  label="Bind to campus"
                  confirmVariant="default"
                  title="Bind this account to its campus?"
                  description="Its snaccs leave every other campus feed and go back to its own, and it starts earning again."
                  confirmLabel="Bind it"
                  pending={actions.makeCampusBound.isPending}
                  onConfirm={(close) =>
                    actions.makeCampusBound.mutate(undefined, {
                      onSuccess: close,
                    })
                  }
                />
              ) : (
                <ConfirmDialog
                  triggerLabel="Post everywhere"
                  title="Post to every campus?"
                  description="This account's snaccs will appear on every campus feed, not just its own. It stops earning, because an account that posts everywhere would otherwise out-earn every campus. Snaccs it has already posted move with it."
                  confirmLabel="Post everywhere"
                  pending={actions.makeGlobal.isPending}
                  onConfirm={(close: () => void) =>
                    actions.makeGlobal.mutate(undefined, { onSuccess: close })
                  }
                />
              )}
            </CanAct>
          }
        />
      </Settings>

      <Settings
        tone="danger"
        title={
          <span className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="size-4" />
            Danger zone
          </span>
        }
        description="This cannot be undone."
      >
        <SettingRow
          tone="danger"
          label="Delete account"
          description="Removes the account and everything attached to it. Their counters are unwound on the way out. You have to type their email to confirm."
          action={
            <CanAct permission="users.delete">
              <DeleteDialog user={user} actions={actions} />
            </CanAct>
          }
        />
      </Settings>
    </div>
  )
}
